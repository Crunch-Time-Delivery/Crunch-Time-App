let map;
let marker;

function initMap() {
  // Initialize the map centered at a default location (e.g., San Francisco)
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
  });

  // Create a marker at a default position
  marker = new google.maps.Marker({
    map: map,
    position: { lat: 0, lng: 0 }, // Placeholder
    title: "Current Location",
  });

  // Check if Geolocation is supported
  if (navigator.geolocation) {
    // Watch for position changes
    navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Update marker position
        marker.setPosition(pos);
        // Center the map on the new position
        map.setCenter(pos);
      },
      (error) => {
        handleLocationError(true, map.getCenter(), error);
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos, error) {
  // Handle Geolocation errors
  if (error) {
    console.error("Geolocation error:", error.message);
  }
  console.error(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support Geolocation."
  );
  // Optionally, display a message to the user here
}

export { initMap };