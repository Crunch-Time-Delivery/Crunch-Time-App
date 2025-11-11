import { initMap, updateDriverPosition, updateUserPosition } from './functions/mapFunctions.js';

function startTracking() {
  initMap(() => {
    // Simulate driver movement
    setInterval(() => {
      const newDriverLocation = {
        lat: /* fetch or calculate new lat */,
        lng: /* fetch or calculate new lng */,
      };
      updateDriverPosition(newDriverLocation);
    }, 5000);
  });
}

window.onload = startTracking;