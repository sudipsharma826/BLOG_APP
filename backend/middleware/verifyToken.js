import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';
import User from '../models/userModel.js'; 

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  
 
  // If no token is found
  if (!token) {
    return next(errorHandler(401, 'Unauthorized: No token provided'));
  }
// Verify the token
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized: Invalid token'));
    }

    try {
      // Retrieve the user from the database using the user ID from the token
      const dbUser = await User.findById(user.id);

      // Check if the user is an admin
      if (dbUser.isAdmin) {
        req.user = user; // Attach the user data to the request object for admins
        return next(); // Allow admin users to proceed without restrictions
      }

 // If the user is not an admin and maintenance mode is enabled, deny access
      if (dbUser.isMaintenance) {
        return next(errorHandler(401, 'Maintenance mode is enabled'));
      }

// For non-admin users, proceed as normal
      req.user = user; // Attach the user data to the request object
      
      next();
    } catch (error) {
      return next(errorHandler(500, 'Server error while checking token version'));
    }
  });
};
