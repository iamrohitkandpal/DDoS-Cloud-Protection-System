import mongoose from "mongoose";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

const connectDb = async () => {
  try {
    // Allow fallback to direct connection if SRV fails
    let connectionString = process.env.MONGO_URI;
    
    // Handle both srv and direct connection strings
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    };

    await mongoose.connect(connectionString, options);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    
    // Try direct connection as fallback
    try {
      const directUri = process.env.MONGO_URI_DIRECT;
      
      await mongoose.connect(directUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log("MongoDB connected via direct connection");
    } catch (directError) {
      console.error("All MongoDB connection attempts failed. Using in-memory storage only.");
    }
  }
};

export default connectDb;
