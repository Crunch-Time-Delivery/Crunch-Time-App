import { initMap, updateDriverPosition, updateUserPosition } from './functions/mapFunctions.js';

function startTracking() {
  initMap(() => {
    let socket;

    // Function to connect WebSocket with auto-reconnect
    const connectWebSocket = () => {
      socket = new WebSocket('wss://your-websocket-url');

      socket.onopen = () => {
        console.log('WebSocket connected for live tracking');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.lat !== undefined && data.lng !== undefined) {
            updateDriverPosition({ lat: data.lat, lng: data.lng });
          } else {
            console.warn('Received data missing lat/lng:', data);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting in 5 seconds...');
        setTimeout(connectWebSocket, 5000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close(); // Close socket on error to trigger reconnect
      };
    };

    // Initiate WebSocket connection
    connectWebSocket();

    // Optionally, simulate or fetch user location periodically
    const updateUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            updateUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },
          (err) => {
            console.error('Geolocation error:', err);
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
      }
    };

    // Update user position every 5 seconds
    updateUserLocation(); // initial fetch
    const userPositionInterval = setInterval(updateUserLocation, 5000);

    // Optional: clear interval when needed, e.g., on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(userPositionInterval);
      if (socket) socket.close();
    });
  });
}

window.onload = startTracking;