import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import './utils/redis.js'; // Initialize Redis connection
import { isRedisHealthy, clearAllCache } from './utils/redis.js'; // Import health check and cache clear functions

// Load environment variables
dotenv.config();

// Server Setup
const app = express();


// Middleware
  // Allow CORS for the frontend origin (important: browsers enforce this; Postman does not)
  const clientOrigin = process.env.CLIENT_URL;
  app.use(cors({ origin: [clientOrigin,"https://sudipsharma.com.np"], credentials: true }));
  // Preflight OPTIONS requests are handled by app.use(cors(...)) in Express v5+
    
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
import metaRoutes from './routes/metaRoutes.js';


// Using Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/meta', metaRoutes);


// Global error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const response = {
    message: err.message || 'Internal Server Error',
  };

  res.status(statusCode).json(response);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const redisStatus = isRedisHealthy() ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      redis: redisStatus,
    }
  });
});

// Cache management endpoint (for development/debugging)
app.post('/api/cache/clear', async (req, res) => {
  try {
    const result = await clearAllCache();
    if (result) {
      res.status(200).json({ message: 'Cache cleared successfully' });
    } else {
      res.status(500).json({ error: 'Failed to clear cache - Redis not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cache', details: error.message });
  }
});

// Start Server
const Port= process.env.PORT
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
