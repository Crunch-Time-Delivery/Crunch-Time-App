
// Function to simulate real-time location updates
function simulateDriverMovement() {
    // New location (example: moving slightly east)
    const newLocation = { lat: 37.7749, lng: -122.40 };

    // Update the marker's position
    driverMarker.setPosition(newLocation);

    // Optionally, center the map on the new location
    map.setCenter(newLocation);

    console.log("Driver location updated to: ", newLocation);
}

// Function to update a marker's position
export function updateMarker(markerRef, newLat, newLng) {
  if (markerRef.current) {
    markerRef.current.setPosition(new window.google.maps.LatLng(newLat, newLng));
  }
}