import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { getDeviceType, getOperatingSystem, getBrowser } from '../utils/deviceUtils.js';

// Helper function to validate inputs
const validateInputs = (inputs) => {
  for (let key in inputs) {
    if (!inputs[key] || !inputs[key].trim()) {
      return false;
    }
  }
  return true;
};

// Helper function to track device information with a device limit
const trackDevice = async (req, userId) => {
  const userAgent = req.headers['user-agent'];
  const deviceType = getDeviceType(userAgent);
  const os = getOperatingSystem(userAgent);
  const browser = getBrowser(userAgent);
  const ip = req.ip || req.connection.remoteAddress; // Ensure a valid IP is captured
  const loginTime = new Date();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.devices.length >= 2) {
    user.devices.shift(); // Remove the oldest device
  }

  user.devices.push({ deviceType, os, browser, ip, loginTime });
  await user.save();
  return user;
};

// SIGNUP ROUTE
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!validateInputs({ username, email, password })) {
    return next(errorHandler(400, 'All fields are required and cannot be empty'));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, 'Email already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error in signup:', err);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

// SIGNIN ROUTE
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateInputs({ email, password })) {
    return next(errorHandler(400, 'All fields are required and cannot be empty'));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(400, `User not found with the email: ${email}`));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(400, 'Invalid password'));
    }

    await trackDevice(req, user._id);

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin, iNMaintenance: user.iNMaintenance },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    user.lastLogin = new Date();
    user.isSignIn = true;
    user.currentToken = token;
    await user.save();

    const { password: pass, ...rest } = user._doc;

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
      path: '/',
      sameSite: 'lax',
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.status(200).cookie('accessToken', token, cookieOptions).json(rest);
  } catch (err) {
    console.error('Error in signin:', err);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

// GOOGLE OAUTH ROUTE
export const googleouth = async (req, res, next) => {
  const { email, displayName, photoURL } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      user = new User({
        username: displayName.toLowerCase().replace(/\s+/g, '') + Math.random().toString().slice(-4),
        email,
        password: hashedPassword,
        photoURL,
        isAdmin: false,
      });
      await user.save();
    }

    await trackDevice(req, user._id);

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin, iNMaintenance: user.iNMaintenance },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    user.lastLogin = new Date();
    user.isSignIn = true;
    user.currentToken = token;
    await user.save();

    const { password, ...rest } = user._doc;

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
      path: '/',
      sameSite: 'lax',
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.status(200).cookie('accessToken', token, cookieOptions).json(rest);
  } catch (error) {
    console.error('Error in googleouth:', error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

// Enable Maintenance Mode
export const enableMaintenance = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admin can toggle maintenance mode'));
  }

  try {
    const nonAdminUsers = await User.find({ isAdmin: false });

    await Promise.all(
      nonAdminUsers.map((user) => {
        user.iNMaintenance = true;
        return user.save();
      })
    );

    res.status(200).json({ message: 'Maintenance mode enabled successfully' });
  } catch (error) {
    console.error('Error in enableMaintenance:', error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

// Disable Maintenance Mode
export const disableMaintenance = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Only admin can toggle maintenance mode'));
  }

  try {
    const nonAdminUsers = await User.find({ isAdmin: false });

    await Promise.all(
      nonAdminUsers.map((user) => {
        user.iNMaintenance = false;
        return user.save();
      })
    );

    res.status(200).json({ message: 'Maintenance mode disabled successfully' });
  } catch (error) {
    console.error('Error in disableMaintenance:', error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

//Maintenance Mode Status  ( if maintencawe Mode is on then return true else false)
export const maintenanceStatus = async (req, res, next) => {
  
  try {
    const users = await User.find({ isAdmin: false });
    const isMaintenance = users.some((user) => user.iNMaintenance);
    
      return res.status(200).json({ isMaintenance });
  } catch (error) {
    console.error('Error in maintenanceStatus:', error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};
