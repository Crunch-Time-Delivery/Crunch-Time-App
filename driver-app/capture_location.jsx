// capture_location.jsx

import React, { useState, useEffect } from 'react';

function CaptureLocation() {
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

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
                // Save to localStorage or send to backend
                localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude, address: data.display_name }));
              }
            })
            .catch((err) => {
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

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Capture Your Location</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {coordinates && (
        <div>
          <p><strong>Latitude:</strong> {coordinates.latitude}</p>
          <p><strong>Longitude:</strong> {coordinates.longitude}</p>
          <p><strong>Address:</strong> {address || 'Loading address...'}</p>
        </div>
      )}
      {!coordinates && !error && <p>Getting your location...</p>}
      {coordinates && (
        <button
          style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: 'green', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          onClick={() => {
            // Redirect to index.html or admin page
            window.location.href = 'index.html'; // or admin/admin_dashboard.html
          }}
        >
          Proceed
        </button>
        
      )}
      // Inside your CaptureLocation component
<button
  style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: 'blue', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
  onClick={() => window.location.href = '../user-app/search_location.html'}
>
  Go to Search Location
</button>
    </div>
    
  );

}

export default CaptureLocation;