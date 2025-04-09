import { TrafficLog } from "../models/TrafficLog.js";
import redisService from '../services/redisService.js';
import mongoose from 'mongoose';

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

// Update the function signature to accept isDemo parameter
export const getDashboardStats = async (req, res, isInDemoMode = false) => {
  try {
    // Try to get real stats if possible
    let stats = {};
    let hasRealData = false;
    
    // Force mock data if in demo mode
    if (isInDemoMode) {
      console.log("Running in demo mode - using mock data");
      stats = generateMockData();
      // Add a flag to indicate demo mode
      stats.isDemo = true;
      return res.json(stats);
    }
    
    // Normal flow for production mode
    if (mongoose.connection.readyState === 1) {
      try {
        // Get total blocked IPs
        const blockedKeys = await redisService.keys('blocked:*');
        const blockedCount = blockedKeys.length;
        
        // Get real data from MongoDB
        const total = await TrafficLog.countDocuments();
        
        // Get hourly breakdown
        const now = new Date();
        const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        
        const hourlyData = await TrafficLog.aggregate([
          { 
            $match: { 
              requestTime: { $gte: twelveHoursAgo } 
            } 
          },
          {
            $group: {
              _id: { 
                $dateToString: { 
                  format: "%H:00", 
                  date: "$requestTime" 
                } 
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { "_id": 1 } }
        ]);
        
        // Format time series data
        if (total > 0) {
          hasRealData = true;
          stats.trafficSummary = {
            total,
            blocked: blockedCount,
            suspicious: Math.floor(total * 0.05) // Estimate 5% as suspicious
          };
          
          stats.trafficOverTime = hourlyData.map(item => ({
            time: item._id,
            normal: item.count - Math.floor(item.count * 0.15), // Estimate 15% as blocked
            blocked: Math.floor(item.count * 0.15)
          }));
        }

        // Check for actual attack types data
        const attackTypesData = await TrafficLog.aggregate([
          { $match: { blocked: true } }, // Assuming you track when requests are blocked
          { $group: { _id: "$attackType", value: { $sum: 1 } } },
          { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);
        
        if (attackTypesData && attackTypesData.length > 0) {
          stats.attacksByType = attackTypesData;
        }
        
        // Get top blocked IPs
        const topBlockedIPs = await TrafficLog.aggregate([
          { $match: { blocked: true } },
          { $group: { _id: "$ipAddress", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          { $project: { address: "$_id", count: 1, _id: 0 } }
        ]);
        
        if (topBlockedIPs && topBlockedIPs.length > 0) {
          // Add country data
          stats.topIPs = topBlockedIPs.map(ip => ({
            ...ip,
            country: ip.country || getCountryCode(ip.address) || '??'
          }));
        }
      } catch (error) {
        console.error("Error fetching real stats:", error);
      }
    } else {
      console.log("MongoDB not connected, falling back to mock data");
    }
    
    // Only use mock data as fallback in production mode
    if (!hasRealData) {
      stats = generateMockData();
      // Indicate this is fallback data
      stats.isFallback = true;
    }
    
    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};