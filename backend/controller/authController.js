import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { getDeviceType, getOperatingSystem, getBrowser } from '../utils/deviceUtils.js';
import sendMail from '../utils/nodemailer.js';
import Subscribe from '../models/subscribeModel.js';

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
    await sendMail({
      email,
      subject: 'Welcome to Sudip Sharma Blog – Let’s Get Started!',
      message: null,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDWbNklDVmYkFY8qpAEi1wO-nDVSdiW9hLmf4JqUQyyKFiK_cCS4ZtcqOTD_XKc2faeOCenbFAr9nSEG9ZcC7wy3t1KFbnXUyMaQpi_mF61oSTxluNRr3lQe0-zz9-uYh-45WZGlBzWOr5ZjNfRbTx3DwptVtSwequyJ_70fdX1nbYxz4PpaTER6_0LLw/s1600/Screenshot_2024-05-18_163234-removebg-preview.png" alt="Sudip Sharma Logo" style="max-width: 200px; border-radius: 10px;">
        </div>
        <h2 style="color: #333;">Welcome, ${newUser.username}!</h2>
        <p style="font-size: 16px; line-height: 1.5;">We are delighted to have you join our Blog Management System! Here’s a motivational thought to inspire you:</p>
        <blockquote style="font-size: 18px; line-height: 1.5; font-style: italic; color: #555; margin: 20px 0;">
          "Every accomplishment starts with the decision to try."
        </blockquote>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">You can now log in to your account and explore the exciting features we offer.</p>
        <p style="font-size: 16px; line-height: 1.5;">For assistance, feel free to reach out to us:</p>
        <ul style="font-size: 16px; line-height: 1.5; padding-left: 20px;">
          <li><strong>Email:</strong> <a href="mailto:info@sudipsharma.com.np" style="color: #007BFF;">info@sudipsharma.com.np</a></li>
          <li><strong>Mobile:</strong> 9816662624</li>
        </ul>
        <p style="font-size: 16px; line-height: 1.5;">Connect with us on social media:</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://www.linkedin.com/in/sudipsharmanp/" style="margin-right: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 30px; height: 30px;">
          </a>
          <a href="https://www.facebook.com/sudipsharma.np/" style="margin-left: 10px;">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 30px; height: 30px;">
          </a>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://sudipsharma.com.np" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
        </div>
        <p style="font-size: 16px; line-height: 1.5; margin-top: 30px; text-align: center; color: #666;">
          Thank you for being part of our community!<br>
          <strong>- Sudip Sharma Team</strong>
        </p>
      </div>
    `,
    });

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

    // Track the device of the user signing in
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

    // Check if the user's email is already in the subscribe list
    const existingSubscriber = await Subscribe.findOne({ email: user.email });
    if (!existingSubscriber) {
      // Add the user to the subscription list only if they are not already subscribed
      await Subscribe.create({
        email: user.email,
        isUser: true,
        subscribeDate: new Date(),
      });
      await Subscribe.save();
    }

    const { password: pass, ...rest } = user._doc;

    // Cookie options: for cross-site deployments (frontend on Netlify, backend on another domain)
    // we need SameSite=None and secure=true so browsers accept the cookie in cross-site contexts.
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    };

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

      // Check if the email is already in the subscription list
      const existingSubscriber = await Subscribe.findOne({ email });
      if (!existingSubscriber) {
        // Add the user to the subscription list
        await Subscribe.create({
          email,
          userId: user._id, // Link subscription to the user
          isUser: true,
          subscribeDate: new Date(),
        });
      }

      // Send welcome email asynchronously
      sendMail({
        email,
        subject: 'Welcome to Sudip Sharma Blog – Let’s Get Started!',
        message: null,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDWbNklDVmYkFY8qpAEi1wO-nDVSdiW9hLmf4JqUQyyKFiK_cCS4ZtcqOTD_XKc2faeOCenbFAr9nSEG9ZcC7wy3t1KFbnXUyMaQpi_mF61oSTxluNRr3lQe0-zz9-uYh-45WZGlBzWOr5ZjNfRbTx3DwptVtSwequyJ_70fdX1nbYxz4PpaTER6_0LLw/s1600/Screenshot_2024-05-18_163234-removebg-preview.png" alt="Sudip Sharma Logo" style="max-width: 200px; border-radius: 10px;">
            </div>
            <h2 style="color: #333;">Welcome, ${user.username}!</h2>
            <p style="font-size: 16px; line-height: 1.5;">We are delighted to have you join our Blog Management System! Here’s a motivational thought to inspire you:</p>
            <blockquote style="font-size: 18px; line-height: 1.5; font-style: italic; color: #555; margin: 20px 0;">
              "Every accomplishment starts with the decision to try."
            </blockquote>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">You can now log in to your account and explore the exciting features we offer.</p>
            <p style="font-size: 16px; line-height: 1.5;">For assistance, feel free to reach out to us:</p>
            <ul style="font-size: 16px; line-height: 1.5; padding-left: 20px;">
              <li><strong>Email:</strong> <a href="mailto:info@sudipsharma.com.np" style="color: #007BFF;">info@sudipsharma.com.np</a></li>
              <li><strong>Mobile:</strong> 9816662624</li>
            </ul>
            <p style="font-size: 16px; line-height: 1.5;">Connect with us on social media:</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="https://www.linkedin.com/in/sudipsharmanp/" style="margin-right: 10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 30px; height: 30px;">
              </a>
              <a href="https://www.facebook.com/sudipsharma.np/" style="margin-left: 10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 30px; height: 30px;">
              </a>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://sudipsharma.com.np" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
            </div>
            <p style="font-size: 16px; line-height: 1.5; margin-top: 30px; text-align: center; color: #666;">
              Thank you for being part of our community!<br>
              <strong>- Sudip Sharma Team</strong>
            </p>
          </div>
        `,
      });

      // Save the new user
      await user.save();
    }

    // Update user login details
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

    // Cookie options: for cross-site deployments (frontend on Netlify, backend on another domain)
    // we need SameSite=None and secure=true so browsers accept the cookie in cross-site contexts.
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
      path: '/',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    };

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

// Maintenance Mode Status (if Maintenance Mode is on, return true; otherwise, return false)
export const maintenanceStatus = async (req, res, next) => {
  try {
    // Fetch all users that are not admins
    const users = await User.find({ isAdmin: false });

    // Check if any user has maintenance mode enabled
    const isMaintenance = users.some((user) => user.iNMaintenance);

    // Return the maintenance status
    return res.status(200).json({ isMaintenance });
  } catch (error) {
    console.error("Error in maintenanceStatus:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

