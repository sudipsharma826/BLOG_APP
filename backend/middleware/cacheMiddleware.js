import { getCache, setCache } from '../utils/redis.js';

/**
 * Cache middleware for Express routes
 * @param {number} expiration - Cache expiration time in seconds (default: 3600 = 1 hour)
 * @returns {Function} - Express middleware function
 */
export const cacheMiddleware = (expiration = 3600) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        try {
            // Generate a unique cache key based on the request
            const cacheKey = generateCacheKey(req);

            // Try to get data from cache
            const cachedData = await getCache(cacheKey);

            if (cachedData) {
                console.log(`Cache HIT: ${cacheKey}`);
                return res.status(200).json(cachedData);
            }

            console.log(`Cache MISS: ${cacheKey}`);

            // Store the original res.json function
            const originalJson = res.json.bind(res);

            // Override res.json to cache the response
            res.json = function (data) {
                // Only cache successful responses (status 200)
                if (res.statusCode === 200) {
                    setCache(cacheKey, data, expiration).catch((err) => {
                        console.error('Failed to set cache:', err.message);
                    });
                }
                // Call the original json function
                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error.message);
            // Continue without caching if there's an error
            next();
        }
    };
};

/**
 * Generate a unique cache key based on request properties
 * @param {Object} req - Express request object
 * @returns {string} - Cache key
 */
const generateCacheKey = (req) => {
    const baseUrl = req.originalUrl || req.url;
    const params = JSON.stringify(req.query || {});
    const userId = req.user?.id || 'guest';

    // Create a structured cache key
    return `cache:${baseUrl}:${params}:${userId}`;
};

export default cacheMiddleware;
