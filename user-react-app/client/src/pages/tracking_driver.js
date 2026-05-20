const API_KEY = ' AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q '; // Replace with your API key
  const DUMMY_ORDER_ID = 'ORDER1234567890';
let map, driverMarker, customerMarker;
let tracking = false;
let intervalId = null;
let customerLat = 37.7850, customerLng = -122.4383; // Default customer location

// Initialize map with default center
function initMap() {
  let centerCoords = { lat: 0, lng: 0 };
  const currentOrderId = document.getElementById('orderId').value.trim();

  if (currentOrderId === DUMMY_ORDER_ID) {
    centerCoords = { lat: -33.9249, lng: 18.4241 }; // Cape Town
  }

  // Create map only if not initialized
  if (!map) {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: centerCoords,
      mapTypeId: 'roadmap',
      disableDefaultUI: false,
      zoomControl: true,
    });
  } else {
    // Re-center map for new order
    map.setCenter(centerCoords);
  }

  // Initialize customer marker
  if (!customerMarker) {
    customerMarker = new google.maps.Marker({
      map,
      title: "You are here",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#4285f4',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2
      }
    });
  }
  updateCustomerMarker();

  // Initialize driver marker
  if (!driverMarker) {
    driverMarker = new google.maps.Marker({
      map,
      title: "Driver",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 11,
        fillColor: '#d32f2f',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3
      }
    });
  }
}

// Update customer marker position
function updateCustomerMarker() {
  if (customerMarker) {
    customerMarker.setPosition({ lat: customerLat, lng: customerLng });
    map.panTo({ lat: customerLat, lng: customerLng });
  }
}

// Update driver position
function updateDriverLocation(lat, lng) {
  const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };
  if (driverMarker) {
    driverMarker.setPosition(pos);
    map.panTo(pos);
    map.setZoom(15);
  }
}

// Fetch current customer location
function updateCustomerLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        customerLat = pos.coords.latitude;
        customerLng = pos.coords.longitude;
        updateCustomerMarker();
      },
      () => console.warn("Geolocation denied")
    );
  }
}

// Start tracking driver
function startTracking() {
  if (tracking) return; // Already tracking
  const orderId = document.getElementById('orderId').value.trim();

  initMap(); // Initialize or re-center map
  document.getElementById('status').className = 'status connecting';
  document.getElementById('status').textContent = 'Connecting to driver...';

  // Begin polling driver location
  intervalId = setInterval(() => pollDriverLocation(orderId), 3000);
  tracking = true;
  document.getElementById('trackBtn').disabled = true;
  document.getElementById('trackBtn').textContent = 'Tracking...';

  // Optionally, update customer location periodically
  updateCustomerLocation();
  setInterval(updateCustomerLocation, 15000);
}

// Stop tracking driver
function stopTracking() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    tracking = false;
    document.getElementById('trackBtn').disabled = false;
    document.getElementById('trackBtn').textContent = 'Track';
    document.getElementById('status').className = 'status idle';
    document.getElementById('status').textContent = 'Tracking stopped.';
  }
}

// Poll driver location - replace with actual API call
const DUMMY_ORDER_ID = 'dummy123'; // Define your dummy ID
async function pollDriverLocation(orderId) {
  try {
    if (orderId === DUMMY_ORDER_ID) {
      // Simulate driver movement
      const lat = -33.9249 + Math.random() * 0.02;
      const lng = 18.4241 + Math.random() * 0.02;
      updateDriverLocation(lat, lng);
      document.getElementById('status').className = 'status tracking';
      document.getElementById('status').textContent = 'Driver is moving...';
    } else {
      throw new Error('Driver not found');
    }
  } catch (err) {
    console.warn('Error:', err);
    document.getElementById('status').className = 'status error';
    document.getElementById('status').textContent = 'Driver not found or offline.';
    clearInterval(intervalId);
    tracking = false;
    document.getElementById('trackBtn').disabled = false;
    document.getElementById('trackBtn').textContent = 'Track';
  }
}

// Event listeners setup
document.addEventListener('DOMContentLoaded', () => {
  // Load Google Maps script dynamically
  window.initMap = initMap;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q&callback=initMap`;
  script.async = true;
  document.head.appendChild(script);

  document.getElementById('trackBtn').addEventListener('click', startTracking);
  document.getElementById('orderId').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startTracking();
  });
});