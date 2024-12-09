import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';
export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken; // Acess the token from the cookie that we set the token name in the controller in signin
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    req.user = user; // Set the user object in the request (in whole system it can be acessed)
    next();
  });
};