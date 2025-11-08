import bcrypt from 'bcrypt';
import { errorHandler } from '../middleware/errorHandler.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { getDeviceType, getOperatingSystem, getBrowser } from '../utils/deviceUtils.js'; // Device utilities
import Subscribe from '../models/subscribeModel.js';
import sendMail from '../utils/nodemailer.js';

// Function to track device details
const trackDevice = async (req, userId) => {
  const userAgent = req.headers['user-agent'];
  const deviceType = getDeviceType(userAgent);
  const os = getOperatingSystem(userAgent);
  const browser = getBrowser(userAgent);
  const ip = req.ip;

  const user = await User.findById(userId);

  // Restrict devices to a maximum of 2
  if (user.devices.length >= 2) {
    user.devices.shift(); // Remove the oldest device
  }

  user.devices.push({ deviceType, os, browser, ip, loginTime: new Date() });
  await user.save();
};

// Update user
export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { username, email, password } = req.body;

  try {
    if (req.user.id !== userId) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, 'User not found'));

    let hashedPassword;
    if (password) {
      if (password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let photoURL = user.photoURL;

    if (req.file) {
      if (photoURL) {
        const publicId = photoURL.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`blog_app_users/${publicId}`);
      }
      const uploadResult = await uploadToCloudinary(req.file);
      photoURL = uploadResult.secure_url;
    }

    await trackDevice(req, userId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: username || user.username,
          email: email || user.email,
          ...(hashedPassword && { password: hashedPassword }),
          photoURL,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next(errorHandler(404, 'User not found'));

    if (user.photoURL) {
      const publicId = user.photoURL.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`blog_app_users/${publicId}`);
    }

    await User.findByIdAndDelete(req.params.userId);
    if (user.id === user._id) {
      await user.remove(); // Delete the user
      res
        // Clear cookie with same options used to set it (important for cross-site cookies)
        .clearCookie('accessToken', {
          path: '/',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({ message: 'Your account has been deleted successfully.' });
    }

    // Case 2: Admin deletes the user
    else if (user.isAdmin) {
      await user.remove(); // Delete the user
      res.status(200).json({ message: "User has been deleted by the admin." });
    } else {
      return res.status(403).json({ message: "Unauthorized action." });
    }
  } catch (error) {
    next(error);
  }
};

// Sign out
export const signout = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(errorHandler(401, 'You are not signed in'));
    }

    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, 'User not found'));

    //Track isSignIn or not 
    user.isSignIn = false;

    // Remove the current device from the devices array
    const userAgent = req.headers['user-agent'];
    const currentDevice = {
      ip: req.ip,
      deviceType: getDeviceType(userAgent),
      os: getOperatingSystem(userAgent),
      browser: getBrowser(userAgent),
    };

    user.devices = user.devices.filter(
      device =>
        !(
          device.ip === currentDevice.ip &&
          device.deviceType === currentDevice.deviceType &&
          device.os === currentDevice.os &&
          device.browser === currentDevice.browser
        )
    );

    await user.save();

    // clear cookie with the same options used to set it (important for cross-site cookies)
    res.clearCookie('accessToken', {
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    }).status(200).json({ message: 'Successfully signed out' });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to view all users'));
  }

  try {
    const { startIndex = 0, limit = 9, sort = 'desc' } = req.query;
    const users = await User.find()
      .skip(parseInt(startIndex))
      .limit(parseInt(limit))
      .sort({ createdAt: sort === 'asc' ? 1 : -1 });

    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({ users, totalUsers, lastMonthUsers });
  } catch (error) {
    next(error);
  }
};

// Get user by email
export const getUserByEmail = async (req, res, next) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const { username, email, photoURL } = user;
      res.status(200).json({ username, email, photoURL });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// Handle Subscribe
export const handleSubscribe = async (req, res, next) => {
  try {
    // Ensure the request body and user are present
    if (!req.body) {
      return next(errorHandler(400, "Request body is missing."));
    }
    if (!req.user) {
      return next(errorHandler(401, "You are not signed in."));
    }

    const { email } = req.body;
    const userId = req.body.userId || req.user.id;

    // Validate both email and userId
    if (!email || !userId) {
      return next(errorHandler(400, "Email and User ID are required."));
    }

    // Check if the user is already subscribed
    const existingSubscriber = await Subscribe.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "User is already subscribed." });
    }

    // Add user to subscribe list
    const subscriber = new Subscribe({
      email,
      userId,
      isUser: true,
      subscribeDate: new Date(),
    });
    await subscriber.save();

    // Return success response
    return res.status(200).json({
      message: "User successfully subscribed.",
    });
  } catch (error) {
    // Catch unexpected errors
    next(error);
  }
};

