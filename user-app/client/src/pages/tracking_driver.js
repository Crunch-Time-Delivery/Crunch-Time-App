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

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: centerCoords,
      mapTypeId: 'roadmap',
      disableDefaultUI: false,
      zoomControl: true,
    });

    // Customer Marker
    customerMarker = new google.maps.Marker({
      map: map,
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

    // Driver Marker
    driverMarker = new google.maps.Marker({
      map: map,
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

    updateCustomerMarker();
  }

  function updateCustomerMarker() {
    if (customerMarker) {
      customerMarker.setPosition({ lat: customerLat, lng: customerLng });
      map.panTo({ lat: customerLat, lng: customerLng });
    }
  }

  function updateDriverLocation(lat, lng) {
    const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };
    driverMarker.setPosition(pos);
    map.panTo(pos);
    map.setZoom(15);
  }

  // Geolocation for customer
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

  // Start tracking
 document.addEventListener('DOMContentLoaded', () => {
    const orderInput = document.getElementById('orderId');
    const trackBtn = document.getElementById('trackBtn');
    const statusEl = document.getElementById('status');

    // Load Google Maps script
    window.initMap = initMap;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q}&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);

    // Update customer location periodically
    setInterval(updateCustomerLocation, 15000);
    updateCustomerLocation();

    const startTracking = () => {
      if (tracking) return; // Already tracking
      const orderId = orderInput.value.trim();
      initMap(); // Re-init map for new order
      statusEl.className = 'status connecting';
      statusEl.textContent = 'Connecting to driver...';

      // Begin polling
      intervalId = setInterval(() => pollDriverLocation(orderId), 3000);
      tracking = true;
      document.getElementById('trackBtn').disabled = true;
      document.getElementById('trackBtn').textContent = 'Tracking...';
    };

    const pollDriverLocation = async (orderId) => {
      try {
        // Replace with your server API call to fetch driver location
        // For demo, simulate driver movement for dummy ID
        if (orderId === DUMMY_ORDER_ID) {
          const lat = -33.9249 + Math.random() * 0.02;
          const lng = 18.4241 + Math.random() * 0.02;
          updateDriverLocation(lat, lng);
          statusEl.className = 'status tracking';
          statusEl.textContent = 'Driver is moving...';
        } else {
          throw new Error('Driver not found');
        }
      } catch (err) {
        console.warn('Error:', err);
        statusEl.className = 'status error';
        statusEl.textContent = 'Driver not found or offline.';
        clearInterval(intervalId);
        tracking = false;
        document.getElementById('trackBtn').disabled = false;
        document.getElementById('trackBtn').textContent = 'Track';
      }
    };

    document.getElementById('trackBtn').addEventListener('click', startTracking);
    document.getElementById('orderId').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') startTracking();
    });
  });