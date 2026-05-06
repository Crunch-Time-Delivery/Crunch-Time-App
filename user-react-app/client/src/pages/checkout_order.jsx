import React, { useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';
const CheckoutOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderPin, setOrderPin] = useState('');
  const [orderStatus, setOrderStatus] = useState('Loading...');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [orderHistory, setOrderHistory] = useState([]);
  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const overlayRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverTrackingIntervalRef = useRef(null);

 
function DriverMap({ driverId }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const driverMarkerRef = useRef(null);
  const overlayRef = useRef(null);
  const trackingIntervalRef = useRef(null);

  // Initialize map and overlay on mount
  useEffect(() => {
    if (!mapRef.current || typeof window.google === 'undefined') return;

    // Initialize map
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: -33.9249, lng: 18.4241 },
    });

    // Create custom overlay for driver label
    class DriverLabelOverlay extends window.google.maps.OverlayView {
      constructor() {
        super();
        this.div = null;
      }
      onAdd() {
        this.div = document.createElement('div');
        this.div.id = 'driverLabelOverlay';
        this.div.innerText = 'Driver';
        Object.assign(this.div.style, {
          display: 'none',
          position: 'absolute',
          padding: '4px 8px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#000',
          pointerEvents: 'none',
        });
        this.getPanes().floatPane.appendChild(this.div);
      }
      draw() {
        if (!this.getProjection() || !driverMarkerRef.current) return;
        const position = driverMarkerRef.current.getPosition();
        const pixel = this.getProjection().fromLatLngToContainerPixel(position);
        this.div.style.left = `${pixel.x}px`;
        this.div.style.top = `${pixel.y}px`;
        this.div.style.display = 'block';
      }
      onRemove() {
        if (this.div) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }
    }

    overlayRef.current = new DriverLabelOverlay();
    overlayRef.current.setMap(mapInstance.current);

    // Cleanup on unmount
    return () => {
      if (overlayRef.current) overlayRef.current.setMap(null);
    };
  }, []);

  // Function to move overlay
  const moveDriverLabel = () => {
    if (overlayRef.current && typeof overlayRef.current.draw === 'function') {
      overlayRef.current.draw();
    }
  };

function getPositionErrorMessage(code) {
  // Your existing function to get error messages based on code
  switch (code) {
    case 1:
      return 'Permission denied.';
    case 2:
      return 'Position unavailable.';
    case 3:
      return 'Timeout expired.';
    default:
      return 'An unknown error occurred.';
  }
}

