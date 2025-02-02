// test/test-config.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import cacheService from '../src/utils/cache.js';
import dotenv from 'dotenv';

dotenv.config();

export const setupTestDB = () => {
    let mongod;

    before(async () => {
        try {
            if (mongoose.connection.readyState === 0) {
                await mongoose.connect(process.env.MONGODB_URI);
            }
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    });

    beforeEach(async () => {
        try {
            // Clear all collections
            const collections = mongoose.connection.collections;
            await Promise.all(
                Object.values(collections).map(async (collection) => {
                    await collection.deleteMany({});
                })
            );
        } catch (error) {
            console.error('Error clearing collections:', error);
            throw error;
        }
    });

    after(async () => {
        try {
            // Close connections
            await Promise.all([
                mongoose.connection.close(),
                cacheService.close()
            ]);
        } catch (error) {
            console.error('Error closing connections:', error);
            throw error;
        }
    });
};