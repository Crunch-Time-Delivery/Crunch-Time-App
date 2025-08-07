import React, { useEffect, useRef, useState } from 'react';

// Assuming your geolocation code is exported from this file
import GeolocationMap from './geolocation.java'; // Adjust if it's a React component or class

function GeolocationPage() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize map and get user location
  useEffect(() => {
    // Use navigator.geolocation to get current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPos([latitude, longitude]);
          initMap(latitude, longitude);
        },
        () => alert('Geolocation failed or is not supported.')
      );
    }
  }, []);

  const initMap = (lat, lng) => {
    // Initialize your map from geolocation.java logic
    // For demo, using Leaflet directly here
    const leafletMap = L.map('map').setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(leafletMap);

    const marker = L.marker([lat, lng]).addTo(leafletMap);
    markerRef.current = marker;
    mapRef.current = leafletMap;
    setMap(leafletMap);
  };

  const handleRecenter = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          mapRef.current.setView([latitude, longitude], 14);
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          }
        },
        () => alert('Unable to recenter your location.')
      );
    }
  };

  const handleConfirmLocation = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      alert(`Location confirmed: ${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}`);
      // You can send this data to backend or store as needed
    }
  };

  const handleSearch = () => {
    // Optional: implement geocoding to convert searchTerm into lat/lng
    alert(`Searching for: ${searchTerm}`);
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Enter your location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {/* Map geolocation*/}
      <div id="map"></div>

      {/* Re-center Button (Arrow Icon) */}
      <button id="recenter-btn" title="Re-center to current location" onClick={handleRecenter}>
        &#8594; {/* Right arrow, replace with icon if needed */}
      </button>

      {/* Bottom Confirm Button */}
      <div className="bottom-center">
        <button className="confirm-btn" onClick={handleConfirmLocation}>Confirm Location</button>
      </div>
    </div>
  );
}

export default GeolocationPage;