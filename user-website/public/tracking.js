// tracker.js

// Assuming you have included AWS SDK via script tag or installed via npm and bundled appropriately

// AWS configuration
var AWS_REGION = "us-east-1"; // Replace with your AWS region

// Initialize AWS SDK client
var client = new AWS.Location({ region: AWS_REGION });

// Device and tracker configuration
var TRACKER_NAME = "MyDeviceTracker"; // Replace with your tracker name
var DEVICE_ID = "device-001"; // Replace with your device ID

var watchId = null;

/**
 * Sends the current position to AWS Location Tracker.
 * @param {GeolocationPosition} position - The position object from Geolocation API.
 */
function updateAWSTracker(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  var params = {
    TrackerName: TRACKER_NAME,
    Updates: [{
      DeviceId: DEVICE_ID,
      SampleTime: new Date().toISOString(),
      Position: [longitude, latitude], // AWS expects [lng, lat]
    }]
  };

  var command = new AWS.Location.BatchUpdateDevicePositionCommand(params);

  client.send(command, function(err, data) {
    if (err) {
      console.error("Error updating position:", err);
    } else {
      console.log("Position updated: (" + latitude.toFixed(6) + ", " + longitude.toFixed(6) + ")");
    }
  });
}

/**
 * Starts live tracking of device location.
 */
function startTracking() {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by this browser.");
    return;
  }
  if (watchId !== null) {
    console.log("Tracking is already active.");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    updateAWSTracker,
    function(err) {
      console.error("Geolocation error:", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );

  console.log("Live tracking started.");
}

/**
 * Stops live tracking.
 */
function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log("Live tracking stopped.");
  } else {
    console.log("Tracking is not active.");
  }
}

// Usage example:
// startTracking(); // To begin
// stopTracking();  // To stop