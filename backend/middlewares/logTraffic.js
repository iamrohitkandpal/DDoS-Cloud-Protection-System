import { TrafficLog } from "../models/TrafficLog.js";
import { createClient } from 'redis';
import dotenv from 'dotenv';
import CircuitBreaker from "../utils/circuitBreaker.js";
import InMemoryStore from "../utils/inMemoryStore.js";

// Ensure dotenv is loaded before using environment variables
dotenv.config();

// Create Redis client with explicit configuration instead of relying on env vars
const redis = createClient({
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '16434')
  }
});

// Connect to Redis and handle connection errors
(async () => {
  try {
    await redis.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Redis connection error:', error);
    
    // Add fallback logic - simple in-memory store
    global.inMemoryStore = {
      data: {},
      blocks: {}
    };
    console.log('Using in-memory fallback for Redis');
  }
})();

redis.on('error', (err) => {
  console.error('Redis client error:', err);
});

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

// Create a circuit breaker for Redis
const redisBreaker = new CircuitBreaker();
let fallbackStore = null;

const logTraffic = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip; // Corrected spelling
  const now = Date.now();

  try {
    // Use circuit breaker to access Redis
    if (redis.isReady) {
      try {
        // Check Redis for existing blocks
        const blockExpiry = await redisBreaker.executeWithBreaker(() => 
          redis.get(`blocked:${ip}`)
        );
        
        if (blockExpiry && now < parseInt(blockExpiry)) {
          return res.status(429).json({
            warning: "Too many requests. Try again later.",
          });
        }

        // Sliding window rate limiting
        await redis.lPush(`requests:${ip}`, now.toString());
        const requests = await redis.lRange(`requests:${ip}`, 0, -1);
        const recentRequests = requests.filter(time => now - parseInt(time) < WINDOW_SIZE);

        if (recentRequests.length >= MAX_REQUESTS) {
          const blockExpiration = now + 10 * 60 * 1000;
          await redis.set(`blocked:${ip}`, blockExpiration.toString(), {
            EX: 600 // Set expiry for 600 seconds (10 minutes)
          });
          await redis.del(`requests:${ip}`);
          return res.status(429).json({ warning: "Too many requests!" });
        }

        // Trim the list to keep only recent requests
        await redis.lTrim(`requests:${ip}`, 0, MAX_REQUESTS - 1);
      } catch (redisError) {
        console.error('Redis circuit open, using fallback:', redisError);
        // If circuit breaker fails, initialize fallback if needed
        if (!fallbackStore) fallbackStore = new InMemoryStore();
      }
    } 
    
    // Fallback to in-memory if Redis circuit is open or Redis not ready
    if (!redis.isReady || redisBreaker.isOpen) {
      if (!fallbackStore) fallbackStore = new InMemoryStore();
      
      // Use in-memory fallback using the proper methods
      const blockExpiry = await fallbackStore.get(`blocked:${ip}`);
      
      if (blockExpiry && now < parseInt(blockExpiry)) {
        return res.status(429).json({
          warning: "Too many requests. Try again later.",
        });
      }
      
      // Get existing requests or create new array
      const existingRequests = await fallbackStore.lRange(`requests:${ip}`, 0, -1) || [];
      await fallbackStore.lPush(`requests:${ip}`, now.toString());
      
      const requests = await fallbackStore.lRange(`requests:${ip}`, 0, -1);
      const recentRequests = requests.filter(time => now - parseInt(time) < WINDOW_SIZE);
      
      if (recentRequests.length >= MAX_REQUESTS) {
        const blockExpiration = now + 10 * 60 * 1000;
        await fallbackStore.set(`blocked:${ip}`, blockExpiration.toString(), { EX: 600 });
        await fallbackStore.del(`requests:${ip}`);
        return res.status(429).json({ warning: "Too many requests!" });
      }
      
      // Trim the list
      await fallbackStore.lTrim(`requests:${ip}`, 0, MAX_REQUESTS - 1);
    }

    // Save to MongoDB with error handling
    try {
      const logEntry = new TrafficLog({
        ipAddress: ip,
        requestTime: new Date(),
        requestPath: req.originalUrl,
        userAgent: req.headers["user-agent"],
      });
      await logEntry.save();
    } catch (dbError) {
      console.error("MongoDB logging error:", dbError);
      // Continue even if MongoDB logging fails
    }

    next();
  } catch (error) {
    console.error("Traffic logging error:", error);
    // Fail open - allow request to proceed
    next();
  }
};

export default logTraffic;
