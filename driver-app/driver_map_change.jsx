import React, { useState } from 'react';
import CaptureLocation from './capture_location.jsx';

function App() {
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);

  const handleLocationChange = (lat, lng) => {
    setUserLat(lat);
    setUserLng(lng);
  };

  return (
    <div style={{ height: '100vh' }}>
      <CaptureLocation onLocationChange={handleLocationChange} />
      {/* You can pass userLat, userLng to your map component */}
    </div>
  );
}

export default App;