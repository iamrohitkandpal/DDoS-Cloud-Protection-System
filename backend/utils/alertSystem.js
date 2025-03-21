import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

let wss;

export const initializeAlertSystem = (server) => {
  try {
    wss = new WebSocketServer({ server });
    
    wss.on('connection', (ws) => {
      console.log('Admin dashboard connected');
      
      // Send initial connection confirmation
      ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
    
    console.log('Alert system initialized');
  } catch (error) {
    console.error('Failed to initialize WebSocket server:', error);
  }
};

export const sendAlert = (alertData) => {
  if (!wss) {
    console.warn('WebSocket server not initialized');
    return;
  }
  
  try {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(alertData));
      }
    });
  } catch (error) {
    console.error('Error sending WebSocket alert:', error);
  }
};

// Example usage in your app.js:
// import { initializeAlertSystem } from "./utils/alertSystem.js";
// const server = createServer(app);
// initializeAlertSystem(server);
// server.listen(PORT, () => {...});