import React, { useEffect, useRef } from 'react';

function DriverMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current && window.google && mapContainerRef.current) {
      // Initialize Google Map
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: -33.9129, lng: 18.4179 },
        zoom: 14,
      });

      // Add driver marker at initial position
      driverMarkerRef.current = new window.google.maps.Marker({
        position: { lat: -33.9129, lng: 18.4179 },
        map: mapRef.current,
        title: 'Driver Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      // Simulate movement
      intervalRef.current = setInterval(() => {
        if (driverMarkerRef.current) {
          const currentPos = driverMarkerRef.current.getPosition();
          const newLat = currentPos.lat() + (Math.random() - 0.5) * 0.01;
          const newLng = currentPos.lng() + (Math.random() - 0.5) * 0.01;
          const newLatLng = new window.google.maps.LatLng(newLat, newLng);
          driverMarkerRef.current.setPosition(newLatLng);
          // Optional: keep map centered
          // mapRef.current.panTo(newLatLng);
        }
      }, 3000);
    }

    // Cleanup
    return () => {
      clearInterval(intervalRef.current);
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

export default DriverMap;