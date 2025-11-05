import React, { useState } from 'react';
import CaptureLocation from './capture_location.jsx';

function App() {
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [error, setError] = useState(null);

  const handleLocationChange = (lat, lng) => {
    setUserLat(lat);
    setUserLng(lng);
    setError(null);
  };

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationChange(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div style={{ height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      <h1>Location Tracker</h1>
      
      {/* Button to request location */}
      <button onClick={requestUserLocation} style={{ marginBottom: '20px' }}>
        Get My Current Location
      </button>
      
      {/* Display error if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Show location data if available */}
      {userLat && userLng ? (
        <div>
        <h2>Your Location:</h2>
          <p>Latitude: {userLat}</p>
          <p>Longitude: {userLng}</p>
        </div>
      ) : (
        <p>Location not yet determined.</p>
      )}
      
    {/* CaptureLocation component */}
      <CaptureLocation onLocationChange={handleLocationChange} />

      {/* Placeholder for map or other components */}
      <div style={{ marginTop: '30px', height: '400px', border: '1px solid #ccc' }}>
        {/* You can replace this with an actual map component */}
        <p style={{ textAlign: 'center', lineHeight: '400px' }}>Map Placeholder</p>
      </div>
    </div>
  );
}

export default App;