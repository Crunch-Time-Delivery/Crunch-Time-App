// connection.js
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const twilio = require('twilio');
const axios = require('axios'); // for Google Maps API calls

// Load config.json
const configPath = path.join(__dirname, 'config.json');
const rawConfig = fs.readFileSync(configPath);
const config = JSON.parse(rawConfig);

// Initialize AWS SDK
AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

// Initialize Twilio
const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

// Google Maps API base URL
const googleMapsApi = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
  params: {
    key: config.googleMaps.apiKey
  }
});

// Example function to get directions from Google Maps
async function getDirections(origin, destination) {
  try {
    const response = await googleMapsApi.get('/directions/json', {
      params: {
        origin,
        destination
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching directions:', error);
    throw error;
  }
}

// Export initialized SDKs and functions
module.exports = {
  aws: AWS,
  twilio: twilioClient,
  getDirections
};