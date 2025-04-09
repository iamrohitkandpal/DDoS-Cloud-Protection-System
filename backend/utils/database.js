import mongoose from "mongoose";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

const connectDb = async () => {
  // For demo mode, check if MONGO_URI is defined
  if (!process.env.MONGO_URI) {
    console.log('MongoDB URI not defined. Running in demo mode with in-memory storage only.');
    return;
  }

  try {
    // Allow fallback to direct connection if SRV fails
    let connectionString = process.env.MONGO_URI;
    
    // Updated options - removed deprecated flags
    const options = {
      serverSelectionTimeoutMS: 5000
    };

    await mongoose.connect(connectionString, options);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    
    // Try direct connection as fallback
    try {
      const directUri = process.env.MONGO_URI_DIRECT;
      
      if (!directUri) {
        console.error("No fallback MongoDB URI provided");
        console.log("Running in demo mode with in-memory storage only.");
        return;
      }
      
      await mongoose.connect(directUri, {
        serverSelectionTimeoutMS: 5000
      });
      console.log("✅ MongoDB connected via direct connection");
    } catch (directError) {
      console.error("❌ All MongoDB connection attempts failed. Using in-memory storage only.");
    }
  }
};

export default connectDb;
