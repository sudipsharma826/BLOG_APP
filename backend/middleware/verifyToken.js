import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;


  if (!token) {
    return next(errorHandler(401, 'Unauthorized: No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized: Invalid token'));
    }

    req.user = user;
    next();
  });
};
