import React, { useEffect, useRef, useState } from 'react';

function DeliveryLocationMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const socketRef = useRef(null);

  const [userId, setUserId] = useState('');
  const [connectionUrl, setConnectionUrl] = useState('');
  const [coordinates, setCoordinates] = useState('No location selected.');

  const DEFAULT_POS = { lat: -33.9249, lng: 18.4241 };

  // Initialize map
  useEffect(() => {
    if (window.google) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: DEFAULT_POS,
        zoom: 13,
      });
      markerRef.current = new window.google.maps.Marker({
        map: mapInstance.current,
        position: DEFAULT_POS,
        draggable: true,
      });
      geocoderRef.current = new window.google.maps.Geocoder();

      loadSavedLocation();

      // Event handlers
      document.getElementById('locationForm').addEventListener('submit', handleGeocode);
      document.getElementById('locateBtn').addEventListener('click', handleUseMyLocation);
      document.getElementById('resetBtn').addEventListener('click', handleReset);
    }
    // Cleanup
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const loadSavedLocation = () => {
    const savedCoords = localStorage.getItem('deliveryCoords');
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedCoords && savedAddress) {
      const pos = JSON.parse(savedCoords);
      updateMap(pos, savedAddress);
    }
  };

function MapComponent() {
  const mapRef = useRef(null);        // Ref to the map instance
  const markerRef = useRef(null);     // Ref to the marker instance
  const coordsRef = useRef(null);     // Ref to the coordinates display element
  const addressRef = useRef(null);    // Ref to the address input element

  // Call this method with new position and address
  const updateMap = (pos, address) => {
    if (!mapRef.current || !markerRef.current) return;

    // Center the map
    mapRef.current.setCenter(pos);
    // Set zoom level
    mapRef.current.setZoom(15);
    // Move marker
    markerRef.current.setPosition(pos);

    // Update coordinates display
    if (coordsRef.current) {
      coordsRef.current.innerText = `Lat: ${pos.lat.toFixed(5)}, Lng: ${pos.lng.toFixed(5)}`;
    }

    // Update address input
    if (address && addressRef.current) {
      addressRef.current.value = address;
    }
  };

  return (
    <div>
      {/* Map container */}
      <div id="map" style={{ width: '100%', height: '400px' }} />

      {/* Coordinates display */}
      <div id="coordinates" ref={coordsRef}>Lat: 0, Lng: 0</div>

      {/* Address input */}
      <input type="text" id="locationInput" ref={addressRef} />

      {/* Example usage: */}
      {/* <button onClick={() => updateMap({ lat: 37.7749, lng: -122.4194 }, 'San Francisco')}>Update Map</button> */}
    </div>
  );
}

  const handleGeocode = (e) => {
    e.preventDefault();
    const address = document.getElementById('locationInput').value.trim();
    if (!address) {
      alert('Please enter an address.');
      return;
    }
    geocoderRef.current.geocode({ address }, (results, status) => {
      if (status !== 'OK' || !results[0]) {
        alert('Location not found.');
        return;
      }
      const loc = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      const newUserId = generateUserId();
      saveLocation(loc, results[0].formatted_address);
      updateMap(loc, results[0].formatted_address);
      setUserId(newUserId);
      const liveUrl = `https://yourdomain.com/connection/${newUserId}`;
      setConnectionUrl(liveUrl);
      startLiveTracking(newUserId);
      alert('Location set and saved!');
    });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        geocoderRef.current.geocode({ location: coords }, (results, status) => {
          if (status !== 'OK' || !results[0]) {
            alert('Unable to get address');
            return;
          }
          const address = results[0].formatted_address;
          const newUserId = generateUserId();
          saveLocation(coords, address);
          updateMap(coords, address);
          setUserId(newUserId);
          const liveUrl = `https://yourdomain.com/connection/${newUserId}`;
          setConnectionUrl(liveUrl);
          startLiveTracking(newUserId);
        });
      },
      () => alert('Unable to retrieve location')
    );
  };

  const handleReset = () => {
    localStorage.removeItem('deliveryCoords');
    localStorage.removeItem('deliveryAddress');
    updateMap(DEFAULT_POS, '');
    document.getElementById('locationInput').value = '';
    setCoordinates('No location selected.');
    setUserId('');
    setConnectionUrl('');
    stopLiveTracking();
  };

  const generateUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  };

  const saveLocation = (pos, address) => {
    localStorage.setItem('deliveryCoords', JSON.stringify(pos));
    localStorage.setItem('deliveryAddress', address);
  };

  const startLiveTracking = (userId) => {
    const socketUrl = `wss://yourdomain.com/live-tracking/${userId}`;
    if (socketRef.current) socketRef.current.close();

    socketRef.current = new WebSocket(socketUrl);
    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.lat && data.lng) {
        const newPos = { lat: data.lat, lng: data.lng };
        if (markerRef.current && mapInstance.current) {
          markerRef.current.setPosition(newPos);
          mapInstance.current.setCenter(newPos);
        }
      }
    };
    socketRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };
  };

  const stopLiveTracking = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  return (
    <div className="search-location-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="title-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', flex: 1 }}>Search Delivery Location</h1>
        <div
          className="red-column"
          style={{ width: '20px', height: '20px', backgroundColor: 'red', marginLeft: '10px', borderRadius: '3px' }}
        ></div>
      </div>

      <form id="locationForm" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          id="locationInput"
          placeholder="Enter address or city"
          required
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <input type="hidden" id="user_id_location" />
        <button type="submit" id="setLocationBtn" style={{ padding: '8px 16px', fontSize: '16px' }}>
          Set Location
        </button>
      </form>

      <div className="buttons-group" style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
        <button type="button" id="locateBtn" style={{ padding: '8px 16px', fontSize: '16px' }} onClick={handleUseMyLocation}>
          Use My Location
        </button>
        <button type="button" id="resetBtn" style={{ padding: '8px 16px', fontSize: '16px' }} onClick={handleReset}>
          Reset Map
        </button>
      </div>

      {/* Map container */}
      <div id="map" ref={mapRef} style={{ height: '400px', width: '100%', marginTop: '20px' }}></div>
      <div id="coordinates" style={{ marginTop: '10px', textAlign: 'center' }}>
        {coordinates}
      </div>

      {/* Live connection URL display */}
      <div id="connectionLinkContainer" style={{ marginTop: '15px' }}>
        <strong>Live Connection URL:</strong>
        <div id="connectionLink" style={{ wordBreak: 'break-all' }}>
          {connectionUrl}
        </div>
      </div>
    </div>
  );
}

export default DeliveryLocationMap;