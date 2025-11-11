// Declare map variable at module scope
let map: google.maps.Map | null = null;

function initializeMap(): void {
  const mapOptions: google.maps.MapOptions = {
    center: { lat: -25.2744, lng: 133.7751 },
    zoom: 4
  };
  const mapElement = document.getElementById('map');
  if (mapElement) {
    map = new google.maps.Map(mapElement, mapOptions);
  } else {
    console.error('Map element not found');
  }
}

function addMarker(lat: number, lng: number): void {
  if (!map) {
    console.error('Map is not initialized');
    return;
  }
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: 'Pinpoint Location'
  });
}

// Example usage: receiving coordinates
function receivePinpoint(lat: number, lng: number): void {
  addMarker(lat, lng);
}

// pinpoint.ts
async function sendLocation(userId: string, latitude: number, longitude: number): Promise<void> {
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