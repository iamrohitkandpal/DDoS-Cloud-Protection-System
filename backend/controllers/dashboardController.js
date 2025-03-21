import { TrafficLog } from "../models/TrafficLog.js";
import { createClient } from 'redis';
import mongoose from 'mongoose';

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
    console.error('Redis connection error in dashboard controller:', error);
  }
})();

// Generate mock data if real data is not available
const generateMockData = () => {
  const now = new Date();
  const trafficOverTime = [];
  const attacksByType = [
    { name: 'HTTP Flood', value: 65 },
    { name: 'TCP SYN', value: 20 },
    { name: 'Volumetric', value: 10 },
    { name: 'Slow Loris', value: 5 }
  ];
  
  const topIPs = [
    { address: '192.168.1.100', count: 256, country: 'US' },
    { address: '10.0.0.25', count: 198, country: 'CN' },
    { address: '172.16.0.5', count: 157, country: 'RU' },
    { address: '192.168.2.15', count: 134, country: 'BR' },
    { address: '10.0.1.200', count: 98, country: 'IN' }
  ];

  // Generate time series data for the last 12 hours
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Generate some random data with increasing trend
    const normal = Math.floor(Math.random() * 100) + (12 - i) * 10;
    const blocked = Math.floor(Math.random() * 50) + (12 - i) * 5;
    
    trafficOverTime.push({
      time: timeStr,
      normal: normal,
      blocked: blocked
    });
  }
  
  return {
    trafficSummary: {
      total: 5860,
      blocked: 982, 
      suspicious: 243
    },
    trafficOverTime,
    attacksByType,
    topIPs,
    geoDistribution: [],
    systemStatus: 'operational'
  };
};

// Fix in getDashboardStats function
export const getDashboardStats = async (req, res) => {
  try {
    // Try to get real stats if possible
    let stats = {};
    let hasRealData = false;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        // Your existing MongoDB query code
      } catch (error) {
        console.error("Error fetching real stats:", error);
      }
    } else {
      console.log("MongoDB not connected, using mock data");
    }
    
    // If no real data available, use mock data
    if (!hasRealData) {
      stats = generateMockData();
    }
    
    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};