import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

function GeolocationPage() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          initMap(latitude, longitude);
        },
        () => alert('Geolocation failed or is not supported.')
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  const initMap = (lat, lng) => {
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
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Search bar */}
      <div className="search-container">
        <input
          className="search-input"
          placeholder="Enter your location"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={() => alert(`Searching for: ${searchTerm}`)}>
          Search
        </button>
      </div>
      {/* Map */}
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
      {/* Recenter Button */}
      <button id="recenter-btn" onClick={handleRecenter} title="Re-center to your location">
        &#8594;
      </button>
      {/* Confirm Button */}
      <div className="bottom-center">
        <button className="confirm-btn" onClick={handleConfirmLocation}>
          Confirm Location
        </button>
      </div>
    </div>
  );
}

// Render
ReactDOM.render(<GeolocationPage />, document.getElementById('root'));