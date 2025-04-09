import { createClient } from 'redis';
import dotenv from 'dotenv';
import redisService from '../services/redisService.js';

dotenv.config();

const testRedisConnection = async () => {
  console.log('🔍 Testing direct Redis connection...');
  let directClient = null;

  try {
    // Create Redis client with credentials from .env
    directClient = createClient({
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '16434')
      }
    });

    // Set up event listeners
    directClient.on('error', (err) => {
      console.error('❌ Redis client error:', err);
    });

    // Connect to Redis
    await directClient.connect();
    console.log('✅ Redis connection successful!');

    // Test basic operations
    const testKey = 'test-' + Date.now();
    await directClient.set(testKey, 'Redis test value');
    const value = await directClient.get(testKey);
    
    if (value === 'Redis test value') {
      console.log('✅ Redis operations working properly');
    } else {
      console.error('❌ Redis operations test failed. Expected "Redis test value", got:', value);
    }

    // Cleanup
    await directClient.del(testKey);
    
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Redis credentials in .env may be incorrect');
    console.log('2. Redis server may be unreachable (check network/firewall)');
    console.log('3. Redis server may be down or rejecting connections');
  } finally {
    // Close connection
    if (directClient && directClient.isReady) {
      await directClient.quit();
      console.log('Redis connection closed');
    }
  }

  // Test the redisService wrapper with fallback capability
  console.log('\n🔍 Testing redisService wrapper...');
  try {
    // Test basic operations through the service
    const testKey = 'service-test-' + Date.now();
    await redisService.set(testKey, 'Service test value');
    const value = await redisService.get(testKey);
    
    if (value === 'Service test value') {
      console.log('✅ redisService wrapper working properly');
      if (redisService.isUsingFallback) {
        console.log('⚠️ Using in-memory fallback store (this is expected if Redis connection failed)');
      } else {
        console.log('✅ Using actual Redis connection');
      }
    } else {
      console.error('❌ redisService operations test failed');
    }

    // Cleanup
    await redisService.del(testKey);
    
  } catch (error) {
    console.error('❌ redisService test failed:', error.message);
  }
};

// Run if called directly
if (process.argv[1].includes('testRedis.js')) {
  testRedisConnection().finally(() => process.exit());
}

export default testRedisConnection;