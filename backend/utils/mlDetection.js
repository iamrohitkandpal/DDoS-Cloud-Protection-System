import { TrafficLog } from "../models/TrafficLog.js";

// Feature extraction for ML model
export const extractFeatures = async (ip) => {
  try {
    // Get the last 24 hours of requests for this IP
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const requests = await TrafficLog.find({ 
      ipAddress: ip,
      requestTime: { $gt: oneDayAgo }
    });
    
    if (requests.length === 0) return null;
    
    // Extract features
    const features = {
      requestCount: requests.length,
      uniquePaths: new Set(requests.map(r => r.requestPath)).size,
      timeSpan: (new Date(requests[requests.length-1].requestTime) - new Date(requests[0].requestTime)) / 1000, // in seconds
    };
    
    features.requestRate = features.requestCount / (features.timeSpan || 1);
    features.pathDiversity = features.uniquePaths / features.requestCount;
    
    return features;
  } catch (error) {
    console.error('Feature extraction error:', error);
    return null;
  }
};

// Very simple rule-based model (can be replaced with a real ML model)
export const predictAttack = (features) => {
  if (!features) return { isAttack: false, confidence: 0 };
  
  // Simple rules - high request rate with low path diversity indicates attack
  const isAttack = features.requestRate > 2 && features.pathDiversity < 0.2;
  
  return {
    isAttack,
    confidence: isAttack ? 0.85 : 0.15,
    reason: isAttack ? 'High request rate with low path diversity' : 'Normal traffic pattern'
  };
};