// live_tracking.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

function LiveTracking() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const intervalRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    const mapboxAccessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your Mapbox token

    if (!mapRef.current && mapContainerRef.current) {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current, {
        center: [-33.9129, 18.4179],
        zoom: 14,
      });

      // Add Mapbox tile layer
      L.tileLayer(
        `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`,
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/streets-v11', // Choose your preferred style
          tileSize: 512,
          zoomOffset: -1,
          accessToken: mapboxAccessToken,
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
          // Optional: center map on driver
          // mapRef.current.setView([newLat, newLng], mapRef.current.getZoom());
        }
      }, 3000);

      // Watch user's real-time location
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (!mapRef.current.userMarker) {
            mapRef.current.userMarker = L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
                iconSize: [25, 25],
              }),
            }).addTo(mapRef.current).bindPopup('Your Location');
          } else {
            mapRef.current.userMarker.setLatLng([latitude, longitude]);
          }
          // Optional: center map on user's location
          // mapRef.current.setView([latitude, longitude], 14);
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }

    // Cleanup on unmount
    return () => {
      clearInterval(intervalRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (navigator.geolocation && watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%' }}
    ></div>
  );
}

export default LiveTracking;