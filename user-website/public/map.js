let map = null;
let marker = null;
let updateIntervalId = null;

/**
 * Initialize the Google Map
 */
function initMap() {
  const initialPosition = { lat: 40.7128, lng: -74.0060 }; // NYC

  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Map element not found");
    return;
  }

  // Create the map
  map = new google.maps.Map(mapElement, {
    center: initialPosition,
    zoom: 14,
  });

  // Create the marker
  marker = new google.maps.Marker({
    position: initialPosition,
    map: map,
    title: "Live Location",
  });
}

/**
 * Update marker position and pan map
 * @param {Object} position - new position with lat and lng
 */
function updatePosition(position) {
  if (!marker || !map) {
    console.error("Map or marker not initialized");
    return;
  }
  marker.setPosition(position);
  map.panTo(position);
}

/**
 * Fetch latest location data from your backend API
 */
async function fetchLiveLocation() {
  try {
    const response = await fetch('/api/live-location'); // Replace with your API endpoint
    if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
    const data = await response.json();

    // Adjust based on your API's response structure
    const { latitude, longitude } = data;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Invalid location data received');
    }
    updatePosition({ lat: latitude, lng: longitude });
  } catch (err) {
    console.error('Failed to fetch live location:', err);
  }
}

/**
 * Start polling for live location updates
 */
function startLiveUpdates(interval = 3000) {
  // Fetch initial location immediately
  fetchLiveLocation();

  // Clear previous interval if any
  if (updateIntervalId) clearInterval(updateIntervalId);

  // Poll periodically
  updateIntervalId = setInterval(fetchLiveLocation, interval);
}

/**
 * Cleanup function to stop updates and cleanup resources if needed
 */
function stopLiveUpdates() {
  if (updateIntervalId) {
    clearInterval(updateIntervalId);
    updateIntervalId = null;
  }
}

/**
 * Initialize map and start updates on window load
 */
window.addEventListener('load', () => {
  initMap();
  startLiveUpdates(3000); // poll every 3 seconds
});

// Optional: clean up on unload
window.addEventListener('beforeunload', () => {
  stopLiveUpdates();
});