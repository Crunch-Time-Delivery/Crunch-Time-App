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
    document.body.appendChild(box);
  }

  box.style.backgroundColor = color;
  box.innerText = text;

  // Remove the notification after 4 seconds
  setTimeout(() => box.remove(), 4000);
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



// Function to generate a random 6-digit PIN
function generatePIN() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
let map;
let driverMarker = null;
let trackingInterval = null; // To store the setInterval ID
const driverId = null; // Your driver ID
// Initialize the map
function initMap() {
  const defaultLocation = { lat: -33.9249, lng: 18.4241 }; // Example: Cape Town
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: defaultLocation,
  });
  // Optionally, start tracking automatically or call startTracking() separately
  startTracking();
}

// Fetch driver location from API and update marker
function fetchAndUpdateLocation() {
  fetch(`/api/driver-location?driverId=${driverId}`)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      const loc = { lat: data.latitude, lng: data.longitude };
      if (!driverMarker) {
        driverMarker = new google.maps.Marker({ position: loc, map: map, title: "Driver's Location", icon: getDriverIcon() });
      } else {
        driverMarker.setPosition(loc);
      }
      map.setCenter(loc);
    })
    .catch(error => {
      console.error('Error fetching driver location:', error);
    });
}

// Optional: Use browser geolocation for real-time tracking
function startBrowserGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      position => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        if (!driverMarker) {
          driverMarker = new google.maps.Marker({ position: loc, map: map, title: "Driver's Location", icon: getDriverIcon() });
        } else {
          driverMarker.setPosition(loc);
        }
        map.setCenter(loc);
      },
      error => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}

// Start periodic fetching of driver location
function startTracking() {
  fetchAndUpdateLocation(); // Initial fetch
  trackingInterval = setInterval(fetchAndUpdateLocation, 10000); // Every 10 seconds
}

// Stop periodic tracking
function stopTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
}

// Utility function to get custom driver icon (optional)
function getDriverIcon() {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: '#FF0000',
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 2
  };
}


async function fetchRestaurantName() {
  const res = await fetch('/api/restaurant-name');
  const data = await res.json();
  document.getElementById('restaurantName').innerText = data.name || 'Your Restaurant';
}

function goBack() { window.history.back(); }
function callDriver() { window.location.href = "tel:+27781234567"; }
function chatDriver() { window.open("https://wa.me/27781234567", "_blank"); }

function showTab(tab) {
  document.getElementById("progress").classList.remove("active");
  document.getElementById("info").classList.remove("active");
  document.getElementById("tabProgress").classList.remove("active");
  document.getElementById("tabInfo").classList.remove("active");
  document.getElementById(tab).classList.add("active");
  document.getElementById("tab" + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add("active");
}

// Show the top pin message (initially hidden)
function showPinMessage() {
  document.getElementById('topPinMessage').style.display = 'block';
}

// Generate and display the PIN
window.onload = () => {
  fetchRestaurantName();
  const pin = generatePIN();
  document.getElementById('orderPin').innerText = pin;
  showPinMessage(); // Show pin message at top
};