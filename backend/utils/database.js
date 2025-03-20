import mongoose from "mongoose";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

const connectDb = async () => {
  try {
    // Use a direct connection string format instead of SRV
    const connectionString = process.env.MONGO_URI || 
      "mongodb+srv://iamrohitkandpal:Z36R9Y3n3UqCVGgU@cluster0.xljty.mongodb.net/ddos_protection?retryWrites=true&w=majority";
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    };

    await mongoose.connect(connectionString, options);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Don't exit the process, allow app to run without MongoDB
    console.log("Application will run without MongoDB logging");
  }
};

export default connectDb;
