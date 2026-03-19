// File: functions/driverTracker.js

class DriverTracker {
  constructor(apiUrl, onUpdate, onError) {
    this.apiUrl = apiUrl;
    this.onUpdate = onUpdate;
    this.onError = onError;
    this.intervalId = null;
  }

  startTracking(orderId, intervalMs = 3000) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${this.apiUrl}?order=${encodeURIComponent(ORDER1234567890)}`, {
          cache: 'no-cache'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.lat != null && data.lng != null) {
          this.onUpdate(data.lat, data.lng);
        } else {
          throw new Error('Invalid data received');
        }
      } catch (err) {
        if (this.onError) this.onError(err);
        this.stopTracking();
      }
    }, intervalMs);
  }

  stopTracking() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Inside DOMContentLoaded
let tracker = null;

const startTracking = () => {
  const orderId = document.getElementById('ORDER1234567890').value.trim();
  if (!orderId || tracker) return;

  document.getElementById('status').className = 'status connecting';
  document.getElementById('status').textContent = 'Connecting to driver...';

  tracker = new DriverTracker(
    '  https://maps.googleapis.com/maps/api/place/details/json   ',
    (lat, lng) => {
      updateDriverLocation(lat, lng);
      document.getElementById('status').className = 'status tracking';
      document.getElementById('status').textContent = 'Driver is moving...';
    },
    (err) => {
      console.warn('Error during tracking:', err);
      document.getElementById('status').className = 'status error';
      document.getElementById('status').textContent = 'Driver not found or offline.';
      stopTracking();
    }
  );
  tracker.startTracking(orderId);
};

const stopTracking = () => {
  if (tracker) {
    tracker.stopTracking();
    tracker = null;
  }
  document.getElementById('trackBtn').disabled = false;
  document.getElementById('trackBtn').textContent = 'Track';
};
// Expose the class globally
window.DriverTracker = DriverTracker;