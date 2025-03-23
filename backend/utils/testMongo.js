import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testMongoConnection = async () => {
  console.log('Testing MongoDB connection...');
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('✅ MongoDB connection successful!');
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    console.log('\nTrying direct connection string...');
    try {
      await mongoose.connect(process.env.MONGO_DIRECT_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      
      console.log('✅ MongoDB direct connection successful!');
      await mongoose.connection.close();
      console.log('Connection closed');
    } catch (directError) {
      console.error('❌ MongoDB direct connection failed:', directError.message);
      console.log('\nPlease check your MongoDB credentials and network connectivity.');
      console.log('You may need to whitelist your IP address in MongoDB Atlas.');
    }
  }
};

// Run if called directly
if (process.argv[1].includes('testMongo.js')) {
  testMongoConnection().finally(() => process.exit());
}

export default testMongoConnection;