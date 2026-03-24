import React, { useState, useEffect, useRef } from 'react';

function DriverApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [content, setContent] = useState('main'); // 'main', 'history', 'order'
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const userMarker = useRef(null);
  const pickupMarker = useRef(null);
  const dropoffMarker = useRef(null);
  const driverMarker = useRef(null);
  const routePolyline = useRef(null);
  const destination = useRef(null);

  // Toggle menu
  const toggleMenu = () => setMenuOpen(prev => !prev);

  // Notifications
  const showNotification = (text, color = '#333') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, color }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Map initialization
  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const pickup = { lat: -33.9249, lng: 18.4241 };
    const dropoff = { lat: -33.9289, lng: 18.4174 };

    // Initialize map
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: pickup,
    });

    // Add markers
    pickupMarker.current = new window.google.maps.Marker({
      position: pickup,
      map: mapInstance.current,
      label: 'Pickup',
      title: 'Restaurant Pickup',
    });
    dropoffMarker.current = new window.google.maps.Marker({
      position: dropoff,
      map: mapInstance.current,
      label: 'Drop-off',
      title: 'Customer Drop-off',
    });

    // Set initial destination
    setDestination(dropoff);

    // Geolocation watcher
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (!userMarker.current) {
            userMarker.current = new window.google.maps.Marker({
              position: coords,
              map: mapInstance.current,
              title: 'You are here!',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              },
            });
          } else {
            userMarker.current.setPosition(coords);
          }
          mapInstance.current.setCenter(coords);
          // Save location in hidden input if needed
          // update driver location on server
          updateDriverLocation(coords);
        },
        () => {
          // Error handling
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
  }, []);

  const setDestination = (latlng) => {
    destination.current = latlng;
    if (dropoffMarker.current) {
      dropoffMarker.current.setPosition(latlng);
    }
    // Optionally draw route
    drawRoute();
  };

  const updateDriverLocation = (pos) => {
    if (!driverMarker.current) {
      driverMarker.current = new window.google.maps.Marker({
        position: pos,
        map: mapInstance.current,
        title: "Driver's Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FF0000',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      });
    } else {
      driverMarker.current.setPosition(pos);
    }
    drawRoute();
    mapInstance.current.setCenter(pos);
  };

  const drawRoute = () => {
    if (!driverMarker.current || !destination.current) return;
    if (routePolyline.current) {
      routePolyline.current.setMap(null);
    }
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: driverMarker.current.getPosition(),
        destination: destination.current,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          if (routePolyline.current) {
            routePolyline.current.setMap(null);
          }
          routePolyline.current = new window.google.maps.Polyline({
            path: response.routes[0].overview_path,
            geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 0.7,
            strokeWeight: 5,
          });
          routePolyline.current.setMap(mapInstance.current);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  // Content loading functions
  const loadMainPage = () => {
    setContent('main');
  };

  const loadDriverHistoryPayment = async () => {
    setContent('loading');
    // Simulate fetch
    await new Promise((res) => setTimeout(res, 1000));
    // Replace with actual fetch
    // fetch('/get-payfast-payments')
    // ...
    // For demo:
    setContent('history');
  };

  const loadPaymentSummary = async () => {
    setLoading(true);
    // Simulate fetch
    await new Promise((res) => setTimeout(res, 1000));
    // Fetch data here
    setPaymentSummary({
      totalPayments: 1000,
      successfulPayments: 800,
      pendingPayments: 200,
    });
    setLoading(false);
  };

  const loadOrderView = () => {
    setContent('order');
  };

  // Render components based on `content`
  const renderContent = () => {
    switch (content) {
      case 'main':
        return (
          <>
            <h2>Welcome Driver</h2>
            <p>Select an option from the menu.</p>
          </>
        );
      case 'loading':
        return <div className="loading">Loading...</div>;
      case 'history':
        return (
          <>
            <h1>Payment History</h1>
            {/* Map over payments */}
            <div>No payment data</div>
          </>
        );
      case 'order':
        return (
          <>
            <h2 style={{ color: 'red', borderLeft: '4px solid red', paddingLeft: '10px' }}>Order View</h2>
            {/* Order details */}
            <div className="card">
              {/* Order info here */}
              <div>Order ID: ORD-10045</div>
              {/* ... */}
            </div>
            {/* Map */}
            <div id="map" style={{ height: '200px', border: '1px solid #ccc', marginTop: '10px' }} ref={mapRef}></div>
            <button style={{ marginTop: '10px' }} onClick={() => alert('Accept / Decline clicked')}>Accept / Decline</button>
          </>
        );
      default:
        return null;
    }
  };

  // Load Google Maps script dynamically
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      script.async = true;
      window.initMap = () => {
        // Map will initialize in useEffect
        // but since we've already set up, do nothing here
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, background: '#f4f4f4' }}>
      {/* Notification messages */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
        {notifications.map(n => (
          <div key={n.id} style={{ backgroundColor: n.color, padding: '12px 20px', borderRadius: '8px', marginBottom: '5px', color: '#fff', fontSize: '14px', opacity: 1, transition: 'opacity 0.3s ease' }}>
            {n.text}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.1)' }}>
        <div className="driver-label" style={{ fontWeight: 'bold', fontSize: '20px', color: 'red' }}>Driver</div>
        <div className="menu-container" style={{ position: 'relative' }}>
          <button className="menu-button" style={{ background: 'red', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={toggleMenu}>Menu ▼</button>
          {menuOpen && (
            <div className="dropdown-content" style={{ position: 'absolute', right: 0, background: '#fff', minWidth: '220px', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0,0,0,.15)', overflow: 'hidden' }}>
              <a href="#" style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: '#333', borderBottom: '1px solid #eee' }} onClick={(e) => { e.preventDefault(); loadMainPage(); setMenuOpen(false); }}>Order View</a>
              <a href="http://127.0.0.1:5501/driver-app/client/public/driver_view_account.html" target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: '#333', borderBottom: '1px solid #eee' }}>Driver View Account</a>
              <a href="#" style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: '#333', borderBottom: '1px solid #eee' }} onClick={(e) => { e.preventDefault(); loadDriverHistoryPayment(); setMenuOpen(false); }}>Driver History Payment</a>
              <a href="#" style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: '#333' }} onClick={(e) => { e.preventDefault(); /* handle logout */ setMenuOpen(false); }}>Logout</a>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div id="contentArea" style={{ maxWidth: '900px', margin: '20px auto', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,.1)' }}>
        {renderContent()}
      </div>

      {/* Hidden input for user location */}
      <input type="hidden" id="user_location_id" name="user_location_id" />

      {/* Load Google Maps API */}
      {/* You can add this script tag in your index.html or dynamically load as shown in useEffect */}
    </div>
  );
}

export default DriverApp;