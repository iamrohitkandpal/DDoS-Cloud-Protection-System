// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDb from "./utils/database.js";
import bodyParser from "body-parser";
import logTraffic from "./middlewares/logTraffic.js";
import { securityHeaders } from "./middlewares/security.js";
import { apiLimiter } from "./middlewares/security.js";
import { getDashboardStats } from "./controllers/dashboardController.js";
import { createServer } from 'http';
import { initializeAlertSystem } from './utils/alertSystem.js';
import geoBlocking from './middlewares/geoBlocking.js';
import { analyzeTrafficPattern } from './utils/trafficAnalyzer.js';
import { extractFeatures, predictAttack } from './utils/mlDetection.js';
import honeypotRoutes from './routes/honeypot.js';
import { blockIPWithCloudflare } from './utils/wafIntegration.js';

const app = express();
const server = createServer(app);

// Initialize WebSocket server for real-time alerts
initializeAlertSystem(server);

// Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.json());
app.use(securityHeaders);
app.use(apiLimiter);

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(logTraffic);

// Sample API route (optional, if you need to fetch data from backend)
app.get("/api/data", (req, res) => {
  res.json({ message: "API is working" });
});

// Dashboard stats endpoint
app.get("/api/dashboard/stats", getDashboardStats);

// Add endpoint for standard stats (for backward compatibility)
app.get("/api/stats", (req, res) => {
  res.json({
    totalRequests: 5860,
    blockedRequests: 982,
    hourlyRequests: [
      { hour: "09:00", count: 250 },
      { hour: "10:00", count: 320 },
      { hour: "11:00", count: 380 },
      { hour: "12:00", count: 450 }
    ]
  });
});

// Apply the geo blocking middleware (if you want to enable it)
// app.use(geoBlocking);

// Add honeypot endpoints (these appear legitimate but detect scanners)
app.use('/api/v1/private', honeypotRoutes);
app.use('/wp-admin', honeypotRoutes);
app.use('/admin/config', honeypotRoutes);
app.use('/phpmyadmin', honeypotRoutes);

// Add advanced detection endpoint
app.get('/api/analyze/:ip', async (req, res) => {
  const ip = req.params.ip;
  
  try {
    // Perform analysis
    const patternAnalysis = await analyzeTrafficPattern(ip);
    const features = await extractFeatures(ip);
    const prediction = predictAttack(features);
    
    // If high confidence attack predicted, optionally block with Cloudflare
    if (prediction.isAttack && prediction.confidence > 0.8) {
      await blockIPWithCloudflare(ip, prediction.reason);
    }
    
    res.json({
      ip,
      patternAnalysis,
      mlPrediction: prediction
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDb();
  console.log(`Server Running at ${PORT}`);
});