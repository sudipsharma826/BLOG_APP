import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Server Setup
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(cookieParser()); // To set the cookies
app.use(express.json());//Processing JSON data

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB Connected'))
  .catch((error) => console.error('DB Connection Error:', error));

// Importing Routes
import authRoutes from './routes/authRoutes.js';

// Using Routes
app.use('/auth', authRoutes);

// Global error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const response = {
    message: err.message || 'Internal Server Error',
  };

  res.status(statusCode).json(response);
});

// Start Server
const Port= process.env.PORT
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});