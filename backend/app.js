import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

// Server Setup
const app = express();
app.use(cors()); 



app.use(express.json()); 

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((error) => {
    console.error('DB Connection Error:', error);
  });

//Importing Routes
import authRoutes from './routes/authRoutes.js';


//Use Routes
app.use('', authRoutes);


// Listen to port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
