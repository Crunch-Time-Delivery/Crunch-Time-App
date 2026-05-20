const AWS = require('aws-sdk');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' }); // Replace with your region

const location = new AWS.Location({ apiVersion: '2020-11-19' });

// Tracker and device info
const trackerName = 'DriverTracker';
const driverId = 'driver-123';

// Initialize serial port for GPS data
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

// Function to parse GPS data (adjust based on your GPS output format)
function parseGPSData(line) {
  // Example: if GPS outputs "LAT,LON"
  const parts = line.split(',');
  if (parts.length >= 2) {
    const latitude = parseFloat(parts[0]);
    const longitude = parseFloat(parts[1]);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      return [longitude, latitude]; // AWS expects [lng, lat]
    }
  }
  return null;
}

// Function to get current GPS position
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    parser.once('data', (line) => {
      const coords = parseGPSData(line);
      if (coords) {
        resolve(coords);
      } else {
        reject(new Error('Invalid GPS data'));
      }
    });
  });
}

// AWS Location Service functions
async function createTracker(trackerName) {
  const params = {
    TrackerName: trackerName,
    Description: 'Tracking driver location',
    PricingPlan: 'RequestBasedUsage',
    PricingPlanStatus: 'Active',
  };
  try {
    const data = await location.createTracker(params).promise();
    console.log('Tracker created:', data);
  } catch (err) {
    if (err.code === 'ResourceAlreadyExistsException') {
      console.log(`Tracker "${trackerName}" already exists.`);
    } else {
      console.error('Error creating tracker:', err);
    }
  }
}

async function createDevice(trackerName, deviceId) {
  const resourceARN = `arn:aws:geo:YOUR_REGION:YOUR_ACCOUNT_ID:tracker/${trackerName}`; // replace with your region & account ID
  try {
    await location.tagResource({
      ResourceARN: resourceARN,
      Tags: { DeviceId: deviceId },
    }).promise();
    console.log(`Device ${deviceId} registered to tracker ${trackerName}`);
  } catch (err) {
    if (err.code === 'ResourceNotFoundException') {
      console.error('Tracker not found. Make sure to create tracker first.');
    } else if (err.code === 'ResourceAlreadyExistsException') {
      console.log(`Device ${deviceId} already registered.`);
    } else {
      console.error('Error registering device:', err);
    }
  }
}

async function updateDevicePosition(trackerName, deviceId, position) {
  const params = {
    TrackerName: trackerName,
    Updates: [
      {
        DeviceId: deviceId,
        Position: position,
        SampleTime: new Date().toISOString(),
      },
    ],
  };
  try {
    await location.batchUpdateDevicePosition(params).promise();
    console.log(`Position for ${deviceId} updated to`, position);
  } catch (err) {
    console.error('Error updating position:', err);
  }
}

// Main loop for live tracking
async function startLiveTracking() {
  while (true) {
    try {
      const position = await getCurrentPosition();
      await updateDevicePosition(trackerName, driverId, position);
    } catch (err) {
      console.error('Live tracking error:', err);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000)); // wait 5 seconds
  }
}

// Initialize tracker and device, then start tracking
async function initialize() {
  await createTracker(trackerName);
  await createDevice(trackerName, driverId);
  startLiveTracking(); // run the infinite loop
}

initialize();