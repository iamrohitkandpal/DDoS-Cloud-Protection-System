import { TrafficLog } from "../models/TrafficLog.js";
import dotenv from 'dotenv';
import CircuitBreaker from "../utils/circuitBreaker.js";
import InMemoryStore from "../utils/inMemoryStore.js";
import wafService from '../services/wafService.js';
import redisService from '../services/redisService.js';

// Ensure dotenv is loaded before using environment variables
dotenv.config();

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

const logTraffic = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  const now = Date.now();

  try {
    // Check Redis for existing blocks
    const blockExpiry = await redisService.get(`blocked:${ip}`);
    
    if (blockExpiry && now < parseInt(blockExpiry)) {
      return res.status(429).json({
        warning: "Too many requests. Try again later.",
      });
    }

    // Sliding window rate limiting
    await redisService.lPush(`requests:${ip}`, now.toString());
    const requests = await redisService.lRange(`requests:${ip}`, 0, -1);
    const recentRequests = requests.filter(time => now - parseInt(time) < WINDOW_SIZE);

    if (recentRequests.length >= MAX_REQUESTS) {
      const blockExpiration = now + 10 * 60 * 1000;
      await redisService.set(`blocked:${ip}`, blockExpiration.toString(), {
        EX: 600 // Set expiry for 600 seconds (10 minutes)
      });
      await redisService.del(`requests:${ip}`);
      return res.status(429).json({ warning: "Too many requests!" });
    }

    // Trim the list to keep only recent requests
    await redisService.lTrim(`requests:${ip}`, 0, MAX_REQUESTS - 1);

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
