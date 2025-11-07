import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js'; 

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    console.log("From Form Data:", content, postId, userId);
    console.log("Authenticated User:", req.user);

    // Check if the user making the request matches the comment's userId
    if (req.user.id !== userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create and save the new comment
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    // Add userId to the post's usersCommentList
    await Post.findByIdAndUpdate(postId, {
      $push: { usersCommentList: userId },
    });

    // Add postId to the user's commentPosts list
    await User.findByIdAndUpdate(userId, {
      $push: { commentPosts: postId },
    });

    // Send a success response
    res.status(200).json(newComment);
  } catch (error) {
    console.error("Error in createComment:", error); // Log error for debugging
    next(error);
  }
};

//Get all comments

export const getPostComments = async (req, res, next) => {
  try {
    // Fetch comments and populate the user data (username, image)
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username photoURL'); // Populate username and image from User model

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Like or Unlike a comment
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    // Check if the user has already liked the comment
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      // If user hasn't liked the comment yet, add their ID and increase the number of likes
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      // If user has already liked, remove their ID and decrease the number of likes
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
   
    // Save the updated comment
    await comment.save();
    res.status(200).json(comment); // Return the updated comment with likes count
  } catch (error) {
    next(error);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the logged-in user is the owner of the comment or an admin
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: 'You can only delete your own comments' });
    }

    // Delete the comment from the database
    await Comment.deleteOne({ _id: req.params.commentId });

    // Remove the user from the post's usersCommentList
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { usersCommentList: comment.userId },
    });

    // Remove the post ID from the user's commentPosts list
    await User.findByIdAndUpdate(comment.userId, {
      $pull: { commentPosts: comment.postId },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};


//Get all comments
export const getAllcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, 'You are not allowed to get all comments'));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
