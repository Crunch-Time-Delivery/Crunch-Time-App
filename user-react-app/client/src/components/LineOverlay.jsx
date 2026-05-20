import React, { memo } from 'react';
import { Source, Layer } from 'react-map-gl';

const layerStyle = {
  id: 'linesLayer',
  type: 'line',
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': 'purple',
    'line-width': 5,
  },
};

const LineOverlay = ({ messages }) => {
  if (!messages || messages.length === 0) return null;

  const coordinates = messages
    .filter(({ position }) => Array.isArray(position) && position.length >= 2)
    .map(({ position }) => [position[0], position[1]]);

  if (coordinates.length < 2) return null; // Need at least two points to draw a line

  const geojsonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
        properties: {}, // You can add properties here if needed
      },
    ],
  };

  return (
    <Source id="my-data" type="geojson" data={geojsonData}>
      <Layer {...layerStyle} />
    </Source>
  );
};

export default memo(LineOverlay);