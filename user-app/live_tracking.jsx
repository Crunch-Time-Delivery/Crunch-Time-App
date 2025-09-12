// live_tracking.jsx
import React, { useEffect, useRef } from 'react';

function LiveTracking() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const mapboxAccessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox token

    // Initialize map with Mapbox tiles
    mapRef.current = L.map('mapContainer', {
      center: [-33.9129, 18.4179],
      zoom: 14,
    });

    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11', // You can choose different Mapbox styles
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapboxAccessToken,
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

    // Track user location using browser Geolocation API
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Add or update user's current location marker
        if (!mapRef.current.userMarker) {
          mapRef.current.userMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', // A simple user icon
              iconSize: [25, 25],
            }),
          }).addTo(mapRef.current).bindPopup('Your Location');
        } else {
          mapRef.current.userMarker.setLatLng([latitude, longitude]);
        }
        // Optionally, center the map on user's location
        // mapRef.current.setView([latitude, longitude], 14);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      clearInterval(interval);
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div id="mapContainer" style={{ height: '100%', width: '100%' }}></div>
  );
}

export default LiveTracking;