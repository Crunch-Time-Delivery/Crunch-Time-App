import React, { useState, useEffect, useRef } from 'react';

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

  // Initialize Google Map on mount
  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: -33.9249, lng: 18.4241 },
      });
      mapRef.current = map;

      // Create overlay for driver label
      const overlayDiv = document.createElement('div');
      overlayDiv.id = 'driverLabelOverlay';
      overlayDiv.innerText = 'Driver';
      overlayDiv.style.display = 'none';
      overlayDiv.style.position = 'absolute';
      overlayDiv.style.padding = '4px 8px';
      overlayDiv.style.background = 'rgba(255, 255, 255, 0.8)';
      overlayDiv.style.borderRadius = '4px';
      overlayDiv.style.border = '1px solid #ccc';
      overlayDiv.style.fontWeight = 'bold';
      overlayDiv.style.fontSize = '14px';
      overlayDiv.style.color = '#000';
      document.getElementById('map').appendChild(overlayDiv);
      overlayRef.current = overlayDiv;
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load script if not loaded
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q&callback=initMap`;
      window.initMap = initMap;
      document.head.appendChild(script);
    }
  }, []);

  // Generate order ID and PIN on mount
  useEffect(() => {
    const newOrderId = 'ORDER-' + Date.now();
    setOrderId(newOrderId);
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderPin(pin);
    // Show PIN message
    document.getElementById('topPinMessage').style.display = 'block';

    // Load order status and history
    loadOrderStatus(newOrderId);
    loadOrderHistory(newOrderId);

    // Get driverId from URL
    const params = new URLSearchParams(window.location.search);
    const driverId = params.get('driverId');
    if (driverId) {
      startTrackingDriver(driverId);
    }
  }, []);

  const loadOrderStatus = async (orderId) => {
    // Example: fetch from your database
    // Replace with actual API call if needed
    // For demo:
    setOrderStatus('The courier is on their way to you');
    setDeliveryTime('12:56');
  };

  const loadOrderHistory = async (orderId) => {
    // Example: fetch from your database
    // For demo:
    setOrderHistory([
      { action: 'Order confirmed', created_at: new Date().toISOString() },
    ]);
  };

  const startTrackingDriver = (driverId) => {
    fetchAndUpdateDriverLocation(driverId);
    driverTrackingIntervalRef.current = setInterval(() => {
      fetchAndUpdateDriverLocation(driverId);
    }, 10000);
  };

  const fetchAndUpdateDriverLocation = (driverId) => {
    fetch(`/api/driver-location?driverId=${driverId}`)
      .then(res => res.json())
      .then(data => {
        if (data.lat && data.lng && mapRef.current) {
          const pos = { lat: data.lat, lng: data.lng };
          if (!driverMarkerRef.current) {
            driverMarkerRef.current = new window.google.maps.Marker({
              position: pos,
              map: mapRef.current,
              icon: {
                url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              },
              title: 'Driver Location',
            });
          } else {
            driverMarkerRef.current.setPosition(pos);
          }
          moveDriverLabel(pos);
          mapRef.current.setCenter(pos);
        }
      })
      .catch(console.error);
  };

  const moveDriverLabel = (position) => {
    if (!overlayRef.current || !mapRef.current || !mapRef.current.getProjection) return;
    const latLng = new window.google.maps.LatLng(position.lat, position.lng);
    const projection = mapRef.current.getProjection();

    if (!projection) {
      setTimeout(() => moveDriverLabel(position), 100);
      return;
    }

    const scale = Math.pow(2, mapRef.current.getZoom());
    const point = projection.fromLatLngToPoint(latLng);
    const pixelX = point.x * scale;
    const pixelY = point.y * scale;

    const rect = document.getElementById('map').getBoundingClientRect();
    overlayRef.current.style.left = `${pixelX - rect.left + document.getElementById('map').offsetLeft}px`;
    overlayRef.current.style.top = `${pixelY - rect.top + document.getElementById('map').offsetTop}px`;
    overlayRef.current.style.display = 'block';
  };

  const generatePIN = () => Math.floor(100000 + Math.random() * 900000).toString();

  const hidePinMessage = () => {
    document.getElementById('topPinMessage').style.display = 'none';
  };

  // Utility: Notification
  const showNotification = (text, color = '#333') => {
    let box = document.getElementById('notificationMessage');
    if (!box) {
      box = document.createElement('div');
      box.id = 'notificationMessage';
      box.style.position = 'fixed';
      box.style.bottom = '20px';
      box.style.left = '50%';
      box.style.transform = 'translateX(-50%)';
      box.style.padding = '12px 20px';
      box.style.borderRadius = '8px';
      box.style.color = '#fff';
      box.style.fontSize = '14px';
      box.style.zIndex = '9999';
      box.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(box);
    }
    box.style.backgroundColor = color;
    box.innerText = text;
    box.style.opacity = '1';
    if (showNotification.timeoutId) clearTimeout(showNotification.timeoutId);
    showNotification.timeoutId = setTimeout(() => {
      box.style.opacity = '0';
      setTimeout(() => { if (box) box.remove(); }, 300);
    }, 4000);
  };

  // Example: Call notification
  const notifyDriver = (phoneNumber, message) => {
    showNotification(`Notifying driver at ${phoneNumber}...`, '#2196F3');
    fetch('/send-twilio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, message }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showNotification('Driver notified successfully!', '#4CAF50');
        } else {
          showNotification('Failed to notify driver.', '#f44336');
        }
      });
  };

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