import express from 'express';
import { createClient } from 'redis';
import { sendAlert } from '../utils/alertSystem.js';

const router = express.Router();
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

// Honeypot endpoints - accessing these indicates malicious behavior
router.all('*', async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  
  // Log the honeypot access
  console.warn(`Honeypot accessed by ${ip} at path ${req.originalUrl}`);
  
  // Block the IP immediately
  const blockExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await redis.set(`blocked:${ip}`, blockExpiration.toString(), {
    EX: 86400 // 24 hours
  });
  
  // Send alert to admin dashboard
  sendAlert({
    type: 'honeypot_triggered',
    ip,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
  
  // Return a random legitimate-looking response
  res.status(200).send('OK');
});

export default router;

// Add this to app.js
// app.use('/api/v1/private', honeypotRoutes);
// app.use('/wp-admin', honeypotRoutes);
// app.use('/admin/config', honeypotRoutes);