import React, { useEffect, useRef } from 'react';

function LiveTracking({ userLat, userLng, onLocationChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current && window.google && mapContainerRef.current) {
      // Initialize Google Map
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: -33.9129, lng: 18.4179 },
        zoom: 14,
      });

      // Add driver marker
      driverMarkerRef.current = new window.google.maps.Marker({
        position: { lat: -33.9129, lng: 18.4179 },
        map: mapRef.current,
        popup: 'Driver Location',
      });

      // Simulate driver movement
      intervalRef.current = setInterval(() => {
        if (driverMarkerRef.current && mapRef.current) {
          const currentPos = driverMarkerRef.current.getPosition();
          const newLat = currentPos.lat() + (Math.random() - 0.5) * 0.01;
          const newLng = currentPos.lng() + (Math.random() - 0.5) * 0.01;
          const newLatLng = new window.google.maps.LatLng(newLat, newLng);
          driverMarkerRef.current.setPosition(newLatLng);
          mapRef.current.panTo(newLatLng);
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
      } else {
        // Update user marker position
        userMarkerRef.current.setPosition({ lat: userLat, lng: userLng });
      }

      // Optional: Center map on user
      // mapRef.current.panTo({ lat: userLat, lng: userLng });

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
        // Google Maps API doesn't have a direct 'remove' method for the map
        // but you can set it to null or handle accordingly
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