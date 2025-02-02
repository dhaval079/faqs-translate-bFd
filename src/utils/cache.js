// src/utils/cache.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const CACHE_DURATION = 3600; // 1 hour in seconds

const cacheService = {
    async get(key) {
        try {
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    },

    async set(key, data, duration = CACHE_DURATION) {
        try {
            await redis.setex(key, duration, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Redis set error:', error);
            return false;
        }
    },

    async del(key) {
        try {
            await redis.del(key);
            return true;
        } catch (error) {
            console.error('Redis delete error:', error);
            return false;
        }
    }
};

module.exports = cacheService;