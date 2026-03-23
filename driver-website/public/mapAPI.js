// Map module encapsulation
const MapModule = (() => {
  let map = null;
  let marker = null;
  let watchId = null;

  // Initialize the map
  function initMap(elementId = "map", defaultCenter = { lat: 37.7749, lng: -122.4194 }, defaultZoom = 12) {
    const mapElement = document.getElementById(elementId);
    if (!mapElement) {
      console.error(`Element with id "${elementId}" not found.`);
      return;
    }

    // Create the map
    map = new google.maps.Map(mapElement, {
      center: defaultCenter,
      zoom: defaultZoom,
    });

    // Create a marker at a default position
    marker = new google.maps.Marker({
      map: map,
      position: defaultCenter,
      title: "Current Location",
    });

    // Start watching geolocation
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          updatePosition(pos);
        },
        (error) => {
          handleLocationError(true, map.getCenter(), error);
        }
      );
    } else {
      handleLocationError(false, map.getCenter());
    }
  }

  // Update marker position and center map
  function updatePosition(position) {
    if (marker && map) {
      marker.setPosition(position);
      map.setCenter(position);
    }
  }

  // Stop watching geolocation
  function stopTracking() {
    if (navigator.geolocation && watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }

  // Handle geolocation errors
  function handleLocationError(browserHasGeolocation, pos, error) {
    if (error) {
      console.error("Geolocation error:", error.message);
    } else {
      console.error(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support Geolocation."
      );
    }
    // Optionally, show user feedback here
  }

  // Expose public functions
  return {
    initMap,
    stopTracking,
    updatePosition,
  };
})();

// Usage example (call this after the page loads):
// MapModule.initMap();

export { MapModule };