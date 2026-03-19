import { initMap, updateDriverPosition, updateUserPosition } from './functions/mapFunctions.js';

function startTracking() {
  initMap(() => {
    // Replace this with your actual live data source, e.g., WebSocket connection
    const socket = new WebSocket('wss://your-websocket-url');

    socket.onopen = () => {
      console.log('WebSocket connected for live tracking');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Expect data to have lat and lng
      if (data.lat && data.lng) {
        updateDriverPosition({ lat: data.lat, lng: data.lng });
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected. Reconnect in 5 seconds...');
      setTimeout(() => startTracking(), 5000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Optionally, simulate user position updates
    setInterval(() => {
      // You can replace this with real user location fetching
      navigator.geolocation.getCurrentPosition((pos) => {
        updateUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }, 5000);
  });
}

window.onload = startTracking;