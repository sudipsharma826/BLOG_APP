import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Server Setup
const app = express();



// Middleware
  // Allow CORS for the frontend origin (important: browsers enforce this; Postman does not)
  const clientOrigin = process.env.CLIENT_URL;
  app.use(cors({ origin: clientOrigin, credentials: true }));
  // Ensure preflight OPTIONS requests are handled
  app.options('*', cors({ origin: clientOrigin, credentials: true }));
    
  // Middleware
  app.use(cookieParser()); // To set the cookies
  app.use(express.json()); // Processing JSON data


//Static Files
app.use(express.static('public/uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB Connected'))
  .catch((error) => console.error('DB Connection Error:', error));

// Importing Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';


// Using Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);


// Global error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const response = {
    message: err.message || 'Internal Server Error',
  };

  res.status(statusCode).json(response);
});
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const Port= process.env.PORT
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
