import { TrafficLog } from "../models/TrafficLog.js";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

const logTraffic = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.ip; // Corrected spelling
  const now = Date.now();

  try {
    // Check Redis for existing blocks
    const blockExpiry = await redis.get(`blocked:${ip}`);
    if (blockExpiry && now < blockExpiry) {
      return res.status(429).json({
        warning: "Too many requests. Try again later.",
      });
    }
    // Sliding window rate limiting
    const requests = await redis.lrange(`requests:${ip}`, 0, -1);
    const recentRequests = requests.filter((time) => now - time < WINDOW_SIZE);

    if (recentRequests.length >= MAX_REQUESTS) {
      await redis.setex(`blocked:${ip}`, 600, now + 10 * 60 * 1000);
      await redis.del(`requests:${ip}`);
      return res.status(429).json({ warning: "Too many requests!" });
    }

    // Log request
    await redis.lpush(`requests:${ip}`, now);
    await redis.ltrim(`requests:${ip}`, 0, MAX_REQUESTS - 1);

    // Save to MongoDB
    const logEntry = new TrafficLog({
      ipAddress: ip,
      requestTime: new Date(),
      requestPath: req.originalUrl,
      userAgent: req.headers["user-agent"],
    });

    await logEntry.save();

    next();
  } catch (error) {
    console.error("Traffic logging error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------- ********* ------- //
// ------- 2nd Draft ------- //
// ------- ********* ------- //

// import { TrafficLog } from "../models/TrafficLog.js";

// // Use in-memory structures for tracking requests (could be replaced with Redis or similar)
// const ipRequests = {}; // Store IP addresses and request counts
// const blockedIps = {}; // Store blocked IPs and their unblock time

// // Helper function to format the IP address consistently
// const formatIpAddress = (ip) => {
//   return ip.replace(/^::ffff:/, ""); // Handle IPv6 notation for IPv4 addresses
// };

// const logTraffic = async (req, res, next) => {
//   let ipAddress = req.ip.replace(/^::ffff:/, ""); // Handle IPv6 notation for IPv4 addresses
//   ipAddress = formatIpAddress(ipAddress); // Format the IP address

//   const now = Date.now();
//   console.log(ipRequests);
//   console.log(blockedIps);

//   // Check if this IP is currently blocked
//   if (blockedIps[ipAddress] && blockedIps[ipAddress] > now) {
//     return res.json({ warning: "You will be blocked, Attacker!" }); // Respond with blocked message
//   }

//   // Remove IP from blocked list if block period has expired
//   if (blockedIps[ipAddress] && blockedIps[ipAddress] <= now) {
//     delete blockedIps[ipAddress];
//   }

//   // Track request count
//   ipRequests[ipAddress] = ipRequests[ipAddress] || [];
//   ipRequests[ipAddress].push(now);

//   // Keep only requests from the last 10 seconds
//   ipRequests[ipAddress] = ipRequests[ipAddress].filter(
//     (time) => now - time < 10000
//   );

//   // If too many requests, block the IP
//   if (ipRequests[ipAddress].length > 5) {
//     blockedIps[ipAddress] = now + 10 * 60 * 1000; // Block for 10 minutes
//     return res.json({ warning: "You will be blocked, Attacker!" }); // Blocked response
//   }

//   // Log traffic and return the welcome message
//   const logEntry = new TrafficLog({
//     ipAddress,
//     requestTime: new Date(),
//     requestPath: req.originalUrl,
//   });

//   try {
//     await logEntry.save();
//     return res.json({ message: "Welcome, Visitor!" }); // Non-blocked response
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Failed to log traffic" });
//   }
// };

// export default logTraffic;

// ------- ********* ------- //
// ------- 1st Draft ------- //
// ------- ********* ------- //

// import { TrafficLog } from "../models/TrafficLog.js";

// const ipRequests = {}; // Store IP addresses and request counts
// const blockedIps = {}; // Store blocked IPs and their unblock time

// const logTraffic = async (req, res, next) => {
//   const ipAddress = req.ip; // Get IP address of the request
//   const requestPath = req.originalUrl; // Get the requested path

//   // Check if this IP is currently blocked
//   const now = Date.now();
//   if (blockedIps[ipAddress] && blockedIps[ipAddress] > now) {
//     return res
//       .status(403)
//       .json({ error: "Access temporarily blocked due to too many requests" });
//   }

//   console.log(ipAddress);
//   // Remove IP from blocked list if block period has expired
//   if (blockedIps[ipAddress] && blockedIps[ipAddress] <= now) {
//     delete blockedIps[ipAddress];
//   }

//   // Check if this IP has made too many requests in a short time
//   ipRequests[ipAddress] = ipRequests[ipAddress] || [];
//   ipRequests[ipAddress].push(now);

//   // Keep only requests from the last 10 seconds
//   ipRequests[ipAddress] = ipRequests[ipAddress].filter(
//     (time) => now - time < 10000
//   );

//   if (ipRequests[ipAddress].length > 5) {
//     blockedIps[ipAddress] = now + 10 * 60 * 1000; // Block IP for 10 minutes
//     return res
//       .status(429)
//       .json({ error: "Too many requests - possible DDoS attack" });
//   }

//   // Save the log in MongoDB
//   const logEntry = new TrafficLog({
//     ipAddress,
//     requestTime: new Date(),
//     requestPath,
//   });

//   try {
//     await logEntry.save();
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to log traffic" });
//   }
// };

// export default logTraffic;

// ------- 2nd Draft ------- //

// import { TrafficLog } from "../models/TrafficLog.js";

// const ipRequests = {}; // Store IP addresses and request counts
// const blockedIps = {}; // Store blocked IPs and their unblock time

// const formatIpAddress = (ip) => {
//   return ip.split('.').map(segment => segment.padStart(3, '0')).join('.');
// };

// const logTraffic = async (req, res, next) => {
//   console.log(ipRequests);
//   console.log("Request received: ", { ipAddress, requestPath });

//   let ipAddress = req.ip.replace(/^::ffff:/, ''); // Handle IPv6 notation for IPv4 addresses
//   ipAddress = formatIpAddress(ipAddress); // Format the IP address
//   const requestPath = req.originalUrl; // Get the requested path

//   // Check if this IP is currently blocked
//   const now = Date.now();
//   if (blockedIps[ipAddress] && blockedIps[ipAddress] > now) {
//     return res
//       .status(403)
//       .json({ error: "Access temporarily blocked due to too many requests" });
//   }
//   console.log(ipAddress);

//   // Remove IP from blocked list if block period has expired
//   if (blockedIps[ipAddress] && blockedIps[ipAddress] <= now) {
//     delete blockedIps[ipAddress];
//   }

//   // Check if this IP has made too many requests in a short time
//   ipRequests[ipAddress] = ipRequests[ipAddress] || [];
//   ipRequests[ipAddress].push(now);

//   // Keep only requests from the last 10 seconds
//   ipRequests[ipAddress] = ipRequests[ipAddress].filter(
//     (time) => now - time < 10000
//   );

//   if (ipRequests[ipAddress].length > 5) {
//     blockedIps[ipAddress] = now + 10 * 60 * 1000; // Block IP for 10 minutes
//     return res
//       .status(429)
//       .json({ error: "Too many requests - possible DDoS attack" });
//   }

//   // Save the log in MongoDB
//   const logEntry = new TrafficLog({
//     ipAddress,
//     requestTime: new Date(),
//     requestPath,
//   });

//   try {
//     await logEntry.save();
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to log traffic" });
//   }
// };

// export default logTraffic;
