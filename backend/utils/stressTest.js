/**
 * This script performs stress testing on the API to test DDoS protection
 * 
 * Usage: node utils/stressTest.js [requests] [concurrency]
 * 
 * Example: node utils/stressTest.js 1000 10
 */
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/data';
const DEFAULT_REQUESTS = 200;
const DEFAULT_CONCURRENCY = 5;

// Parse command line arguments
const totalRequests = parseInt(process.argv[2]) || DEFAULT_REQUESTS;
const concurrentRequests = parseInt(process.argv[3]) || DEFAULT_CONCURRENCY;

console.log(`Starting stress test with ${totalRequests} total requests, ${concurrentRequests} concurrent`);

let completed = 0;
let successful = 0;
let rejected = 0;
let errors = 0;
let startTime = Date.now();

const makeRequest = async () => {
  try {
    const response = await axios.get(API_URL);
    completed++;
    
    if (response.status === 200) {
      successful++;
    } else if (response.status === 429) {
      rejected++;
    } else {
      errors++;
    }
  } catch (error) {
    completed++;
    
    if (error.response && error.response.status === 429) {
      rejected++;
    } else {
      errors++;
    }
  }
  
  // Log progress every 10 requests
  if (completed % 10 === 0) {
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const rps = completed / elapsedSeconds;
    
    console.log(`Progress: ${completed}/${totalRequests} (${(completed/totalRequests*100).toFixed(1)}%) - ${rps.toFixed(1)} req/sec`);
    console.log(`Status: ${successful} successful, ${rejected} rejected, ${errors} errors`);
  }
  
  return completed < totalRequests;
};

const runBatch = async () => {
  const batch = [];
  for (let i = 0; i < concurrentRequests; i++) {
    if (completed < totalRequests) {
      batch.push(makeRequest());
    }
  }
  
  await Promise.all(batch);
  
  if (completed < totalRequests) {
    // Continue with next batch
    setImmediate(runBatch);
  } else {
    // Test completed
    const totalTime = (Date.now() - startTime) / 1000;
    console.log('\nTest completed:');
    console.log(`Total time: ${totalTime.toFixed(2)} seconds`);
    console.log(`Requests per second: ${(totalRequests / totalTime).toFixed(2)}`);
    console.log(`Results: ${successful} successful, ${rejected} rejected, ${errors} errors`);
    
    // Check if rate limiting worked
    if (rejected > 0) {
      console.log('\nRate limiting is working! 👍');
    } else {
      console.log('\nWarning: No requests were rate-limited. Protection may not be working properly.');
    }
  }
};

// Start the stress test
runBatch();