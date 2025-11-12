let map: google.maps.Map;
let marker: google.maps.Marker;

/**
 * Initialize the Google Map
 */
function initMap(): void {
  const initialPosition = { lat: 40.7128, lng: -74.0060 }; // Example: New York City

  const mapElement = document.getElementById("map") as HTMLElement;
  if (!mapElement) {
    console.error("Map element not found");
    return;
  }

  map = new google.maps.Map(mapElement, {
    center: initialPosition,
    zoom: 14,
  });

  marker = new google.maps.Marker({
    position: initialPosition,
    map: map,
    title: "Live Location",
  });
}

/**
 * Update marker position
 * @param position - new latitude and longitude
 */
function updatePosition(position: { lat: number; lng: number }): void {
  if (!marker || !map ) {
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
window.onload = () => {
  initMap();
  simulateLiveTracking(); // Remove or replace with real data source
};