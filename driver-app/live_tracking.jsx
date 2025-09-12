// user-app/.live_tracking.jsx
import React, { useEffect, useRef } from 'react';
import './live-tracking.jsx';

// Assuming you will pass props or import the capture_location component elsewhere
function LiveTracking({ userLat, userLng }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const userLocationRef = useRef(null);

  const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox token

  useEffect(() => {
    // Initialize map with Mapbox styles
    mapRef.current = L.map('mapContainer', {
      center: [-33.9129, 18.4179],
      zoom: 14,
    });

    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`, {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: MAPBOX_ACCESS_TOKEN,
    }).addTo(mapRef.current);

    // Add driver marker
    markerRef.current = L.marker([-33.9129, 18.4179])
      .addTo(mapRef.current)
      .bindPopup("Driver Location")
      .openPopup();

    // Simulate driver movement
    const interval = setInterval(() => {
      if (markerRef.current && mapRef.current) {
        let lat = markerRef.current.getLatLng().lat + (Math.random() - 0.5) * 0.01;
        let lng = markerRef.current.getLatLng().lng + (Math.random() - 0.5) * 0.01;
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      }
    }, 3000);

    // Function to update user location from capture_location.jsx
    const updateUserLocation = (lat, lng) => {
      if (!mapRef.current.userMarker) {
        mapRef.current.userMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            iconSize: [25, 25],
          }),
        }).addTo(mapRef.current).bindPopup('Your Location');
      } else {
        mapRef.current.userMarker.setLatLng([lat, lng]);
      }
      // Optional: Center map on user
      // mapRef.current.setView([lat, lng], 14);
    };

    // For demonstration, simulate receiving location updates
    // In real app, connect this to capture_location.jsx
    // e.g., via context, callback, or event emitter

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Example callback to receive location updates from capture_location.jsx
  // You can pass this function down or set up a state management solution
  const handleLocationUpdate = (lat, lng) => {
    if (mapRef.current) {
      if (!mapRef.current.userMarker) {
        mapRef.current.userMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            iconSize: [25, 25],
          }),
        }).addTo(mapRef.current).bindPopup('Your Location');
      } else {
        mapRef.current.userMarker.setLatLng([lat, lng]);
      }
      // Optional: Center map
      // mapRef.current.setView([lat, lng], 14);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div id="mapContainer" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
}

export default LiveTracking;