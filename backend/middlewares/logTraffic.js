import { TrafficLog } from "../models/TrafficLog.js";

const ipRequests = {}; // Store IP addresses and request counts
const blockedIps = {}; // Store blocked IPs and their unblock time

const logTraffic = async (req, res, next) => {
  const ipAddress = req.ip; // Get IP address of the request
  const requestPath = req.originalUrl; // Get the requested path

  // Check if this IP is currently blocked
  const now = Date.now();
  if (blockedIps[ipAddress] && blockedIps[ipAddress] > now) {
    return res
      .status(403)
      .json({ error: "Access temporarily blocked due to too many requests" });
  }

  // Remove IP from blocked list if block period has expired
  if (blockedIps[ipAddress] && blockedIps[ipAddress] <= now) {
    delete blockedIps[ipAddress];
  }

  // Check if this IP has made too many requests in a short time
  ipRequests[ipAddress] = ipRequests[ipAddress] || [];
  ipRequests[ipAddress].push(now);

  // Keep only requests from the last 10 seconds
  ipRequests[ipAddress] = ipRequests[ipAddress].filter(
    (time) => now - time < 10000
  );

  if (ipRequests[ipAddress].length > 5) {
    blockedIps[ipAddress] = now + 10 * 60 * 1000; // Block IP for 10 minutes
    return res
      .status(429)
      .json({ error: "Too many requests - possible DDoS attack" });
  }

  // Save the log in MongoDB
  const logEntry = new TrafficLog({
    ipAddress,
    requestTime: new Date(),
    requestPath,
  });

  try {
    await logEntry.save();
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to log traffic" });
  }
};

export default logTraffic;
