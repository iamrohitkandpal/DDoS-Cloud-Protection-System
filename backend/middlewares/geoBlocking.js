import axios from 'axios';
import redisService from '../services/redisService.js';

// List of countries to block (optional)
const BLOCKED_COUNTRIES = ['KP', 'IR'];

const geoBlocking = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  
  try {
    // Check cache first
    const cachedCountry = await redisService.get(`geo:${ip}`);
    
    if (cachedCountry) {
      if (BLOCKED_COUNTRIES.includes(cachedCountry)) {
        return res.status(403).json({ warning: "Access denied from your region." });
      }
      next();
      return;
    }
    
    // Skip geo lookup in demo mode
    if (!process.env.IPAPI_KEY) {
      console.log('[DEMO MODE] Skipping geo lookup');
      next();
      return;
    }
    
    // If not in cache, fetch geo information
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      const countryCode = response.data.country_code;
      
      // Cache the result for 24 hours
      await redisService.set(`geo:${ip}`, countryCode, { EX: 86400 });
      
      if (BLOCKED_COUNTRIES.includes(countryCode)) {
        return res.status(403).json({ warning: "Access denied from your region." });
      }
    } catch (geoError) {
      console.error('Geo-lookup error:', geoError);
      // Continue if geo lookup fails
    }
    
    next();
  } catch (error) {
    console.error('Geo-blocking error:', error);
    // Fail open
    next();
  }
};

export default geoBlocking;