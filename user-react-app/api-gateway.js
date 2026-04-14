// api-gateway.js

const axios = require('axios');

async function callLambdaApi(apiUrl, data) {
  try {
    const response = await axios.post(apiUrl, data);
    console.log('API response:', response.data);
  } catch (err) {
    console.error('Error calling API:', err);
  }
}

// Usage example:
const apiUrl = 'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/your-resource';

const data = {
  deviceId: 'order-12345',
  position: [-123.3656, 48.4284],
  userId: 'user-7890',
  message: 'Device has moved.',
};

callLambdaApi(apiUrl, data);
