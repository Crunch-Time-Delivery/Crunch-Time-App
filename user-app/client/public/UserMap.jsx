import React, { useEffect, useRef } from 'react';
import App from './live_tracking.jsx';

function UserMap({ userLat, userLng, onLocationChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (
      typeof userLat === 'number' &&
      typeof userLng === 'number' &&
      !mapRef.current &&
      window.google
    ) {
      // Initialize Map
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: userLat, lng: userLng },
        zoom: 14,
      });

      // Add user marker
      userMarkerRef.current = new window.google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map: mapRef.current,
        icon: {
          url: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
          scaledSize: new window.google.maps.Size(25, 25),
        },
        title: 'Your Location',
      });
    }
  }, [userLat, userLng]);

  useEffect(() => {
    if (
      typeof userLat === 'number' &&
      typeof userLng === 'number' &&
      mapRef.current &&
      userMarkerRef.current
    ) {
      // Update marker position
      userMarkerRef.current.setPosition({ lat: userLat, lng: userLng });
      // Optional: center map
      // mapRef.current.panTo({ lat: userLat, lng: userLng });
      if (onLocationChange) {
        onLocationChange(userLat, userLng);
      }
    }
  }, [userLat, userLng, onLocationChange]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%' }}
      ></div>
    </div>
  );
}

export default UserMap;