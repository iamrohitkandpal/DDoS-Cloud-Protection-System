import { createClient } from 'redis';

const redis = createClient({
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '16434')
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

export const analyzeTrafficPattern = async (ip) => {
  try {
    // Get request history
    const requests = await redis.lRange(`requests:${ip}`, 0, -1);
    
    if (requests.length < 5) return { suspicious: false };
    
    // Calculate time differences between requests
    const timestamps = requests.map(time => parseInt(time)).sort((a, b) => a - b);
    const intervals = [];
    
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i-1]);
    }
    
    // Calculate standard deviation of intervals
    const avg = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    
    // Bot traffic tends to have very consistent timing patterns
    const isSuspicious = stdDev < 50 && intervals.length > 10;
    
    return { 
      suspicious: isSuspicious,
      pattern: isSuspicious ? 'bot' : 'human', 
      confidence: isSuspicious ? 'high' : 'low',
      stdDev
    };
  } catch (error) {
    console.error('Traffic analysis error:', error);
    return { suspicious: false };
  }
};