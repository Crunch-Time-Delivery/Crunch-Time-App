import { useState, memo } from 'react';
import { Marker, Popup } from 'react-map-gl/maplibre';
import Pin from './Pin.js';

const Markers = ({ messages }) => {
  const [popupInfo, setPopupInfo] = useState(null);

  if (!messages || messages.length === 0) return null;

  const handleMarkerClick = (e, markerData) => {
    e.originalEvent.stopPropagation();
    setPopupInfo(markerData);
  };

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
              <strong>Time:</strong> {popupInfo.sampleTime}
            </p>
            <p>
              <strong>Lat:</strong> {popupInfo.position[1]}
            </p>
            <p>
              <strong>Lon:</strong> {popupInfo.position[0]}
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
          onClick={(e) => handleMarkerClick(e, { position, sampleTime })}
        >
          <Pin />
        </Marker>
      ))}
    </>
  );
};

export default memo(Markers);