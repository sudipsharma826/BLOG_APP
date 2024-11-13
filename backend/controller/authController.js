//Importing the Models
import User from '../models/userModel.js';

//Register a new user
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Create a new user object
  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  try {
    await newUser.save();
    res.status(201).send("User added successfully!");
  } catch (err) {
    console.error('Error:', err);
    res.status(400).send("Error adding user: " + err.message);
  }
}
