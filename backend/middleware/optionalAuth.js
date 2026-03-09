import jwt from 'jsonwebtoken';

/**
 * Optional authentication middleware
 * Verifies token if present but doesn't fail if missing
 * This allows cache middleware to properly identify admin vs guest requests
 */
export const optionalAuth = async (req, res, next) => {
    try {
        // Check for token in cookie or Authorization header
        let token = req.cookies?.accessToken;
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        // If token exists, verify it
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (!err && user) {
                    req.user = user; // Attach user data if token is valid
                }
                next(); // Continue regardless of token validity
            });
        } else {
            next(); // No token, continue as guest
        }
    } catch (error) {
        // On any error, continue without authentication
        next();
    }
};
