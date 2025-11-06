import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import CSS file
import 'https://unpkg.com/leaflet/dist/leaflet.css'; // Import Leaflet CSS
import QRCode from 'qrcodejs2'; // Import QRCode library
import sha256 from 'js-sha256'; // Import SHA-256 library
import App from './app.jsx';
import App from './UserMap.jsx';
import App from './OrderSummary.jsx';
import App from './Connection.jsx';
import App from './LiveTrackingControls.jsx';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>User Home Dashboard</title>
      <body style={{ fontFamily: 'Arial, sans-serif', margin: 0 }}>
        {/* Your application content here */}
      </body>
      <script
        src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"
        type="text/javascript"
        defer
      />
      <script
        src="https://cdn.jsdelivr.net/npm/js-sha256/dist/sha256.min.js"
        type="text/javascript"
        defer
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
root.render(<App />);