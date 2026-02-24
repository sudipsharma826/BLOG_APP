import { createClient } from 'redis';
import 'dotenv/config'; // Load environment variables from .env file
console.log('Redis URl is:', process.env.REDIS_URL);
// Create Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('Redis: Too many reconnection attempts, giving up');
                return new Error('Too many reconnection attempts');
            }
            // Exponential backoff: wait 2^retries * 100ms
            return Math.min(retries * 100, 3000);
        }
    }
});

// Error handling
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

redisClient.on('ready', () => {
    console.log('Redis Client Ready');
});

redisClient.on('reconnecting', () => {
    console.log('Redis Client Reconnecting...');
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error.message);
        console.log('Application will continue without caching');
    }
})();


export const getCache = async (key) => {
    try {
        if (!redisClient.isOpen) {
            console.warn('Redis client is not connected');
            return null;
        }
        
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis GET error:', error.message);
        return null;
    }
};


export const setCache = async (key, value, expiration = 3600) => {
    try {
        if (!redisClient.isOpen) {
            console.warn('Redis client is not connected');
            return false;
        }
        
        await redisClient.setEx(key, expiration, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Redis SET error:', error.message);
        return false;
    }
};


export const deleteCache = async (keys) => {
    try {
        if (!redisClient.isOpen) {
            console.warn('Redis client is not connected');
            return false;
        }
        
        const keyArray = Array.isArray(keys) ? keys : [keys];
        await redisClient.del(keyArray);
        return true;
    } catch (error) {
        console.error('Redis DELETE error:', error.message);
        return false;
    }
};


export const deleteCachePattern = async (pattern) => {
    try {
        if (!redisClient.isOpen) {
            console.warn('Redis client is not connected');
            return false;
        }
        
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        return true;
    } catch (error) {
        console.error('Redis DELETE PATTERN error:', error.message);
        return false;
    }
};


export const clearAllCache = async () => {
    try {
        if (!redisClient.isOpen) {
            console.warn('Redis client is not connected');
            return false;
        }
        
        await redisClient.flushDb();
        return true;
    } catch (error) {
        console.error('Redis FLUSH error:', error.message);
        return false;
    }
};

export default redisClient;
