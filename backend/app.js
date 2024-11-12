import express from 'express';
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file


// MongoDB Connection
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((error) => {
    console.error('DB Connection Error:', error);
  });

//Server Setup
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Sudip");
});

// Listen to port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
