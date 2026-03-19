let map;
let userMarker;
let driverMarker;
let driverLocation = { lat: 37.7749, lng: -122.4194 }; // Initial driver location, replace with actual data

function initMap() {
  // Initialize the map centered on user's location
  navigator.geolocation.getCurrentPosition(position => {
    const userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    map = new google.maps.Map(document.getElementById('map'), {
      center: userLocation,
      zoom: 14
    });

    // Add user marker
    userMarker = new google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Your Location'
    });

    // Add driver marker
    driverMarker = new google.maps.Marker({
      position: driverLocation,
      map: map,
      title: 'Driver',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      }
    });

    // Start tracking driver
    trackDriver();
  });
}

function trackDriver() {
  // Example: simulate driver movement every 5 seconds
  setInterval(() => {
    // Fetch new driver location from your API/backend here
    // For demo, we'll just move the driver randomly
    driverLocation.lat += (Math.random() - 0.5) * 0.001;
    driverLocation.lng += (Math.random() - 0.5) * 0.001;

    // Update driver marker position
    driverMarker.setPosition(driverLocation);

    // Optional: center map to driver
    // map.panTo(driverLocation);
  }, 5000);
}

// Load the Google Maps script dynamically
function loadScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
  script.defer = true;
  document.head.appendChild(script);
}

window.onload = loadScript;