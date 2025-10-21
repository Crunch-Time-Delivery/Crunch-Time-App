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