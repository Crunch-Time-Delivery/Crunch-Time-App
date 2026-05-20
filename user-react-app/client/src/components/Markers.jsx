import React, { useState, memo } from 'react';
import { Marker, Popup } from 'react-map-gl'; // Correct import
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
      {messages.map(({ position, sampleTime }, index) => {
        const longitude = position[0];
        const latitude = position[1];
        const key = `marker-${longitude}-${latitude}-${index}`;

        return (
          <Marker
            key={key}
            longitude={longitude}
            latitude={latitude}
            anchor="center" // optional: 'center' or 'bottom'
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo({ position, sampleTime });
            }}
          >
            <Pin />
          </Marker>
        );
      })}
    </>
  );
};

export default memo(Markers);