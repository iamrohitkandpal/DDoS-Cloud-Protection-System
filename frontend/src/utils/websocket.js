import { Client } from "@stomp/stompjs";

let client = null;

export const connectWebSocket = (onMessage) => {
  client = new Client({
    brokerURL: "ws://localhost:8000/ws",
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe("/topic/traffic", (message) => {
        onMessage(JSON.parse(message.body));
      });
    },
  });

  client.activate();
  return client;
};

export const disconnectWebSocket = () => {
  if (client) client.deactivate();
};
