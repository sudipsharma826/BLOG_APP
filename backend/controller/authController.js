import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utilites/errorHandler.js';
import jwt from 'jsonwebtoken';

// Helper function to validate inputs
const validateInputs = (inputs) => {
  for (let key in inputs) {
    if (!inputs[key] || !inputs[key].trim()) {
      return false;
    }
  }
  return true;
};

/** 
 * SIGNUP ROUTE
 * Registers a new user
 */
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!validateInputs({ username, email, password })) {
    return next(errorHandler(400, 'All fields are required and cannot be empty'));
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, 'Email already exists'));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Response
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error in signup:', err);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

/** 
 * SIGNIN ROUTE
 * Authenticates a user and generates a JWT
 */
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Input validation
  if (!validateInputs({ email, password })) {
    return next(errorHandler(400, 'All fields are required and cannot be empty'));
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(400, `User not found with the email: ${email}`));
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(400, 'Invalid password'));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // Remove password from user object
    const { password: pass, ...rest } = user._doc;

    // Set cookie and send response
    res
      .status(200)
      .cookie('accessToken', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (err) {
    console.error('Error in signin:', err);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

//Google Outh
export const googleouth = async (req, res, next) => {
  const { email, displayName, photoURL } = req.body;
  try {
    const user = await User.findOne({email});
    if(user){
      const token = jwt.sign({id:user._id, email:user.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
      const {password, ...rest} = user._doc;
      res.status(200)
        .cookie("accessToken", token, {
          httpOnly: true
        })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new User({
        username: displayName.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        photoURL,
      });
      await newUser.save();
      const token = jwt.sign({id:newUser._id, email:newUser.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
      const {password, ...rest} = newUser._doc;
      res.status(200)
        .cookie("accessToken", token, {
          httpOnly: true
        })
        .json(rest);
    }
  } catch(error) {
    console.log("Error in googleouth", error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};
