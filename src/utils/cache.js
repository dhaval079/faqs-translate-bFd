// src/utils/cache.js
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redis = null;

const getRedisClient = () => {
    if (!redis) {
        redis = new Redis(process.env.REDIS_URL, {
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
            enableOfflineQueue: false
        });

        redis.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
    }
    return redis;
};

const CACHE_DURATION = 3600; // 1 hour in seconds

const cacheService = {
    async get(key) {
        try {
            const client = getRedisClient();
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    },

    async set(key, data, duration = CACHE_DURATION) {
        try {
            const client = getRedisClient();
            await client.setex(key, duration, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Redis set error:', error);
            return false;
        }
    },

    async del(key) {
        try {
            const client = getRedisClient();
            await client.del(key);
            return true;
        } catch (error) {
            console.error('Redis delete error:', error);
            return false;
        }
    },

    async close() {
        try {
            if (redis) {
                await redis.quit();
                redis = null;
            }
        } catch (error) {
            console.error('Redis close error:', error);
        }
    }
};

export default cacheService;