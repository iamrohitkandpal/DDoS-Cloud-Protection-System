/**
 * This script tests all components of the DDoS protection system
 */
import axios from 'axios';
import { createClient } from 'redis';

// Configuration
const API_URL = 'http://localhost:5000';
const REDIS_CONFIG = {
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 16434
  }
};

// Test functions
const testApiEndpoints = async () => {
  console.log('\n🔍 Testing API endpoints...');
  
  try {
    const response = await axios.get(`${API_URL}/api/data`);
    console.log('✅ API endpoint working:', response.data);
    
    const statsResponse = await axios.get(`${API_URL}/api/dashboard/stats`);
    console.log('✅ Dashboard stats endpoint working');
    
    return true;
  } catch (error) {
    console.error('❌ API endpoints test failed:', error.message);
    return false;
  }
};

const testRedisConnection = async () => {
  console.log('\n🔍 Testing Redis connection...');
  
  try {
    const redis = createClient(REDIS_CONFIG);
    await redis.connect();
    
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    
    if (value === 'test-value') {
      console.log('✅ Redis connection working');
      await redis.quit();
      return true;
    } else {
      console.error('❌ Redis data integrity test failed');
      await redis.quit();
      return false;
    }
  } catch (error) {
    console.error('❌ Redis connection test failed:', error.message);
    return false;
  }
};

const testRateLimiting = async () => {
  console.log('\n🔍 Testing rate limiting...');
  
  try {
    const promises = [];
    for (let i = 0; i < 110; i++) {
      promises.push(axios.get(`${API_URL}/api/data`));
    }
    
    const results = await Promise.allSettled(promises);
    
    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');
    
    if (rejected.length > 0) {
      console.log(`✅ Rate limiting working. ${fulfilled.length} requests passed, ${rejected.length} blocked`);
      return true;
    } else {
      console.log('❌ Rate limiting test failed. All requests passed.');
      return false;
    }
  } catch (error) {
    console.error('❌ Rate limiting test failed:', error.message);
    return false;
  }
};

const testHoneypot = async () => {
  console.log('\n🔍 Testing honeypot endpoints...');
  
  try {
    const response = await axios.get(`${API_URL}/wp-admin`);
    console.log('✅ Honeypot working:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Honeypot test failed:', error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🚀 Starting full system test...');
  
  const results = {
    api: await testApiEndpoints(),
    redis: await testRedisConnection(),
    rateLimiting: await testRateLimiting(),
    honeypot: await testHoneypot()
  };
  
  console.log('\n📋 Test Results:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(Boolean);
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed.'}`);
};

// Run the tests
runTests();