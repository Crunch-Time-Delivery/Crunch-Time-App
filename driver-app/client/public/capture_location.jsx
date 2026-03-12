import React, { useState, useEffect } from 'react';

function CaptureLocation({ onLocationChange }) {
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [tracking, setTracking] = useState(false);

  // Fetch current location and reverse geocode once on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          // Reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                setAddress(data.display_name);
                // Save to localStorage
                localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude, address: data.display_name }));
              }
            })
            .catch(() => {
              setError('Failed to get address.');
            });
        },
        (err) => {
          setError('Geolocation permission denied.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Watch position for real-time tracking
  useEffect(() => {
    if (tracking && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          // Optionally, update address as well
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                setAddress(data.display_name);
              }
            });
          // Send location to parent if callback exists
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }
        },
        (err) => {
          console.error('Error watching position:', err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [tracking, onLocationChange]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Capture Your Location</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {coordinates ? (
        <div>
          <p><strong>Latitude:</strong> {coordinates.latitude}</p>
          <p><strong>Longitude:</strong> {coordinates.longitude}</p>
          <p><strong>Address:</strong> {address || 'Loading address...'}</p>
        </div>
      ) : (
        !error && <p>Getting your location...</p>
      )}

      {/* Button to start/stop real-time tracking */}
      <button
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: tracking ? 'orange' : 'blue',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => setTracking(!tracking)}
      >
        {tracking ? 'Stop Tracking' : 'Start Tracking'}
      </button>

      {/* Proceed Button */}
      <button
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: 'green',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
        onClick={() => {
          // Redirect to index or admin dashboard
          window.location.href = 'index.html'; // or admin/admin_dashboard.html
        }}
      >
        Proceed
      </button>

      {/* Go to Search Location */}
      <button
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: 'blue',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
        onClick={() => window.location.href = '../user-app/search_location.html'}
      >
        Go to Search Location
      </button>
    </div>
  );
}

export default CaptureLocation;