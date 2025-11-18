let map = null;
let marker = null;

/**
 * Initialize the Google Map
 */
function initMap() {
  const initialPosition = { lat: 40.7128, lng: -74.0060 }; // Example: New York City

  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Map element not found");
    return;
  }

  // Initialize the map
  map = new google.maps.Map(mapElement, {
    center: initialPosition,
    zoom: 14,
  });

  // Initialize the marker
  marker = new google.maps.Marker({
    position: initialPosition,
    map: map,
    title: "Live Location",
  });
}

/**
 * Update marker position
 * @param {Object} position - new latitude and longitude
 * @param {number} position.lat
 * @param {number} position.lng
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
 * Simulate live tracking updates
 */
function simulateLiveTracking() {
  let lat = 40.7128;
  let lng = -74.0060;

  setInterval(() => {
    // For demo: move the marker randomly
    lat += (Math.random() - 0.5) * 0.001;
    lng += (Math.random() - 0.5) * 0.001;
    updatePosition({ lat, lng });
  }, 3000); // update every 3 seconds
}

// Initialize map when window loads
window.addEventListener('load', () => {
  initMap();
  simulateLiveTracking(); // Remove or replace with real data source
});