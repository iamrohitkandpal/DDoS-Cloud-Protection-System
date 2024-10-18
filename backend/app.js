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
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(logTraffic); // Apply the middleware to all routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server Running at ${PORT}`);
});
