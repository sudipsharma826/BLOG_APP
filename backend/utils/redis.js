import { createClient } from 'redis';
import 'dotenv/config'; // Load environment variables from .env file

console.log('Redis URL is:', process.env.REDIS_URL || 'redis://localhost:6379');

// Create Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 20) {
                console.error('Redis: Too many reconnection attempts, giving up');
                return new Error('Too many reconnection attempts');
            }
            // Exponential backoff: wait 2^retries * 100ms, max 5 seconds
            const delay = Math.min(Math.pow(2, retries) * 100, 5000);
            console.log(`Redis: Reconnecting in ${delay}ms (attempt ${retries})...`);
            return delay;
        },
        connectTimeout: 10000, // 10 second connection timeout
        keepAlive: 5000, // Keep connection alive
    },
    // Enable offline queue to store commands when Redis is disconnected
    enableOfflineQueue: true,
});

// Track connection state
let isConnected = false;
let isConnecting = false;

// Error handling
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err.message);
    isConnected = false;
});

redisClient.on('connect', () => {
    console.log('✅ Redis Client Connected');
    isConnected = true;
    isConnecting = false;
});

redisClient.on('ready', () => {
    console.log('✅ Redis Client Ready and accepting commands');
    isConnected = true;
});

redisClient.on('reconnecting', () => {
    console.log('🔄 Redis Client Reconnecting...');
    isConnecting = true;
    isConnected = false;
});

redisClient.on('end', () => {
    console.log('❌ Redis Client Connection Ended');
    isConnected = false;
    isConnecting = false;
});

// Connect to Redis with retry logic
const connectRedis = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            if (!redisClient.isOpen && !isConnecting) {
                isConnecting = true;
                console.log(`Attempting to connect to Redis (attempt ${i + 1}/${retries})...`);
                await redisClient.connect();
                isConnected = true;
                isConnecting = false;
                console.log('✅ Successfully connected to Redis');
                return true;
            }
            return true;
        } catch (error) {
            isConnecting = false;
            console.error(`Failed to connect to Redis (attempt ${i + 1}/${retries}):`, error.message);
            if (i < retries - 1) {
                const delay = Math.min(Math.pow(2, i) * 1000, 10000);
                console.log(`Waiting ${delay}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    console.log('⚠️ Application will continue without caching');
    return false;
};

// Initial connection
connectRedis();

// Health check function
export const isRedisHealthy = () => {
    return redisClient.isOpen && isConnected;
};


export const getCache = async (key) => {
    try {
        if (!isRedisHealthy()) {
            console.warn('Redis: Client not available for GET operation');
            return null;
        }
        
        const data = await redisClient.get(key);
        if (data) {
            console.log(`✅ Cache HIT: ${key}`);
            return JSON.parse(data);
        }
        console.log(`❌ Cache MISS: ${key}`);
        return null;
    } catch (error) {
        console.error('Redis GET error:', error.message);
        return null;
    }
};


export const setCache = async (key, value, expiration = 3600) => {
    try {
        if (!isRedisHealthy()) {
            console.warn('Redis: Client not available for SET operation');
            return false;
        }
        
        await redisClient.setEx(key, expiration, JSON.stringify(value));
        console.log(`✅ Cache SET: ${key} (expires in ${expiration}s)`);
        return true;
    } catch (error) {
        console.error('Redis SET error:', error.message);
        return false;
    }
};


export const deleteCache = async (keys) => {
    try {
        if (!isRedisHealthy()) {
            console.warn('Redis: Client not available for DELETE operation');
            return false;
        }
        
        const keyArray = Array.isArray(keys) ? keys : [keys];
        const deleted = await redisClient.del(keyArray);
        console.log(`✅ Cache DELETE: ${deleted} key(s) deleted`);
        return true;
    } catch (error) {
        console.error('Redis DELETE error:', error.message);
        return false;
    }
};


export const deleteCachePattern = async (pattern) => {
    try {
        if (!isRedisHealthy()) {
            console.warn('Redis: Client not available for DELETE PATTERN operation');
            return false;
        }
        
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`✅ Cache PATTERN DELETE: ${keys.length} key(s) matching "${pattern}" deleted`);
        } else {
            console.log(`ℹ️ Cache PATTERN DELETE: No keys found matching "${pattern}"`);
        }
        return true;
    } catch (error) {
        console.error('Redis DELETE PATTERN error:', error.message);
        return false;
    }
};


export const clearAllCache = async () => {
    try {
        if (!isRedisHealthy()) {
            console.warn('Redis: Client not available for FLUSH operation');
            return false;
        }
        
        await redisClient.flushDb();
        console.log('✅ Cache FLUSH: All cache cleared');
        return true;
    } catch (error) {
        console.error('Redis FLUSH error:', error.message);
        return false;
    }
};

export default redisClient;
