import { createClient } from 'redis';
import InMemoryStore from './inMemoryStore.js';

let redisClient;
let isUsingFallback = false;
let inMemoryStore = null;

export const getRedisClient = async () => {
  if (redisClient && redisClient.isReady) {
    return redisClient;
  }
  
  if (isUsingFallback) {
    if (!inMemoryStore) {
      inMemoryStore = new InMemoryStore();
    }
    return inMemoryStore;
  }
  
  try {
    redisClient = createClient({
      username: 'default',
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
      }
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis client error:', err);
    });
    
    await redisClient.connect();
    console.log('Connected to Redis successfully');
    return redisClient;
  } catch (error) {
    console.error('Redis connection failed, using in-memory fallback:', error);
    isUsingFallback = true;
    inMemoryStore = new InMemoryStore();
    return inMemoryStore;
  }
};