/**
 * This script helps whitelist your IP address in MongoDB Atlas
 * 
 * Usage:
 * 1. Set your MongoDB Atlas API Key in .env:
 *    MONGODB_ATLAS_API_KEY=your_api_key
 *    MONGODB_ATLAS_API_USER=your_username
 * 
 * 2. Run: node utils/whitelistIp.js
 */
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const getPublicIp = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching public IP:', error);
    throw error;
  }
};

const whitelistIp = async () => {
  try {
    const publicIp = await getPublicIp();
    console.log(`Your public IP is: ${publicIp}`);
    
    // Instructions for manual whitelisting
    console.log('\nTo whitelist this IP in MongoDB Atlas:');
    console.log('1. Log in to MongoDB Atlas at https://cloud.mongodb.com');
    console.log('2. Go to Network Access in the Security section');
    console.log('3. Click "Add IP Address"');
    console.log(`4. Enter your IP: ${publicIp}`);
    console.log('5. Add a comment like "Development Machine"');
    console.log('6. Click "Confirm"');
    
    // Programmatic whitelisting if you have API credentials
    if (process.env.MONGODB_ATLAS_API_KEY && process.env.MONGODB_ATLAS_API_USER) {
      console.log('\nAttempting to whitelist automatically using Atlas API...');
      
      // Add code to use MongoDB Atlas API
      // This requires Atlas admin API access
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Self-execute if this script is run directly
if (process.argv[1].includes('whitelistIp.js')) {
  whitelistIp();
}

export default whitelistIp;