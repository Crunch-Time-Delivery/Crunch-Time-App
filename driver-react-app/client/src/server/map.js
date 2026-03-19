let map = null;
let marker = null;

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
 * Replace this with your actual live data source
 */
async function fetchLiveLocation() {
  try {
    // Replace URL with your backend API that returns latest location
    const response = await fetch('/api/live-location'); // Example endpoint
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    const { latitude, longitude } = data; // Adjust according to your API response
    updatePosition({ lat: latitude, lng: longitude });
  } catch (err) {
    console.error('Failed to fetch live location:', err);
  }
}

/**
 * Poll for live location updates periodically
 */
function startLiveUpdates(interval = 3000) {
  // Fetch initial location immediately
  fetchLiveLocation();

  // Then poll periodically
  setInterval(fetchLiveLocation, interval);
}

// Initialize map and start live updates on window load
window.addEventListener('load', () => {
  initMap();
  startLiveUpdates(3000); // poll every 3 seconds
});