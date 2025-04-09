let ws = null;

export const connectWebSocket = (onMessage) => {
  // Use plain WebSocket instead of STOMP client for simplicity
  if (ws) {
    ws.close();
  }
  
  try {
    // Add a check for demo mode
    const isDemoMode = !localStorage.getItem('useRealWebSocket');
    
    if (isDemoMode) {
      console.log('WebSocket in demo mode (not connecting to real server)');
      // Send mock data periodically to simulate events
      const mockInterval = setInterval(() => {
        if (onMessage) {
          onMessage({
            type: 'demo_data',
            timestamp: new Date().toISOString(),
            message: 'This is simulated data for demo mode'
          });
        }
      }, 10000);
      
      // Return a mock websocket object
      return {
        close: () => {
          console.log('Closing mock WebSocket');
          clearInterval(mockInterval);
        },
        isMock: true
      };
    }
    
    ws = new WebSocket("ws://localhost:5000");
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Signal to the component that WebSocket failed
      if (onMessage) {
        onMessage({ type: 'connection_error', error: 'WebSocket connection failed' });
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket closed');
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        if (onMessage) connectWebSocket(onMessage);
      }, 5000);
    };
    
    return ws;
  } catch (error) {
    console.error('Error creating WebSocket:', error);
    // Signal to the component that WebSocket creation failed
    if (onMessage) {
      onMessage({ type: 'connection_error', error: 'Failed to create WebSocket connection' });
    }
    return null;
  }
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};
