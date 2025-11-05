// pinpoint.js

// Function to update a marker's position
export function updateMarker(markerRef, newLat, newLng) {
  if (markerRef.current) {
    markerRef.current.setPosition(new window.google.maps.LatLng(newLat, newLng));
  }
}