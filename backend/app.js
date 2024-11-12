import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userModel.js';

// Load environment variables from .env file
dotenv.config();

// Server Setup
const app = express();
app.use(cors()); // Middleware to enable CORS


// Middleware to parse incoming form data
app.use(express.json()); // For parsing JSON data (for POST requests)

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((error) => {
    console.error('DB Connection Error:', error);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Hello Sudip");
});

// POST route to add user data
app.post("/test", async (req, res) => {
  const { name, email, password } = req.body;

  // Create a new user object
  const newUser = new User({
    name: name,
    email: email,
    password: password,
  });

  try {
    // Save the new user to the database
    await newUser.save();
    res.status(201).send("User added successfully!");
  } catch (err) {
    console.error('Error:', err);  // Log the error to the console
    res.status(400).send("Error adding user: " + err.message);
  }
});

// Listen to port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
