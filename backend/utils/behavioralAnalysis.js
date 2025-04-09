import redisService from '../services/redisService.js';

export const analyzeUserBehavior = async (ip, requestPath) => {
  const now = Date.now();
  const key = `behavior:${ip}`;
  
  // Record this request with timestamp and path
  await redisService.lPush(key, JSON.stringify({
    time: now,
    path: requestPath
  }));
  
  // Keep only last 20 requests for analysis
  await redisService.lTrim(key, 0, 19);
  
  // Get recent activity
  const rawActivity = await redisService.lRange(key, 0, -1);
  const activity = rawActivity.map(item => JSON.parse(item));
  
  // Analyze for suspicious patterns
  const result = {
    suspicious: false,
    reasons: []
  };
  
  // 1. Check for rapid identical requests
  const pathCounts = {};
  activity.forEach(item => {
    pathCounts[item.path] = (pathCounts[item.path] || 0) + 1;
  });
  
  const maxPathCount = Math.max(...Object.values(pathCounts));
  if (maxPathCount > 10) {
    result.suspicious = true;
    result.reasons.push('high_frequency_identical_requests');
  }
  
  // 2. Check for time between requests (bot detection)
  const timeDiffs = [];
  for (let i = 1; i < activity.length; i++) {
    timeDiffs.push(activity[i-1].time - activity[i].time);
  }
  
  if (timeDiffs.length > 5) {
    const avgDiff = timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
    const stdDev = Math.sqrt(
      timeDiffs.reduce((sum, diff) => sum + Math.pow(diff - avgDiff, 2), 0) / timeDiffs.length
    );
    
    // If timing is too consistent (low standard deviation), likely a bot
    if (stdDev < 50 && avgDiff < 200) {
      result.suspicious = true;
      result.reasons.push('bot_like_timing');
    }
  }
  
  return result;
};