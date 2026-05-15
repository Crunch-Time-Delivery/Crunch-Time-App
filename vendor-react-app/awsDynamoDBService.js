// Initialize AWS SDK and Location client
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' }); // Replace with your region
const location = new AWS.Location({ apiVersion: '2020-11-19' });

// Tracker and device identifiers
const trackerName = 'YourTrackerName'; // Replace with your tracker name
const deviceId = 'driver-123'; // Replace with your device ID

// Map and marker references
let map; // Your Google Map instance
let driverMarker = null;
let driverPathLine = null;
let driverPathCoordinates = [];

// Function to initialize map (call this before tracking)
function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 14,
  });
}

// Function to fetch latest driver location and update map
async function fetchAndUpdateDriverLocation() {
  const params = {
    TrackerName: trackerName,
    DeviceId: deviceId,
  };

  try {
    const data = await location.getDevicePosition(params).promise();

    if (data.Position) {
      const [lng, lat] = data.Position; // AWS returns [lng, lat]
      const pos = { lat, lng };

      // Create marker if it doesn't exist
      if (!driverMarker) {
        driverMarker = new google.maps.Marker({
          position: pos,
          map,
          icon: {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          },
          title: 'Driver Location',
        });
      } else {
        driverMarker.setPosition(pos);
      }

      // Append position to path
      driverPathCoordinates.push(pos);

      // Create polyline if it doesn't exist
      if (!driverPathLine) {
        driverPathLine = new google.maps.Polyline({
          path: driverPathCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map,
        });
      } else {
        driverPathLine.setPath(driverPathCoordinates);
      }

      // Center map on driver
      map.setCenter(pos);

      // Optional: update driver label position
      moveDriverLabel(pos);
    }
  } catch (err) {
    console.error('Error fetching driver location from AWS:', err);
    // Optional: display user-friendly message or retry logic
  }
}

// Function to start periodic tracking
function startTrackingDriver(intervalMs = 10000) {
  fetchAndUpdateDriverLocation(); // initial fetch
  window.driverTrackingInterval = setInterval(fetchAndUpdateDriverLocation, intervalMs);
}

// Call initializeMap() once your map container is ready, then start tracking
// Example:
// window.onload = () => {
//   initializeMap();
//   startTrackingDriver();
// }