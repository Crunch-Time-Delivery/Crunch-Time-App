const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const twilio = require('twilio');
const axios = require('axios');

// Load config.json with fallback to environment variables
const configPath = path.join(__dirname, 'config.json');
let config;

try {
  const rawConfig = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(rawConfig);
} catch (err) {
  console.warn('Failed to load config.json, falling back to environment variables.');
  config = {
    aws: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    },
    googleMaps: {
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  };
}

// Initialize AWS SDK
try {
  AWS.config.update({
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  });
} catch (err) {
  console.error('Error configuring AWS SDK:', err);
}

// Initialize Twilio client
const twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);

// Google Maps API axios instance
const googleMapsApi = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
  params: {
    key: config.googleMaps.apiKey,
  },
});

// Example function to get directions from Google Maps
async function getDirections(origin, destination) {
  try {
    const response = await googleMapsApi.get('/directions/json', {
      params: {
        origin,
        destination,
      },
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
  getDirections,
};