// Check if user is subscribed
export const checkSubscribed = async (req, res, next) => {
  try {
    // Ensure the user is signed in
    if (!req.user) {
      return next(errorHandler(401, "You are not signed in."));
    }

    const { email } = req.body;

    // Validate email
    if (!email) {
      return next(errorHandler(400, "Email is required."));
    }

    // Find the subscription by email
    const subscription = await Subscribe.findOne({ email });

    if (!subscription) {
      return res.status(404).json({ message: "User is not subscribed." });
    }

    // User is subscribed
    return res.status(200).json({ message: "User is subscribed." });
  } catch (error) {
    // Catch unexpected errors
    next(error);
  }
};


//Handle Subscribe for Non-users
export const handleSubscribeNonUser = async (req, res, next) => {
  // Ensure Email is present
  const { email } = req.body;
  if (!email) {
    return next(errorHandler(400, "Email is required."));
  }

  try {
    let isUser = false;

    // Check if the email exists or is already subscribed
    const user = await User.findOne({ email });
    if (user) {
      isUser = true;
    }

    //check if the user is already subscribed
    const subscriber = await Subscribe.findOne({ email });
    if (subscriber) {
      return res.status(200).json({ message: "Email is already subscribed." });
    }

    // Check if a non-user is already subscribed
    const nonusrcheck = await Subscribe.findOne({ email });
    if (nonusrcheck) {
      return res.status(200).json({ message: "Email is already subscribed." });
    }

    // Create a new subscription for the non-user
    const nonuser = new Subscribe({
      email,
      isUser,
      subscribeDate: new Date(),
    });
    await nonuser.save();

    return res.status(200).json({ message: "Email successfully subscribed." });
  } catch (error) {
    next(error);
  }
};

//Get Users SavedPosts
export const getSavedPostIds = async (req, res, next) => {
  const { userId } = req.params;
  if(!req.user){
    return next(errorHandler(401, "You are not signed in."));
  }
  try {
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, 'User not found'));

    if(user.savedPosts.length===0){
      return res.status(404).json({ message: "No saved posts found." });
    }
     const savedPostId= user.savedPosts;
    res.status(200).json({ savedPostId });

  } catch (error) {
    next(error);
  }
};

// Unsave a post
export const removeSavedPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  if (!userId || !postId) {
    return res.status(400).json({ error: "No Authorized" });
  }

  try {
    // Step 1: Find the user and validate savedPosts
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(user.savedPosts)) {
      return res.status(400).json({ error: "User's savedPosts is not valid" });
    }

    // Remove the postId from user's savedPosts
    const postIndex = user.savedPosts.indexOf(postId);
    if (postIndex > -1) {
      user.savedPosts.splice(postIndex, 1);
    } else {
      return res
        .status(404)
        .json({ error: "Post not found in user's savedPosts list" });
    }

    // Save the updated user document
    await user.save();

    // Step 2: Find the post and validate usersSavedList
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!Array.isArray(post.usersSaveList)) {
      return res
        .status(400)
        .json({ error: "Post's usersSavedList is not valid" });
    }

    // Remove the userId from post's usersSavedList
    const userIndex = post.usersSaveList.indexOf(userId);
    if (userIndex > -1) {
      post.usersSaveList.splice(userIndex, 1);
    } else {
      return res
        .status(404)
        .json({ error: "User not found in post's usersSavedList" });
    }

    // Save the updated post document
    await post.save();

    // Success response
    return res.status(200).json({
      message:
        "Post removed successfully from user's savedPosts and usersSavedList",
    });
  } catch (error) {
    console.error("Error removing saved post:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Get Subscbibed Users
export const getSubscribedList = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to view all users'));
  }

  try {
    const subscribedUsers = await Subscribe.find();
    res.status(200).json({ subscribedUsers });
  } catch (error) {
    next(error);
  }
};



//sENDING gROUP mIAL    
export const sendEmail = async (req, res, next) => {
  const { email, subject, message } = req.body;
  const file = req.file;

  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to send email"));
  }

  // Validate input data
  if (!email || !subject || !message) {
    return next(errorHandler(400, "Email, subject, and message are required"));
  }

  let imageUrl = null;

  try {
    // If a file is uploaded, upload it to Cloudinary
    if (file) {
      const uploadResult = await uploadToCloudinary(file);
      imageUrl = uploadResult.secure_url;
    }

    // Parse email addresses into an array
    const emailArray = email.split(',');

    // Send the emailget
    await sendMail({
      email: null, // Set to null because BCC is used
      subject: subject,
      message: null, // Set to null since HTML content is provided
      html: message, // Use HTML content from `message`
      bcc: emailArray, // Email addresses passed as BCC
      attachmentUrl: imageUrl, // Attachment URL if available
    });

    // Respond with success
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

//admin deatils
export const getAdmin = async (req, res, next) => {
  try {
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    next(error);
  }
};
