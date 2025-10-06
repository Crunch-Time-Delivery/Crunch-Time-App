// user-app/.live_tracking.jsx
import React, { useEffect, useRef } from 'react';
// Make sure to import Leaflet
import L from 'leaflet';

function LiveTracking({ userLat, userLng, onLocationChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const intervalRef = useRef(null);

  const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox token

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current, {
        center: [-33.9129, 18.4179],
        zoom: 14,
      });

      // Add Mapbox tile layer
      L.tileLayer(
        `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: MAPBOX_ACCESS_TOKEN,
        }
      ).addTo(mapRef.current);

      // Add driver marker
      driverMarkerRef.current = L.marker([-33.9129, 18.4179])
        .addTo(mapRef.current)
        .bindPopup('Driver Location');

      // Simulate driver movement
      intervalRef.current = setInterval(() => {
        if (driverMarkerRef.current && mapRef.current) {
          const currentLatLng = driverMarkerRef.current.getLatLng();
          const newLat =
            currentLatLng.lat + (Math.random() - 0.5) * 0.01;
          const newLng =
            currentLatLng.lng + (Math.random() - 0.5) * 0.01;
          driverMarkerRef.current.setLatLng([newLat, newLng]);
          mapRef.current.setView([newLat, newLng], mapRef.current.getZoom());
        }
      }, 3000);
    }

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (
      typeof userLat === 'number' &&
      typeof userLng === 'number' &&
      mapRef.current
    ) {
      if (!userMarkerRef.current) {
        // Add user location marker
        userMarkerRef.current = L.marker([userLat, userLng], {
          icon: L.icon({
            iconUrl:
              'https://cdn-icons-png.flaticon.com/512/64/64113.png',
            iconSize: [25, 25],
          }),
        })
          .addTo(mapRef.current)
          .bindPopup('Your Location');
      } else {
        // Update position
        userMarkerRef.current.setLatLng([userLat, userLng]);
      }
      // Optional: center map on user
      // mapRef.current.setView([userLat, userLng], 14);

      // Trigger callback if provided
      if (onLocationChange) {
        onLocationChange(userLat, userLng);
      }
    }
  }, [userLat, userLng, onLocationChange]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%' }}
      ></div>
    </div>
  );
}

export default LiveTracking;