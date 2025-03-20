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

const app = express();

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

// Add endpoint for dashboard stats
app.get("/api/stats", (req, res) => {
  // Implement stats logic or placeholder
  res.json({
    totalRequests: 0,
    blockedRequests: 0,
    hourlyRequests: []
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server Running at ${PORT}`);
});