const MapComponent = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);

  const createMap = (center) => {
    // Replace with your map creation logic, e.g., Google Maps API
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
    });
    return map;
  };

  const createMarker = ({ map, position }) => {
    const marker = new window.google.maps.Marker({
      position,
      map,
    });
    return marker;
  };

  const trackLocation = ({ onSuccess, onError = () => {} }) => {
    if (!('geolocation' in navigator)) {
      onError(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    // Use watchPosition and store the watch ID for cleanup
    const id = navigator.geolocation.watchPosition(onSuccess, onError);
    watchIdRef.current = id;
    return id;
  };

  useEffect(() => {
    const initialPosition = { lat: 59.325, lng: 18.069 };
    const map = createMap(initialPosition);
    const marker = createMarker({ map, position: initialPosition });
    mapRef.current = map;
    markerRef.current = marker;

    // Start tracking location
    trackLocation({
      onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
        if (markerRef.current && mapRef.current) {
          const newPosition = { lat, lng };
          markerRef.current.setPosition(newPosition);
          mapRef.current.panTo(newPosition);
        }
      },
      onError: (err) => {
        alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`);
      },
    });

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

  // Function to create or move driver marker
  const updateDriverMarker = (position) => {
    if (!driverMarkerRef.current) {
      driverMarkerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstance.current,
        title: 'Driver Location',
        icon: {
          url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    } else {
      animateMarkerTo(driverMarkerRef.current, position);
    }
    moveDriverLabel();
  };

  // Animate marker movement smoothly
  const animateMarkerTo = (marker, newPosition) => {
    const duration = 1000; // ms
    const start = marker.getPosition();
    const startTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const lat = start.lat() + (newPosition.lat - start.lat()) * t;
      const lng = start.lng() + (newPosition.lng - start.lng()) * t;
      marker.setPosition(new window.google.maps.LatLng(lat, lng));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  // Fetch driver location and start periodic updates
  const fetchAndUpdateDriverLocation = () => {
    // Replace this with your actual API call
    const baseLat = -33.9249;
    const baseLng = 18.4241;
    const newLoc = {
      lat: baseLat + (Math.random() - 0.5) * 0.02,
      lng: baseLng + (Math.random() - 0.5) * 0.02,
    };
    updateDriverMarker(newLoc);
  };

  const startTrackingDriver = () => {
    if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    fetchAndUpdateDriverLocation(); // initial fetch
    trackingIntervalRef.current = setInterval(fetchAndUpdateDriverLocation, 5000);
  };

  const stopTrackingDriver = () => {
    if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
  };

  // Start tracking when driverId changes
  useEffect(() => {
    if (driverId) {
      startTrackingDriver();
    }
    return () => stopTrackingDriver();
  }, [driverId]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopTrackingDriver();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
  const generatePIN = () => Math.floor(100000 + Math.random() * 900000).toString();

  const hidePinMessage = () => {
    document.getElementById('topPinMessage').style.display = 'none';
  };

  // NotificationContainer component to display notifications
function NotificationContainer() {
  const [notifications, setNotifications] = useState([]);
  const containerRef = useRef();

  // Function to add a new notification
  const addNotification = (text, color = '#333', duration = 4000) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, text, color, duration }]);
  };

  // Function to remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Expose addNotification globally or via context as needed
  // For simplicity, attach to window (not recommended for production)
  useEffect(() => {
    window.showNotificationMessage = addNotification;
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        zIndex: 9999,
        gap: '10px'
      }}
    >
      {notifications.map(({ id, text, color, duration }) => (
        <NotificationBox
          key={id}
          id={id}
          text={text}
          color={color}
          duration={duration}
          onClose={() => removeNotification(id)}
        />
      ))}
    </div>
  );
}

function NotificationBox({ id, text, color, duration, onClose }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setOpacity(1));
    // Auto dismiss
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => onClose(), 300); // fade out duration
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        opacity: opacity,
        transform: 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      {text}
    </div>
  );
}
  // Callbacks for buttons
  const goBack = () => window.history.back();
  const callDriver = () => alert('Calling driver...');
  const chatDriver = () => alert('Chat with driver...');

  // Render JSX
  return (
    <div className="app">
      {/* Top PIN message */}
      <div id="topPinMessage" style={{ display: 'none', position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', background: '#fff3cd', border: '1px solid #ffeeba', padding: '15px', borderRadius: '10px', maxWidth: '600px', width: '90%', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 9999 }}>
        <h3>Order PIN: <span id="orderPin">{orderPin}</span></h3>
        <button onClick={hidePinMessage} style={{ position: 'absolute', top: '5px', right: '10px', background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer' }}>
          <i className="fa fa-times"></i>
        </button>
      </div>

      {/* Main content */}
      <div className="header" style={{ padding: '14px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', background: 'white' }}>
        <i className="fa fa-arrow-left" style={{ fontSize: 18, cursor: 'pointer' }} onClick={goBack}></i>
        <h2 style={{ margin: 'auto', fontSize: 'clamp(16px, 2.5vw, 20px)' }}>KFC</h2>
      </div>

      <div className="status" style={{ textAlign: 'center', padding: 10, fontSize: 'clamp(12px, 2.5vw, 14px)', background: '#fff', fontWeight: 'bold' }}>
        The courier is on their way to you
      </div>

      {/* Map */}
      <div id="map" style={{ height: '50vh', width: '100%', position: 'relative' }}></div>

      {/* Driver Panel */}
      <div style={{ background: 'white', borderRadius: '25px 25px 0 0', padding: 14, boxShadow: '0 -5px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: '12vw', height: '12vw', maxWidth: 60, maxHeight: 60, minWidth: 45, minHeight: 45, borderRadius: '50%', background: '#ff3d3d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'clamp(18px, 4vw, 28px)' }}>
            <i className="fa-solid fa-motorcycle"></i>
          </div>
          <div>
            <strong id="loadDriverName">Your Driver</strong>
            <br />
            <small>On the way</small>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <div className="action-btn" style={{ width: '10vw', height: '10vw', maxWidth: 42, maxHeight: 42, minWidth: 34, minHeight: 34, background: '#ff3d3d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={callDriver}>
              <i className="fa fa-phone"></i>
            </div>
            <div className="action-btn" style={{ width: '10vw', height: '10vw', maxWidth: 42, maxHeight: 42, minWidth: 34, minHeight: 34, background: '#ff3d3d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={chatDriver}>
              <i className="fa fa-comment"></i>
            </div>
          </div>
        </div>
        {/* Order info */}
        <div id="orderInfoSection" style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div id="driverPlateNo" style={{ background: 'red', color: '#fff', padding: '4px 10px', borderRadius: 8, fontSize: 'clamp(11px, 2.5vw, 13px)' }}>CAA5567</div>
            <div className="rating" style={{ background: '#ffe600', padding: '4px 10px', borderRadius: 8, fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: 'bold' }}>4.8 ⭐</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div id="deliveryTime" style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 'bold' }}>12:56</div>
            <small>Estimated time to delivery</small>
          </div>
        </div>

        {/* Order History */}
        <div style={{ marginTop: 10, background: '#fff', padding: 10, borderRadius: 8 }}>
          <h4>Order History</h4>
          {/* Dummy data; replace with actual */}
          {orderHistory.map((entry, idx) => (
            <div key={idx}>{entry.action} at {new Date(entry.created_at).toLocaleString()}</div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, borderTop: '1px solid #ddd', paddingTop: 10 }}>
          <div style={{ fontWeight: 'bold', fontSize: 'clamp(13px, 3vw, 15px)', color: '#444', cursor: 'pointer' }} onClick={() => showTab('progress')} className={activeTab === 'progress' ? 'active' : ''}>Order Progress</div>
          <div style={{ fontWeight: 'bold', fontSize: 'clamp(13px, 3vw, 15px)', color: '#444', cursor: 'pointer' }} onClick={() => showTab('info')} className={activeTab === 'info' ? 'active' : ''}>Order Info</div>
        </div>

        {/* Panels */}
        {activeTab === 'progress' && (
          <div className="panel active" style={{ marginTop: 10, fontSize: 'clamp(12px, 3vw, 14px)' }}>
            <p>✔ Order confirmed</p>
            <p>✔ Restaurant preparing food</p>
            <p>🚴 Driver on the way</p>
          </div>
        )}
        {activeTab === 'info' && (
          <div className="panel active" style={{ marginTop: 10, fontSize: 'clamp(12px, 3vw, 14px)' }}>
            <p><strong>Order:</strong> #CAA5567 </p>
            <p><strong>Restaurant:</strong> KFC Parow </p>
            <p><strong>Status:</strong> Out for delivery </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutOrder;