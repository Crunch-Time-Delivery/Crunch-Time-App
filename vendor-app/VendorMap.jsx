import React, { useEffect, useRef } from 'react';

function VendorMap({ vendorLat, vendorLng, onLocationChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const vendorMarkerRef = useRef(null);

  useEffect(() => {
    if (
      typeof vendorLat === 'number' &&
      typeof vendorLng === 'number' &&
      !mapRef.current &&
      window.google
    ) {
      // Initialize Map
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: vendorLat, lng: vendorLng },
        zoom: 14,
      });

      // Add vendor marker
      vendorMarkerRef.current = new window.google.maps.Marker({
        position: { lat: vendorLat, lng: vendorLng },
        map: mapRef.current,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new window.google.maps.Size(40, 40),
        },
        title: 'Vendor Location',
      });
    }
  }, [vendorLat, vendorLng]);

  useEffect(() => {
    if (
      typeof vendorLat === 'number' &&
      typeof vendorLng === 'number' &&
      mapRef.current &&
      vendorMarkerRef.current
    ) {
      // Update marker position
      vendorMarkerRef.current.setPosition({ lat: vendorLat, lng: vendorLng });
      // Optional: center map
      // mapRef.current.panTo({ lat: vendorLat, lng: vendorLng });
      if (onLocationChange) {
        onLocationChange(vendorLat, vendorLng);
      }
    }
  }, [vendorLat, vendorLng, onLocationChange]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{ height: '100%', width: '100%' }}
      ></div>
    </div>
  );
}

export default VendorMap;