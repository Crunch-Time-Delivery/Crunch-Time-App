// route_display.js

// Initialize the map
let map;
let routeLayer;

// Function to initialize the map
function initMap(containerId = 'map', center = [51.505, -0.09], zoomLevel = 13) {
  // Create the map
  map = L.map(containerId).setView(center, zoomLevel);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Initialize an empty layer group for the route
  routeLayer = L.layerGroup().addTo(map);
}

// Function to set or update the route
function setRoute(coordinates) {
  // Clear existing route
  routeLayer.clearLayers();

  if (coordinates && coordinates.length > 0) {
    // Add new polyline
    const polyline = L.polyline(coordinates, { color: 'blue', weight: 4 }).addTo(routeLayer);
    // Fit map bounds to the route
    map.fitBounds(polyline.getBounds());
  }
}

// Export functions for external use
export { initMap, setRoute };