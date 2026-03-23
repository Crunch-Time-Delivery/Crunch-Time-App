// capture_location.jsx
import React, { useState, useEffect } from 'react';

function CaptureLocation() {
  // Initialize Supabase with your keys
  const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
  const supabaseKey =  process.env.SUPABASE_KEY; // Replace with your actual Supabase anon key
  const supabase = React.useMemo(() => supabase.createClient(supabaseUrl, supabaseKey), []);

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
          // Reverse geocode
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                setAddress(data.display_name);
              }
            });
          // Send location to parent if callback exists
          // (Optional: you can implement callback here)
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
  }, [tracking]);

  // Function to save current location to Supabase
  const saveLocationToSupabase = () => {
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      supabase
        .from('locations') // Make sure this table exists
        .insert([{ latitude, longitude }])
        .then(({ data, error }) => {
          if (error) {
            alert('Error saving to database: ' + error.message);
          } else {
            alert('Location saved to database!');
          }
        });
    } else {
      alert('No location data available to save.');
    }
  };

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

      {/* Save current location to Supabase */}
      <button
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: 'purple',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
        onClick={saveLocationToSupabase}
      >
        Save Location to Database
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
          window.location.href = 'index.html'; // or your desired page
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