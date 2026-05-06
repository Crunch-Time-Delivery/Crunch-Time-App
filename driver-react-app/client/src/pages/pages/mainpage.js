document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menuContainer');
  const menuButton = document.getElementById('menuButton');
  const dropdown = document.getElementById('dropdownMenu');

  // Bind menu toggle
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    menuContainer.classList.toggle('show');
  });
  document.addEventListener('click', () => {
    menuContainer.classList.remove('show');
  });
  dropdown.addEventListener('click', (e) => e.stopPropagation());

  // Bind other menu links
  document.getElementById('orderViewLink').onclick = e => { e.preventDefault(); loadOrderView(); };
  document.getElementById('driverHistoryPayment').onclick = e => { e.preventDefault(); loadDriverHistoryPayment(); };
});


// ================= SMS NOTIFICATIONS =================
// Function to display notification messages
function showNotificationMessage(text, color = '#333') {
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

  // Clear any existing timeout
  if (showNotificationMessage.timeoutId) {
    clearTimeout(showNotificationMessage.timeoutId);
  }

  // Remove the notification after 4 seconds
  showNotificationMessage.timeoutId = setTimeout(() => {
    box.style.opacity = '0';
    // Optionally, you can remove the element after fade out
    setTimeout(() => {
      if (box) box.remove();
    }, 300);
  }, 4000);
}

// Function to send Twilio notification
function sendTwilioNotification(phoneNumber, message, callback = null) {
  if (!phoneNumber || !message) {
    showNotificationMessage('Phone number or message missing', '#f44336');
    return;
  }
  
  showNotificationMessage('Sending notification...', '#2196F3');

  fetch('/send-twilio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber, message })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showNotificationMessage('Notification sent successfully!', '#4CAF50');
      if (callback && typeof callback === 'function') callback(true, data);
    } else {
      showNotificationMessage('Failed to send notification.', '#f44336');
      if (callback && typeof callback === 'function') callback(false, data);
    }
  })
  .catch(() => {
    showNotificationMessage('Error sending notification.', '#f44336');
    if (callback && typeof callback === 'function') callback(false);
  });
}

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this environment variable is set

const supabase = createClient(supabaseUrl, supabaseKey);

// Example function to fetch phone numbers
async function fetchPhoneNumbers() {
  const { data, error } = await supabase
    .from('Drivers') // replace with your table name
    .select('contact'); // replace with your column name

  if (error) {
    console.error('Error fetching phone numbers:', error);
    return [];
  }
  return data.map(row => row.phone_number);
}

// Example function to send SMS to all fetched phone numbers
async function sendSmsToAll() {
  const phoneNumbers = await fetchPhoneNumbers();

  for (const number of phoneNumbers) {
    await sendSMS({ to: number, message: 'Your message here' });
  }
}

// Example sendSMS function (replace with your actual implementation)
async function sendSMS({ to, message }) {
  // Your Twilio or SMS API call here
  console.log(`Sending message to ${to}: ${message}`);
  // Implement your actual SMS sending logic
}

// Run the main function
sendSmsToAll();













// Function to handle checkout order
function checkout_order(orderId, driverPhoneNumber) {
  const message = `Order #${orderId} has been checked out. Please proceed accordingly.`;
  notifyDriver(driverPhoneNumber, message);
}

// Function to notify driver via Twilio SMS
function notifyDriver(phoneNumber, message) {
  showNotificationMessage(`Notifying driver at ${phoneNumber}...`, '#2196F3');

  sendTwilioNotification(phoneNumber, message, (success, data) => {
    if (success) {
      showNotificationMessage(`Driver notified successfully!`, '#4CAF50');
    } else {
      showNotificationMessage(`Failed to notify driver.`, '#f44336');
    }
  });
}

/* ===========================
   New Utility Functions
   =========================== */

// Cancel any pending notification
function cancelNotification() {
  if (showNotificationMessage.timeoutId) {
    clearTimeout(showNotificationMessage.timeoutId);
  }
  const box = document.getElementById('notificationMessage');
  if (box) {
    box.style.opacity = '0';
    setTimeout(() => box.remove(), 300);
  }
}

// Validate phone number format (basic)
function isValidPhoneNumber(phoneNumber) {
  const pattern = /^\+?\d{10,15}$/; // Basic pattern for international numbers
  return pattern.test(phoneNumber);
}

// Send multiple notifications in parallel
function sendBulkNotifications(notificationsArray) {
  notificationsArray.forEach(({ phoneNumber, message }) => {
    if (isValidPhoneNumber(phoneNumber)) {
      notifyDriver(phoneNumber, message);
    } else {
      showNotificationMessage(`Invalid phone number: ${phoneNumber}`, '#f44336');
    }
  });
}

