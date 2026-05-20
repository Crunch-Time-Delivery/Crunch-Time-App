;let map;
let userMarker;
let driverMarker;
let driverLocation = { lat: 37.7749, lng: -122.4194 }; // Initial driver location

// Initialize the map once the Google Maps script loads
function initMap() {
  // Get user's current location
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Create the map centered on user's location
      map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 14,
      });

      // Add user marker
      userMarker = new google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        },
      });

      // Add driver marker
      driverMarker = new google.maps.Marker({
        position: driverLocation,
        map,
        title: 'Driver',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      // Start tracking driver
      trackDriver();
    },
    (error) => {
      console.error('Error getting user location:', error);
      alert('Unable to retrieve your location.');
    }
  );
}

// Simulate driver movement; replace with real API call in production
function trackDriver() {
  const moveInterval = 5000; // 5 seconds

  setInterval(() => {
    // TODO: Replace this with real API call to get driver location
    driverLocation.lat += (Math.random() - 0.5) * 0.001;
    driverLocation.lng += (Math.random() - 0.5) * 0.001;

    if (driverMarker) {
      driverMarker.setPosition(driverLocation);
    } else {
      console.warn('Driver marker not initialized.');
    }

    // Optional: keep map centered on driver
    // map.panTo(driverLocation);
  }, moveInterval);
}

// Load Google Maps script dynamically
function loadScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q&callback=initMap`;
  script.defer = true;
  script.async = true;
  document.head.appendChild(script);
}

// Load the map when window loads
window.onload = loadScript;