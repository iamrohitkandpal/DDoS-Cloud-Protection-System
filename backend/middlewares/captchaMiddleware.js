import axios from 'axios';
import { createClient } from 'redis'; // Add this import
import redisService from '../services/redisService.js';

const captchaMiddleware = async (req, res, next) => {
  // Only apply to suspicious traffic (can use your detection logic)
  const ip = req.headers["x-forwarded-for"] || req.ip;
  const isSuspicious = await checkIfSuspicious(ip);
  
  if (!isSuspicious) {
    return next();
  }
  
  // Verify the captcha token from the request
  const { captchaToken } = req.body;
  
  if (!captchaToken) {
    return res.status(403).json({ 
      warning: "Security challenge required",
      requireCaptcha: true
    });
  }
  
  try {
    // Replace with your actual reCAPTCHA secret key
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`;
    
    const response = await axios.post(verifyUrl);
    
    if (response.data.success) {
      next();
    } else {
      res.status(403).json({ 
        warning: "Invalid security challenge",
        requireCaptcha: true
      });
    }
  } catch (error) {
    console.error('Captcha verification error:', error);
    // Fail open in case of errors
    next();
  }
};

// Helper function to check if an IP is suspicious
const checkIfSuspicious = async (ip) => {
  try {
    // Use redisService instead of direct connection
    // Check for high request rate
    const requests = await redisService.lRange(`requests:${ip}`, 0, -1);
    const now = Date.now();
    const recentRequests = requests.filter(time => now - parseInt(time) < 60000); // Last minute
    
    // More than 30 requests in the last minute is suspicious
    const isSuspicious = recentRequests.length > 30;
    
    return isSuspicious;
  } catch (error) {
    console.error('Error checking suspicious IP:', error);
    return false; // Fail open
  }
};

export default captchaMiddleware;