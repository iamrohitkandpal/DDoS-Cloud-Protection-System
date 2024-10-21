// app.js (Backend)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./utils/database.js";
import bodyParser from "body-parser";
import logTraffic from "./middlewares/logTraffic.js"; // Import the middleware

dotenv.config({});

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

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
