import { WebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing WebSocket connection to server...');

const ws = new WebSocket('ws://localhost:5000');

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Send a test message
  ws.send(JSON.stringify({ type: 'test', message: 'Hello from test client' }));
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    console.log('Received message:', message);
  } catch (error) {
    console.error('Error parsing message:', error);
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});

// Close connection after 5 seconds
setTimeout(() => {
  ws.close();
  process.exit(0);
}, 5000);