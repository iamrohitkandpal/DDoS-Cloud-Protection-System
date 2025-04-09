import jwt from 'jsonwebtoken';
import redisService from '../services/redisService.js';

const enhancedRateLimiting = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  const fingerprint = req.headers["x-device-fingerprint"];
  const token = req.headers.authorization?.split(' ')[1];
  
  // Create a composite key based on available identifiers
  let trackingKey = `ratelimit:${ip}`;
  if (fingerprint) trackingKey += `:${fingerprint}`;
  
  // Add user ID if authenticated
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      trackingKey += `:user-${decoded._id}`;
    } catch (e) {
      // Invalid token, continue with IP+fingerprint
    }
  }
  
  // Apply rate limiting using the composite key
  const now = Date.now();
  await redisService.lPush(trackingKey, now.toString());
  const requests = await redisService.lRange(trackingKey, 0, -1);
  const recentRequests = requests.filter(time => now - parseInt(time) < 60000);
  
  // Apply graduated response based on request volume
  if (recentRequests.length > 300) {
    // Severe rate limiting - long block
    await redisService.set(`blocked:${trackingKey}`, (now + 3600000).toString(), { EX: 3600 });
    return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
  } else if (recentRequests.length > 100) {
    // Moderate rate limiting - short block
    await redisService.set(`blocked:${trackingKey}`, (now + 300000).toString(), { EX: 300 });
    return res.status(429).json({ error: "Too many requests. Please wait a few minutes." });
  }
  
  next();
};

export default enhancedRateLimiting;