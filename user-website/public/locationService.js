const AWS = require('aws-sdk');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' }); // change to your region

const location = new AWS.Location({ apiVersion: '2020-11-19' });

// Tracker and device info
const trackerName = 'DriverTracker';
const driverId = 'driver-123';

// Initialize serial port for GPS data
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

// Function to parse GPS NMEA data or custom GPS data
function parseGPSData(line) {
  // Implement your GPS parsing logic here
  // Example: parse NMEA sentence for latitude and longitude
  // This is a placeholder example:
  // return [longitude, latitude];

  // Dummy implementation (replace with real parsing)
  // For example, if your GPS outputs "LAT,LON" format:
  const parts = line.split(',');
  if (parts.length >= 2) {
    const latitude = parseFloat(parts[0]);
    const longitude = parseFloat(parts[1]);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      return [longitude, latitude];
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

// AWS Location functions
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
    console.error('Error creating tracker:', err);
  }
}

async function createDevice(trackerName, deviceId) {
  const resourceARN = `arn:aws:geo:region:account-id:tracker/${trackerName}`; // replace 'region' and 'account-id'
  try {
    await location.tagResource({ ResourceARN: resourceARN, Tags: { DeviceId: deviceId } }).promise();
    console.log(`Device ${deviceId} registered to tracker ${trackerName}`);
  } catch (err) {
    console.error('Error registering device:', err);
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

// Continuous tracking loop
async function startLiveTracking() {
  while (true) {
    try {
      const position = await getCurrentPosition();
      await updateDevicePosition(trackerName, driverId, position);
    } catch (err) {
      console.error('Error during live tracking:', err);
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
  }
}

// Initialize tracker and device then start tracking
async function initialize() {
  await createTracker(trackerName);
  await createDevice(trackerName, driverId);
  startLiveTracking(); // start the loop
}

initialize();