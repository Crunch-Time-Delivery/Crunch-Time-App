// File: functions/connection.js

// Example: Export a function to initialize driver tracking
function initDriverTracking(orderId, updateDriverCallback, handleError) {
  let intervalId = setInterval(async () => {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?order=${encodeURIComponent(orderId)}`, {
        cache: 'no-cache'
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      
      if (data.lat != null && data.lng != null) {
        updateDriverCallback(data.lat, data.lng);
      } else {
        throw new Error('Invalid data');
      }
    } catch (err) {
      handleError(err);
      clearInterval(intervalId);
    }
  }, 3000);
  
  // Return a function to stop tracking
  return () => clearInterval(intervalId);
}
// Inside DOMContentLoaded
let stopTrackingFunction = null;

const startTracking = () => {
  const orderId = orderInput.value.trim();
  if (!orderId || tracking) return;

  tracking = true;
  trackBtn.disabled = true;
  trackBtn.textContent = 'Tracking...';
  statusEl.className = 'status connecting';
  statusEl.textContent = 'Connecting to driver...';

  // Use the function from connection.js
  stopTrackingFunction = initDriverTracking(
    orderId,
    (lat, lng) => {
      updateDriverLocation(lat, lng);
      statusEl.className = 'status tracking';
      statusEl.textContent = 'Driver is moving...';
    },
    (err) => {
      console.warn('Tracking error:', err);
      if (!statusEl.classList.contains('error')) {
        statusEl.className = 'status error';
        statusEl.textContent = 'Driver not found or offline.';
        stopTracking();
      }
    }
  );
};
const stopTracking = () => {
  if (stopTrackingFunction) stopTrackingFunction();
  clearInterval(intervalId);
  tracking = false;
  trackBtn.disabled = false;
  trackBtn.textContent = 'Track';
};
// Export the function
window.initDriverTracking = initDriverTracking;