// Retry notification with a specified number of attempts
function notifyDriverWithRetry(phoneNumber, message, retries = 3) {
  const attempt = (n) => {
    sendTwilioNotification(phoneNumber, message, (success) => {
      if (!success && n > 0) {
        setTimeout(() => attempt(n - 1), 2000); // Retry after 2 seconds
      } else if (success) {
        showNotificationMessage(`Driver notified successfully!`, '#4CAF50');
      } else {
        showNotificationMessage(`Failed to notify driver after retries.`, '#f44336');
      }
    });
  };
  attempt(retries);
}

// Show a loading indicator
function showLoadingIndicator() {
  let loader = document.getElementById('loadingIndicator');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loadingIndicator';
    loader.innerHTML = 'Loading...'; // Style as needed
    loader.style.position = 'fixed';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.padding = '20px';
    loader.style.backgroundColor = '#fff';
    loader.style.border = '1px solid #ccc';
    loader.style.borderRadius = '8px';
    loader.style.zIndex = '99999';
    document.body.appendChild(loader);
  }
  loader.style.display = 'block';
}

// Hide the loading indicator
function hideLoadingIndicator() {
  const loader = document.getElementById('loadingIndicator');
  if (loader) {
    loader.style.display = 'none';
  }
}
 // Configure AWS SDK
  AWS.config.update({
    region: 'your-region', // e.g., 'us-east-1'
    credentials: new AWS.Credentials('YOUR_ACCESS_KEY_ID', 'YOUR_SECRET_ACCESS_KEY')
  });

  const locationClient = new AWS.Location({ apiVersion: '2020-11-19' });
// Map and marker variables
let map;
let userMarker;
let pickupMarker;
let dropoffMarker;
let driverMarker;
let routePolyline;
let directionsService; // Initialize once
let destination = null;

// Static constants
const AWS_TRACKER_NAME = 'YourTrackerName'; // AWS Tracker
const DEVICE_ID = 'driverDeviceId'; // Driver device ID
const FETCH_INTERVAL = 5000; // 5 seconds

// Initialize Google Map
function initMap() {
  const pickup = { lat: -33.9249, lng: 18.4241 }; // Restaurant
  const dropoff = { lat: -33.9289, lng: 18.4174 }; // Customer

  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Map element not found");
    return;
  }

  map = new google.maps.Map(mapElement, { zoom: 13, center: pickup });
  directionsService = new google.maps.DirectionsService();

  // Create pickup and dropoff markers
  pickupMarker = new google.maps.Marker({
    position: pickup,
    map,
    label: 'Pickup',
    title: 'Restaurant Pickup'
  });

  setDestination(dropoff);

  // Start fetching driver location periodically
  startFetchingDriverLocation();

  // Watch user geolocation
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      handleUserLocation,
      handleGeolocationError,
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  }
}

// Handle user geolocation updates
function handleUserLocation(position) {
  const pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  if (!userMarker) {
    userMarker = new google.maps.Marker({
      position: pos,
      map,
      title: "You are here!",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2
      }
    });
  } else {
    userMarker.setPosition(pos);
  }
  map.setCenter(pos);

  // Optional: Save location in a hidden input
  const locationInput = document.getElementById("user_location_id");
  if (locationInput) {
    locationInput.value = `${pos.lat},${pos.lng}`;
  }
}

function handleGeolocationError() {
  alert("Geolocation failed or is not supported");
}

// Set destination marker and route
function setDestination(latlng) {
  destination = latlng;

  if (dropoffMarker) {
    dropoffMarker.setPosition(latlng);
  } else {
    dropoffMarker = new google.maps.Marker({
      position: latlng,
      map,
      label: 'Destination',
      title: 'Delivery Destination',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      }
    });
  }

  drawRoute();

  document.getElementById('destinationInfo')?.innerText = `Destination set at (${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)})`;
}

// Update driver location marker
function updateDriverLocation(pos) {
  if (!driverMarker) {
    driverMarker = new google.maps.Marker({
      position: pos,
      map,
      title: "Driver's Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#FF0000',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2
      }
    });
  } else {
    driverMarker.setPosition(pos);
  }

  map.setCenter(pos);
  drawRoute();

  document.getElementById('driverLocation')?.innerText = `Driver at (${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)})`;
}
// New function to track user's location.
const trackLocation = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }

  // Use watchPosition instead.
  return navigator.geolocation.watchPosition(onSuccess, onError);
};

