import React from 'react';

function LiveTrackingControls({ onStart, onStop, onRefresh }) {
  return (
    <div style={{ margin: '10px 0' }}>
      <button onClick={onStart}>Start Tracking</button>
      <button onClick={onStop}>Stop Tracking</button>
      <button onClick={onRefresh}>Refresh Location</button>
    </div>
  );
}

export default LiveTrackingControls;