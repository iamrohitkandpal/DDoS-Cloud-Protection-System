import { TrafficLog } from "../models/TrafficLog.js";
import { createClient } from 'redis';
import dotenv from 'dotenv';

// Ensure dotenv is loaded before using environment variables
dotenv.config();

// Create Redis client with explicit configuration instead of relying on env vars
const redis = createClient({
  username: 'default',
  password: 'pIcXmXY7fpJRKfFw73XxVThU9MQg5HZf',
  socket: {
    host: 'redis-16434.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 16434
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

const logTraffic = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  const now = Date.now();

  try {
    // If Redis is connected, use it
    if (redis.isReady) {
      // Check Redis for existing blocks
      const blockExpiry = await redis.get(`blocked:${ip}`);
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
    } else if (global.inMemoryStore) {
      // Use in-memory fallback
      const blocks = global.inMemoryStore.blocks;
      if (blocks[ip] && now < blocks[ip]) {
        return res.status(429).json({
          warning: "Too many requests. Try again later.",
        });
      }
      
      // Simple in-memory rate limiting
      if (!global.inMemoryStore.data[ip]) {
        global.inMemoryStore.data[ip] = [];
      }
      
      global.inMemoryStore.data[ip].push(now);
      
      // Keep only recent requests
      const recentRequests = global.inMemoryStore.data[ip].filter(
        time => now - time < WINDOW_SIZE
      );
      global.inMemoryStore.data[ip] = recentRequests;
      
      if (recentRequests.length >= MAX_REQUESTS) {
        const blockExpiration = now + 10 * 60 * 1000;
        global.inMemoryStore.blocks[ip] = blockExpiration;
        delete global.inMemoryStore.data[ip];
        return res.status(429).json({ warning: "Too many requests!" });
      }
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
