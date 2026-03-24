import React, { useState, useEffect, useRef } from 'react';

// Make sure to install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // Use env variable
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CheckoutOrder() {
  const [orderPin, setOrderPin] = useState('');
  const [orderStatus, setOrderStatus] = useState('The courier is on their way to you');
  const [deliveryTime, setDeliveryTime] = useState('12:56');
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('progress');
  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverOverlayRef = useRef(null);
  const trackingIntervalRef = useRef(null);

  // Generate PIN
  function generatePIN() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Show/hide top pin message
  const [showPinMessage, setShowPinMessage] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const showPin = () => {
    const pin = generatePIN();
    setPinCode(pin);
    setShowPinMessage(true);
  };
  const hidePin = () => setShowPinMessage(false);

  // Notification message
  const notificationRef = useRef(null);
  const showNotification = (text, color = '#333') => {
    if (!notificationRef.current) {
      notificationRef.current = document.createElement('div');
      Object.assign(notificationRef.current.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 20px',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '14px',
        zIndex: 9999,
        transition: 'opacity 0.3s ease',
        opacity: 1,
      });
      document.body.appendChild(notificationRef.current);
    }
    notificationRef.current.style.backgroundColor = color;
    notificationRef.current.innerText = text;
    notificationRef.current.style.opacity = '1';

    if (notificationRef.current.timeoutId) {
      clearTimeout(notificationRef.current.timeoutId);
    }
    notificationRef.current.timeoutId = setTimeout(() => {
      if (notificationRef.current) {
        notificationRef.current.style.opacity = '0';
        setTimeout(() => {
          if (notificationRef.current) {
            document.body.removeChild(notificationRef.current);
            notificationRef.current = null;
          }
        }, 300);
      }
    }, 4000);
  };

  // Send notification via Twilio
  const sendTwilioNotification = async (phoneNumber, message, callback = null) => {
    if (!phoneNumber || !message) {
      showNotification('Phone number or message missing', '#f44336');
      return;
    }
    showNotification('Sending notification...', '#2196F3');
    try {
      const res = await fetch('/send-twilio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, message }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Notification sent successfully!', '#4CAF50');
        if (callback) callback(true, data);
      } else {
        showNotification('Failed to send notification.', '#f44336');
        if (callback) callback(false, data);
      }
    } catch (err) {
      showNotification('Error sending notification.', '#f44336');
      if (callback) callback(false);
    }
  };

  // Initialize map
  useEffect(() => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: { lat: -33.9249, lng: 18.4241 },
    });
    mapRef.current = map;

    // Create driver label overlay
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'driverLabelOverlay';
    overlayDiv.innerText = 'Driver';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.background = 'rgba(255,255,255,0.8)';
    overlayDiv.style.padding = '4px 8px';
    overlayDiv.style.borderRadius = '4px';
    overlayDiv.style.fontWeight = 'bold';
    overlayDiv.style.fontSize = '14px';
    overlayDiv.style.color = '#000';
    overlayDiv.style.border = '1px solid #ccc';
    overlayDiv.style.whiteSpace = 'nowrap';
    overlayDiv.style.transform = 'translate(-50%, -100%)';
    overlayDiv.style.display = 'none';
    document.getElementById('map').appendChild(overlayDiv);
    driverOverlayRef.current = overlayDiv;
  }, []);

  // Function to move driver label overlay
  const moveDriverLabel = (position) => {
    if (!driverOverlayRef.current || !mapRef.current) return;
    const map = mapRef.current;
    const overlayDiv = driverOverlayRef.current;
    const latLng = new window.google.maps.LatLng(position.lat, position.lng);
    const projection = map.getProjection();
    if (!projection) return;
    const scale = Math.pow(2, map.getZoom());
    const point = projection.fromLatLngToPoint(latLng);
    const pixelX = point.x * scale;
    const pixelY = point.y * scale;
    const mapDiv = document.getElementById('map');
    const rect = mapDiv.getBoundingClientRect();
    overlayDiv.style.left = `${pixelX - rect.left}px`;
    overlayDiv.style.top = `${pixelY - rect.top}px`;
    overlayDiv.style.display = 'block';
  };

  // Fetch driver location periodically
  const fetchAndUpdateDriverLocation = (driverId) => {
    fetch(`/api/driver-location?driverId=${driverId}`)
      .then(res => res.json())
      .then(data => {
        if (data.lat && data.lng) {
          const pos = { lat: data.lat, lng: data.lng };
          const map = mapRef.current;
          if (!driverMarkerRef.current) {
            driverMarkerRef.current = new window.google.maps.Marker({
              position: pos,
              map,
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
          map.setCenter(pos);
        }
      })
      .catch(err => console.error('Error fetching driver location:', err));
  };

  // Handle driver tracking
  const driverIdRef = useRef(null);
  const startTrackingDriver = (driverId) => {
    driverIdRef.current = driverId;
    fetchAndUpdateDriverLocation(driverId);
    trackingIntervalRef.current = setInterval(() => {
      fetchAndUpdateDriverLocation(driverId);
    }, 10000);
  };

  // Load order status and history
  const loadOrderData = async (orderId) => {
    // Fetch order status
    const { data: statusData, error: statusError } = await supabase
      .from('order_status')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (!statusError && statusData) {
      setOrderStatus(statusData.status || 'Status not available');
      if (statusData.estimated_time) {
        setDeliveryTime(statusData.estimated_time);
      }
    }

    // Fetch order history
    const { data: historyData, error: historyError } = await supabase
      .from('order_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    if (!historyError && historyData) {
      setOrderHistory(historyData);
    }
  };

  // On mount: initialize everything
  useEffect(() => {
    const orderId = 'ORDER-' + Date.now(); // Or get from props / URL
    const orderPIN = generatePIN();
    setOrderPin(orderPIN);
    showPin();

    // Example to get driverId from URL
    const params = new URLSearchParams(window.location.search);
    const driverId = params.get('driverId');

    // Initialize map
    if (window.google) {
      // Google Maps API is loaded
      initMap();
      if (driverId) {
        startTrackingDriver(driverId);
      }
    }

    // Load order data
    loadOrderData(orderId);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) clearInterval(trackingIntervalRef.current);
    };
  }, []);

  // UI Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const goBack = () => {
    window.history.back();
  };

  const callDriver = () => {
    alert('Calling driver...');
  };

  const chatDriver = () => {
    alert('Chat with driver...');
  };

  const checkout_order = (orderId, driverPhoneNumber) => {
    const message = `Order #${orderId} has been checked out. Please proceed accordingly.`;
    notifyDriver(driverPhoneNumber, message);
  };

  const notifyDriver = (phoneNumber, message) => {
    showNotification(`Notifying driver at ${phoneNumber}...`, '#2196F3');
    sendTwilioNotification(phoneNumber, message, (success) => {
      if (success) {
        showNotification('Driver notified successfully!', '#4CAF50');
      } else {
        showNotification('Failed to notify driver.', '#f44336');
      }
    });
  };

  // Render component
 return (
   <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>
     {/* Top Pin Message */}
     {showPinMessage && (
       <div
         style={{
           position: 'fixed',
           top: '10px',
           left: '50%',
           transform: 'translateX(-50%)',
           background: '#fff3cd',
           border: '1px solid #ffeeba',
           padding: '15px',
           borderRadius: '10px',
           maxWidth: '600px',
           width: '90%',
           cursor: 'default',
           boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
           zIndex: 9999,
         }}
       >
         <h3>Order PIN: <span>{pinCode}</span></h3>
         <button
           style={{
             position: 'absolute',
             top: '5px',
             right: '10px',
             background: 'none',
             border: 'none',
             fontSize: '1.2em',
             cursor: 'pointer',
           }}
           onClick={hidePin}
         >
           <i className="fa fa-times"></i>
         </button>
       </div>
     )}

     {/* Header */}
     <div className="header" style={{ padding: '14px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', background: 'white' }}>
       <i className="fa fa-arrow-left" style={{ cursor: 'pointer' }} onClick={goBack}></i>
       <h2 style={{ margin: 'auto', fontSize: 'clamp(16px, 2.5vw, 20px)' }} id="restaurantName">KFC</h2>
     </div>

     {/* Status */}
     <div className="status" style={{ textAlign: 'center', padding: '10px', fontSize: 'clamp(12px, 2.5vw, 14px)', background: '#fff', fontWeight: 'bold' }} id="orderStatus">
       {orderStatus}
     </div>

     {/* Map */}
     <div id="map" style={{ height: '50vh', width: '100%', position: 'relative' }}></div>

     {/* Driver Panel */}
     <div style={{ background: 'white', borderRadius: '25px 25px 0 0', padding: '14px', boxShadow: '0 -5px 20px rgba(0,0,0,0.1)' }}>
       {/* Driver Row */}
       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
         <div
           className="driver-avatar"
           style={{
             width: '12vw',
             height: '12vw',
             maxWidth: '60px',
             maxHeight: '60px',
             minWidth: '45px',
             minHeight: '45px',
             borderRadius: '50%',
             background: '#ff3d3d',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             color: 'white',
             fontSize: 'clamp(18px, 4vw, 28px)',
           }}
         >
           <i className="fa-solid fa-motorcycle"></i>
         </div>
         <div>
           <strong id="loadDriverName">Your Driver</strong>
           <br />
           <small>On the way</small>
         </div>
         {/* Actions */}
         <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
           <div
             className="action-btn"
             style={{
               width: '10vw',
               height: '10vw',
               maxWidth: '42px',
               maxHeight: '42px',
               minWidth: '34px',
               minHeight: '34px',
               background: '#ff3d3d',
               borderRadius: '50%',
               color: 'white',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: 'clamp(14px, 3vw, 18px)',
               cursor: 'pointer',
             }}
             onClick={callDriver}
           >
             <i className="fa fa-phone"></i>
           </div>
           <div
             className="action-btn"
             style={{
               width: '10vw',
               height: '10vw',
               maxWidth: '42px',
               maxHeight: '42px',
               minWidth: '34px',
               minHeight: '34px',
               background: '#ff3d3d',
               borderRadius: '50%',
               color: 'white',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: 'clamp(14px, 3vw, 18px)',
               cursor: 'pointer',
             }}
             onClick={chatDriver}
           >
             <i className="fa fa-comment"></i>
           </div>
         </div>
       </div>

       {/* Order info */}
       <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} id="orderInfoSection">
         <div>
           <div className="badge" style={{ background: 'red', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: 'clamp(11px, 2.5vw, 13px)' }} id="driverPlateNo">
             CAA5567
           </div>
           <div className="rating" style={{ background: '#ffe600', padding: '4px 10px', borderRadius: '8px', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: 'bold' }}>
             4.8 ⭐
           </div>
         </div>
         <div style={{ textAlign: 'right' }}>
           <div className="time" style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 'bold' }} id="deliveryTime">
             {deliveryTime}
           </div>
           <small>Estimated time to delivery</small>
         </div>
       </div>

       {/* Order History */}
       <div
         style={{
           marginTop: '10px',
           background: '#fff',
           padding: '10px',
           borderRadius: '8px',
         }}
         id="orderHistoryContainer"
       >
         <h4>Order History</h4>
         {orderHistory.map((item, index) => (
           <div key={index}>{`${item.action} at ${new Date(item.created_at).toLocaleString()}`}</div>
         ))}
       </div>

       {/* Tabs */}
       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
         <div
           style={{
             fontWeight: 'bold',
             fontSize: 'clamp(13px, 3vw, 15px)',
             color: activeTab === 'progress' ? 'red' : '#444',
             cursor: 'pointer',
           }}
           onClick={() => handleTabChange('progress')}
         >
           Order Progress
         </div>
         <div
           style={{
             fontWeight: 'bold',
             fontSize: 'clamp(13px, 3vw, 15px)',
             color: activeTab === 'info' ? 'red' : '#444',
             cursor: 'pointer',
           }}
           onClick={() => handleTabChange('info')}
         >
           Order Info
         </div>
       </div>

       {/* Panels */}
       {activeTab === 'progress' && (
         <div className="panel" style={{ display: 'block', marginTop: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
           <p>✔ Order confirmed</p>
           <p>✔ Restaurant preparing food</p>
           <p>🚴 Driver on the way</p>
         </div>
       )}
       {activeTab === 'info' && (
         <div className="panel" style={{ display: 'block', marginTop: '10px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
           <p><strong>Order:</strong> #CAA5567 </p>
           <p><strong>Restaurant:</strong> KFC Parow </p>
           <p><strong>Status:</strong> Out for delivery </p>
         </div>
       )}
     </div>
   </div>
 );
}