//Importing the Models
import User from '../models/userModel.js';

//Importing the packages
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utilites/errorHandler.js';

//Register a new user
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
//Hasing the password
  const hashedpassword = bcryptjs.hashedpassword(password, 10);

  // Create a new user object
  const newUser = new User({
    name: name,
    email: email,
    password: hashedpassword,
  });

  try {
    await newUser.save();
    res.status(201).send("User added successfully!");
  } catch (err) {
    next(errorHandler(500, 'Internal Server Error'));
  }
}
