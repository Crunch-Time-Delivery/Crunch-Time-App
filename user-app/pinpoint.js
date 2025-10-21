function initializeMap() {
  const mapOptions = {
    center: { lat: -25.2744, lng: 133.7751 },
    zoom: 4
  };
  const map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function addMarker(lat, lng) {
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: 'Pinpoint Location'
  });
}

// Example usage: receiving coordinates
function receivePinpoint(lat, lng) {
  addMarker(lat, lng);
}
// pinpoint.js
async function sendLocation(userId, latitude, longitude) {
  const response = await fetch('/update-location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, latitude, longitude })
  });
  const data = await response.json();
  console.log(data);
}

// Example usage: send user location
// sendLocation('user123', 40.7128, -74.0060);