import React from 'react';
import ReactDOM from 'react-dom/client';

import ReactDOM from 'react-dom/client'
import 'react';
import { createRoot } from 'react-dom/client';
import MapView, {
  FullscreenControl,
  NavigationControl,
} from 'react-map-gl/maplibre';
import { withIdentityPoolId } from '@aws/amazon-location-utilities-auth-helper';
import useWebsocket from '#hooks/useTracker.js';
import Markers from '#components/Markers.js';
import LineOverlay from '#components/LineOverlay.tsx';
import  { Message } from '#types';
import config from '#config';

import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css';

const authHelper = await withIdentityPoolId(config.identityPoolId);

const eventSchema = {
  type: 'object',
  properties: {
    deviceId: { type: 'string' },
    eventType: { type: 'string', enum: ['UPDATE'] },
    trackerName: { type: 'string' },
    receivedTime: { type: 'string' },
    sampleTime: { type: 'string' },
    position: {
      type: 'array',
      items: { type: 'number' },
      minItems: 2,
      maxItems: 2,
    },
  },
  required: [
    'deviceId',
    'eventType',
    'trackerName',
    'receivedTime',
    'sampleTime',
    'position',
  ],
  additionalProperties: false,
};

const App = () => {
  const messages = useWebsocket<Message>({
    eventSchema,
  });

  return (
    <MapView
      initialViewState={{
        longitude: -123.1169,
        latitude: 49.2824,
        zoom: 12,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle={`https://maps.geo.${config.region}.amazonaws.com/v2/styles/${config.mapStyleName}/descriptor`}
      transformRequest={
        authHelper.getMapAuthenticationOptions().transformRequest
      }
      maplibreLogo
    >
      <NavigationControl />
      <FullscreenControl />
      <Markers messages={messages} />
      <LineOverlay messages={messages} />
    </MapView>
  );
}
// In your main server file
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log error, notify support, then exit or restart
  process.exit(1); // or trigger a restart script
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Log error, notify support, then exit or restart
  process.exit(1);
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