function init() {
  const initialPosition = { lat: 59.325, lng: 18.069 };
  const map = createMap(initialPosition);
  const marker = createMarker({ map, position: initialPosition });

  // Use the new trackLocation function.
  trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      marker.setPosition({ lat, lng });
      map.panTo({ lat, lng });
    },
    onError: err =>
      alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
  });
}
// Periodically fetch driver position from AWS
function startFetchingDriverLocation() {
  async function fetchAndUpdate() {
    try {
      const position = await getDevicePositionAWS(DEVICE_ID);
      if (position) {
        updateDriverLocation(position);
      }
    } catch (err) {
      console.error('Error fetching driver position:', err);
    }
  }

  // Initial fetch
  fetchAndUpdate();

  // Repeat at interval
  setInterval(fetchAndUpdate, FETCH_INTERVAL);
}

// Call AWS Location Service to get device position
function getDevicePositionAWS(deviceId) {
  return new Promise((resolve, reject) => {
    locationClient.getDevicePosition({ TrackerName: AWS_TRACKER_NAME, DeviceId: deviceId }, function(err, data) {
      if (err) {
        reject(err);
      } else if (data && data.DevicePosition) {
        // data.DevicePosition is [lng, lat]
        const pos = { lat: data.DevicePosition[1], lng: data.DevicePosition[0] };
        resolve(pos);
      } else {
        reject('No position data');
      }
    });
  });
}

