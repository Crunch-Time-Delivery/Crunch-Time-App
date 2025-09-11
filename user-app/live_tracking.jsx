// live_tracking.jsx
import React, { useEffect, useRef } from 'react';

function LiveTracking() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Initialize map
    mapRef.current = L.map('mapContainer', {
      center: [-33.9129, 18.4179],
      zoom: 14,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Add driver marker
    markerRef.current = L.marker([-33.9129, 18.4179]).addTo(mapRef.current).bindPopup("Driver Location").openPopup();

    // Simulate driver movement
    const interval = setInterval(() => {
      if (markerRef.current && mapRef.current) {
        let lat = markerRef.current.getLatLng().lat + (Math.random() - 0.5) * 0.01;
        let lng = markerRef.current.getLatLng().lng + (Math.random() - 0.5) * 0.01;
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}></div>
  );
}

export default LiveTracking;