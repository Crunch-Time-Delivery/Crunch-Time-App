import { updatePosition } from './functions/map.js';

export class RealTimeDataFetcher {
  constructor() {
    this.connect();
  }

  connect() {
    // Replace with your actual WebSocket URL
    this.socket = new WebSocket('wss://your-websocket-url');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Expect data to have lat and lng
      if (data.lat !== undefined && data.lng !== undefined) {
        updatePosition({ lat: data.lat, lng: data.lng });
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected, reconnecting in 5 seconds...');
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
}