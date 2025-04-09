import axios from 'axios';

// Replace with your ngrok URL from command line argument
const NGROK_URL = process.argv[2]; // Get from command line argument
console.log(`🚀 Using Ngrok URL: ${NGROK_URL}`);

if (!NGROK_URL) {
  console.error('Please provide your ngrok URL as an argument');
  console.error('Example: node utils/simulateAttack.js https://your-ngrok-url.ngrok.io');
  process.exit(1);
}

console.log(`🚀 Starting attack simulation against ${NGROK_URL}`);

// Define different attack patterns
const attackPatterns = [
  // Normal traffic - spread out requests
  async function normalTraffic() {
    console.log('📊 Simulating normal traffic pattern (50 requests)');
    for (let i = 0; i < 50; i++) {
      try {
        await axios.get(`${NGROK_URL}/api/data`);
        if (i % 10 === 0) console.log(`✓ Normal request ${i}/50`);
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      } catch (err) {
        console.log(`❌ Request failed: ${err.message}`);
      }
    }
  },
  
  // Suspicious traffic - faster requests from single IP
  async function suspiciousTraffic() {
    console.log('🔍 Simulating suspicious traffic pattern (80 requests)');
    for (let i = 0; i < 80; i++) {
      try {
        await axios.get(`${NGROK_URL}/api/data`);
        if (i % 10 === 0) console.log(`✓ Suspicious request ${i}/80`);
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      } catch (err) {
        console.log(`❌ Request failed: ${err.message}`);
      }
    }
  },
  
  // DDoS attack - rapid fire requests
  async function ddosAttack() {
    console.log('🚨 Simulating DDoS attack pattern (150 requests)');
    const promises = [];
    for (let i = 0; i < 150; i++) {
      promises.push(axios.get(`${NGROK_URL}/api/data`).catch(err => {
        // Expected to get rate limited eventually
        if (err.response?.status === 429) {
          console.log('✅ Rate limiting working! Request blocked.');
        } else {
          console.log(`❌ Request failed: ${err.message}`);
        }
      }));
      
      if (i % 30 === 0) {
        console.log(`⚡ Sending burst ${i/30 + 1}/5`);
        await Promise.allSettled(promises);
        promises.length = 0;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    await Promise.allSettled(promises);
  },
  
  // Honeypot triggers
  async function honeypotProbes() {
    console.log('🍯 Simulating honeypot probes');
    const honeypotPaths = ['/wp-admin', '/admin/config', '/phpmyadmin', '/wp-login.php'];
    
    for (const path of honeypotPaths) {
      console.log(`🔎 Probing ${path}`);
      try {
        await axios.get(`${NGROK_URL}${path}`);
      } catch (err) {
        console.log(`🎯 Honeypot response: ${err.response?.status || 'error'}`);
      }
    }
  }
];

// Run the simulation
async function runSimulation() {
  // First run normal traffic
  await attackPatterns[0]();
  console.log('\n--- Waiting 5 seconds ---\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Then run suspicious traffic
  await attackPatterns[1]();
  console.log('\n--- Waiting 5 seconds ---\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Then trigger honeypots
  await attackPatterns[3]();
  console.log('\n--- Waiting 5 seconds ---\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Finally run DDoS attack
  await attackPatterns[2]();
  
  console.log('\n🏁 Attack simulation complete!');
  console.log('Check your dashboard to see the results.');
}

runSimulation().catch(err => {
  console.error('Simulation failed:', err);
});