// Draw route from driver to destination
function drawRoute() {
  if (!driverMarker || !destination || !directionsService) return;

  // Remove existing route
  if (routePolyline) {
    routePolyline.setMap(null);
  }

  const origin = driverMarker.getPosition();

  directionsService.route(
    {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (response, status) => {
      if (status === google.maps.DirectionsStatus.OK && response.routes.length > 0) {
        routePolyline = new google.maps.Polyline({
          path: response.routes[0].overview_path,
          geodesic: true,
          strokeColor: '#0000FF',
          strokeOpacity: 0.6,
          strokeWeight: 4,
        });
        routePolyline.setMap(map);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    }
  );
}

// Example: dynamically update destination
function updateDestination(newLat, newLng) {
  setDestination({ lat: newLat, lng: newLng });
}

// Initialize map on window load
window.onload = initMap;
// ================== Load Content Functions ==================
function loadMainPage() {
  document.getElementById('innerContent').innerHTML = `
    <h1>Welcome Driver</h1>
    <p>Select an option from the menu.</p>
  `;
}
async function loadDriverHistoryPayment() {
  const container = document.getElementById('innerContent');
  container.innerHTML = `<div class="loading">Loading payment history…</div>`;
  
  await new Promise(res => setTimeout(res, 1000));
  
  try {
    const response = await fetch('/get-payfast-payments'); // Your API endpoint
    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }
    const payments = await response.json();

    if (!payments || payments.length === 0) {
      container.innerHTML = `<p>No payment history available.</p>`;
      return;
    }

    let html = `<h1>Payment History</h1>`;
    for (const p of payments) {
      html += `
        <div class="card" style="margin-bottom:10px; padding:10px; border:1px solid #ccc;">
          <div><strong>Payment ID:</strong> ${p.id}</div>
          <div><strong>Amount:</strong> R ${parseFloat(p.amount).toFixed(2)}</div>
          <div><strong>Status:</strong> ${p.status}</div>
          <div><strong>Date:</strong> ${new Date(p.date).toLocaleString()}</div>
          <button onclick="trackPayFast('${p.id}')">Track Payment</button>
          <button onclick="loadDriverPaymentDetails('${p.id}')">View Details</button>
        </div>
      `;
    }
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading payment history:', error);
    container.innerHTML = `<p>Error loading payment history. Please try again later.</p>`;
  }
}

async function loadPaymentSummary() {
  const summaryContainer = document.getElementById('paymentSummary');
  summaryContainer.innerHTML = `<div class="loading">Loading payment summary…</div>`;

  await new Promise(res => setTimeout(res, 1000));

  try {
    const response = await fetch('/get-payfast-payment-summary');
    if (!response.ok) {
      throw new Error(`Failed to fetch payment summary: ${response.statusText}`);
    }
    const summaryData = await response.json();

    if (!summaryData || Object.keys(summaryData).length === 0) {
      summaryContainer.innerHTML = `<p>No payment summary available.</p>`;
      return;
    }

    let html = `
      <h2>Payment Summary</h2>
      <div><strong>Total Payments:</strong> R ${parseFloat(summaryData.totalPayments).toFixed(2)}</div>
      <div><strong>Total Successful Payments:</strong> R ${parseFloat(summaryData.successfulPayments).toFixed(2)}</div>
      <div><strong>Total Pending Payments:</strong> R ${parseFloat(summaryData.pendingPayments).toFixed(2)}</div>
    `;
    summaryContainer.innerHTML = html;
  } catch (error) {
    console.error('Error loading payment summary:', error);
    summaryContainer.innerHTML = `<p>Error loading payment summary. Please try again later.</p>`;
  }
}

// Function to load detailed info for a specific payment
async function loadDriverPaymentDetails(paymentId) {
  const container = document.getElementById('innerContent');
  container.innerHTML = `<div class="loading">Loading payment details…</div>`;
  
  try {
    const response = await fetch(`/get-payfast-payment-details/${paymentId}`); // Your API
    if (!response.ok) {
      throw new Error(`Failed to fetch payment details: ${response.statusText}`);
    }
    const details = await response.json();

    if (!details) {
      container.innerHTML = `<p>No details available for payment ID ${paymentId}.</p>`;
      return;
    }

    const html = `
      <h2>Payment Details for ID: ${paymentId}</h2>
      <p><strong>Amount:</strong> R ${parseFloat(details.amount).toFixed(2)}</p>
      <p><strong>Status:</strong> ${details.status}</p>
      <p><strong>Date:</strong> ${new Date(details.date).toLocaleString()}</p>
      <p><strong>Transaction Reference:</strong> ${details.transactionReference}</p>
      <p><strong>Customer Name:</strong> ${details.customerName}</p>
      <p><strong>Customer Email:</strong> ${details.customerEmail}</p>
      <button onclick="loadDriverHistoryPayment()">Back to Payment History</button>
    `;
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading payment details:', error);
    container.innerHTML = `<p>Error loading payment details. Please try again later.</p>`;
  }
}

// Function to refresh payment history
async function refreshPaymentHistory() {
  await loadDriverHistoryPayment();
}

function loadOrderView() {
  const container = document.getElementById('innerContent');
  if (!container) {
    console.error('Container element not found');
    return;
  }

  const order = {
    id: 'ORD-10045',
    customer: 'John Smith',
    verification: '482913',
    date: '2026-01-21',
    pickup: 'Pizza Palace, Cape Town',
    dropoff: '12 Long Street, Cape Town',
    total: 245.00,
    items: [
      { name: 'Large Pizza', qty: 1, price: 120 },
      { name: 'Chicken Wings', qty: 2, price: 45 },
      { name: 'Cooldrink', qty: 1, price: 35 }
    ]
  };

  container.innerHTML = `
    <h2 style="color: red; border-left: 4px solid red; padding-left: 10px;">Order View</h2>
    <div class="card">
      <div class="row"><strong>Order ID:</strong> ${order.id}</div>
      <div class="row"><strong>Customer:</strong> ${order.customer}</div>
      <div class="row"><strong>Verification:</strong> ${order.verification}</div>
      <div class="row"><strong>Date:</strong> ${order.date}</div>
    </div>
    <div class="card">
      <h3 style="color: red; border-left: 4px solid red; padding-left: 10px;">Order Items</h3>
      ${order.items.map(i => `
        <div class="row">
          <span>${i.name} (x${i.qty})</span>
          <span>R ${(i.qty * i.price).toFixed(2)}</span>
        </div>
      `).join('')}
      <div class="total"><strong>Total:</strong> R ${order.total.toFixed(2)}</div>
    </div>
    <div class="card">
      <h3 style="color: red; border-left: 4px solid red; padding-left: 10px;">Delivery Route</h3>
      <p><strong>Pick-up:</strong> ${order.pickup}</p>
      <p><strong>Drop-off:</strong> ${order.dropoff}</p>
      <div id="map" style="height: 200px; width: 100%; margin-top: 10px; border: 1px solid #ccc;"></div>
      <button style="margin-top: 10px;">Accept / Decline</button>
    </div>`;

  // Initialize the map after the content is loaded
  initMap();
}

function updateWiFiStatus() {
      const statusDiv = document.getElementById('connectionStatus');
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      if (connection) {
        if (connection.type === 'wifi') {
          // Connected to Wi-Fi
          statusDiv.style.display = 'none';
        } else {
          // Not Wi-Fi
          statusDiv.style.display = 'block';
        }
      } else {
        // Browser doesn't support Network Information API
        // fallback to online check only
        if (navigator.onLine) {
          statusDiv.style.display = 'none';
        } else {
          statusDiv.style.display = 'block';
        }
      }
    }

    window.addEventListener('online', updateWiFiStatus);
    window.addEventListener('offline', updateWiFiStatus);

    // For changes in connection type
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateWiFiStatus);
    }

window.addEventListener('load', () => {
  updateWiFiStatus();

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service_worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  }
});