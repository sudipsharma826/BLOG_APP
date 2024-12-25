import bcrypt from 'bcrypt';
import { errorHandler } from '../middleware/errorHandler.js';
import User from '../models/userModel.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { getDeviceType, getOperatingSystem, getBrowser } from '../utils/deviceUtils.js'; // Device utilities

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
    res.clearCookie('accessToken').status(200).json('User has been deleted');
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

    res.clearCookie('accessToken').status(200).json({ message: 'Successfully signed out' });
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
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to view this user'));
  }

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
