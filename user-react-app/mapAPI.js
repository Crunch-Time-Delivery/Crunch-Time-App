let map;
let marker;

function initMap() {
  // Initialize the map centered at a default location (e.g., San Francisco)
  const defaultCenter = { lat: 37.7749, lng: -122.4194 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 12,
  });

  // Create a marker (initially hidden at default location)
  marker = new google.maps.Marker({
    map: map,
    position: defaultCenter,
    title: "Current Location",
    visible: false, // Hide until actual location is obtained
  });

  // Check if the browser supports Geolocation
  if (navigator.geolocation) {
    // Watch for position changes
    navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Update marker position and make it visible
        marker.setPosition(pos);
        marker.setMap(map);
        marker.setVisible(true);

        // Center the map on the current position
        map.setCenter(pos);
      },
      (error) => {
        handleLocationError(true, map.getCenter(), error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos, error = null) {
  if (error) {
    console.error("Geolocation error:", error.message);
  }
  // You can also display messages to the user here
  alert(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support Geolocation."
  );
}

// Ensure that this function is called when the Google Maps API loads.
// In your HTML, include: <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
export { initMap };