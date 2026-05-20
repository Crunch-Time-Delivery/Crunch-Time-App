import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-map-gl/maplibre';
import Pin from './Pin.js';

const Markers = ({ messages }) => {
  const [popupInfo, setPopupInfo] = useState(null);

  if (!messages || messages.length === 0) return null;

  return (
    <>
      {popupInfo && (
        <Popup
          latitude={popupInfo.position[1]}
          longitude={popupInfo.position[0]}
          anchor="right"
          offset={[-20, -20]}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
        >
          <div>
            <p>
              <b>Time:</b> {popupInfo.sampleTime}
            </p>
            <p>
              <b>Lat:</b> {popupInfo.position[1]}
            </p>
            <p>
              <b>Lon:</b> {popupInfo.position[0]}
            </p>
          </div>
        </Popup>
      )}
      {messages.map(({ position, sampleTime }, index) => (
        <Marker
          key={`marker-${position[0]}-${position[1]}-${index}`}
          longitude={position[0]}
          latitude={position[1]}
          color="blue"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo({ position, sampleTime });
          }}
        >
          <Pin />
        </Marker>
      ))}
    </>
  );
};

Markers.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.arrayOf(PropTypes.number).isRequired,
      sampleTime: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Wrap with React.memo for performance optimization
export default memo(Markers);