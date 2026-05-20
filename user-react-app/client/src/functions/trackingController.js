import { initMap, updateDriverPosition, updateUserPosition } from './mapFunctions.js';

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
        socket.close(); // close to trigger reconnect
      };
    };

    // Start WebSocket connection
    connectWebSocket();

    // Function to update user location periodically
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

    // Initial user location fetch
    updateUserLocation();

    // Periodic update every 5 seconds
    const userLocationInterval = setInterval(updateUserLocation, 5000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(userLocationInterval);
      if (socket) socket.close();
    });
  });
}

// Export the startTracking function
export { startTracking };