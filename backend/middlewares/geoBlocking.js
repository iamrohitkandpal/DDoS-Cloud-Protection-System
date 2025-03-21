import axios from 'axios';
import { createClient } from 'redis';

const redis = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 16434
  }
});

// Connect to Redis
(async () => {
  try {
    await redis.connect();
  } catch (error) {
    console.error('Redis connection error:', error);
  }
})();

// List of countries to block (optional)
const BLOCKED_COUNTRIES = ['KP', 'IR'];

const geoBlocking = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  
  try {
    // Check cache first
    const cachedCountry = await redis.get(`geo:${ip}`);
    
    if (cachedCountry) {
      if (BLOCKED_COUNTRIES.includes(cachedCountry)) {
        return res.status(403).json({ warning: "Access denied from your region." });
      }
      next();
      return;
    }
    
    // If not in cache, fetch geo information
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const countryCode = response.data.country_code;
    
    // Cache the result for 24 hours
    await redis.set(`geo:${ip}`, countryCode, { EX: 86400 });
    
    if (BLOCKED_COUNTRIES.includes(countryCode)) {
      return res.status(403).json({ warning: "Access denied from your region." });
    }
    
    next();
  } catch (error) {
    console.error('Geo-blocking error:', error);
    // Fail open
    next();
  }
};

export default geoBlocking;