import bcrypt from 'bcrypt';
import { errorHandler } from '../middleware/errorHandler.js';
import User from '../models/userModel.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { username, email, password } = req.body;

  try {
    // Check if the logged-in user is authorized to update this user
    if (req.user.id !== userId) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    let hashedPassword;
    if (password) {
      if (password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let photoURL = user.photoURL;

    // Handle file upload if a new image is provided
    if (req.file) {
      try {
        // Delete old image if it exists
        if (user.photoURL) {
          // Extract public ID from Cloudinary URL
          // URL format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[public_id].[extension]
          const urlParts = user.photoURL.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = `blog_app_users/${publicIdWithExtension.split('.')[0]}`;
          await deleteFromCloudinary(publicId);
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file);
        photoURL = uploadResult.secure_url;
      } catch (error) {
        console.error('Error handling image:', error);
        return next(errorHandler(500, 'Error processing image upload'));
      }
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: username || user.username,
          email: email || user.email,
          ...(hashedPassword && { password: hashedPassword }),
          photoURL
        }
      },
      { new: true }
    );

    // Remove password from response
    const { password: pass, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
};

//Deleted User
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Extract the public_id from the Cloudinary URL
    const imageUrl = user.photoURL; // Ensure 'photoURL' exists in the user schema
    if (imageUrl) {
      const urlParts = imageUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `blog_app_users/${publicIdWithExtension.split('.')[0]}`; // Adjust the folder name as necessary

      // Delete the image from Cloudinary
      await deleteFromCloudinary(publicId);
    }

    // Delete the user from the database
    await User.findByIdAndDelete(req.params.userId);

    res.
    clearCookie('accessToken')
    .status(200).
    json('User and associated profile image have been deleted');
  } catch (error) {
    next(error);
  }
};


//SignOut
export const signout = (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'UnAuthorized'));
  }
  try {
  
    res
      .clearCookie('accessToken')
      .status(200)
      .json('User has been signed out');
      
  } catch (error) {
    next(error);
  }
 
};


//Get All User
export const getUser = async (req, res, next) => {
  if(!req.user.isAdmin){
    return next(errorHandler(403, 'UnAuthorized'));
  }
  try{
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    const getUsers = await User.find()
    .skip(startIndex)
    .limit(limit)
    .sort({createdAt: sortDirection});

    //Remove the password from the response
    const users = getUsers.map(user => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    //Total number of users
    const totalUsers = await User.countDocuments();

    //Total user In Last Month
   const now= new Date();
   const oneMonthAgo = new Date(
    now.getFullYear(), 
    now.getMonth() - 1, //Subtract 1 month to get the last month
    now.getDate()
  );
  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: oneMonthAgo }
  });
  res.status(200).json({ users, totalUsers, lastMonthUsers });

  }catch(error){
    next(error);
  }
};