// app.js (Backend)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./utils/database.js";
import bodyParser from "body-parser";
import logTraffic from "./middlewares/logTraffic.js"; // Import the middleware
import { securityHeaders } from "./middlewares/security.js";
import { apiLimiter } from "./middlewares/security.js";

dotenv.config({});

const app = express();

app.use(securityHeaders);
app.use(apiLimiter);
app.use(express.json({ limit: "10kb" }));

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:5173", // Ensure this is your React app's port
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Apply logTraffic middleware to all routes
app.use(logTraffic);

// Sample API route (optional, if you need to fetch data from backend)
app.get("/api/data", (req, res) => {
  res.json({ message: "API is working" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server Running at ${PORT}`);
});