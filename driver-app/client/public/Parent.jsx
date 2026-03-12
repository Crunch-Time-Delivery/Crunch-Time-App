import React, { useState, useEffect } from 'react';
import LiveTracking from './live_tracking';

function Parent() {
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    // Example: get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    }
  }, []);

  const handleLocationChange = (lat, lng) => {
    console.log('User location updated:', lat, lng);
    // You can handle additional logic here
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <h2>Live Tracking Map</h2>
      <LiveTracking
        userLat={userLocation.lat}
        userLng={userLocation.lng}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
}

export default Parent;