// user-app/.live_tracking.jsx
import React, { useEffect, useRef } from 'react';

function LiveTracking({ userLat, userLng, onLocationChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox token

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map('mapContainer', {
      center: [-33.9129, 18.4179],
      zoom: 14,
    });

    // Add Mapbox tile layer
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
        const currentLatLng = markerRef.current.getLatLng();
        const newLat = currentLatLng.lat + (Math.random() - 0.5) * 0.01;
        const newLng = currentLatLng.lng + (Math.random() - 0.5) * 0.01;
        markerRef.current.setLatLng([newLat, newLng]);
        mapRef.current.setView([newLat, newLng], mapRef.current.getZoom());
      }
    }, 3000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Effect to update user location marker when props change
  useEffect(() => {
    if (
      typeof userLat === 'number' &&
      typeof userLng === 'number' &&
      mapRef.current
    ) {
      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([userLat, userLng], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            iconSize: [25, 25],
          }),
        }).addTo(mapRef.current).bindPopup('Your Location');
      } else {
        userMarkerRef.current.setLatLng([userLat, userLng]);
      }
      // Optional: center map on user location
      // mapRef.current.setView([userLat, userLng], 14);

      // Call callback if provided
      if (onLocationChange) {
        onLocationChange(userLat, userLng);
      }
    }
  }, [userLat, userLng, onLocationChange]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        id="mapContainer"
        style={{ height: '100%', width: '100%' }}
      ></div>
    </div>
  );
}

export default LiveTracking;