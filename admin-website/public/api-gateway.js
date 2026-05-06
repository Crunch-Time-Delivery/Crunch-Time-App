const axios = require('axios');

/**
 * Calls an API Gateway Lambda endpoint with provided data.
 * @param {string} apiUrl - The API Gateway URL.
 * @param {Object} data - The payload to send.
 * @returns {Object|null} - Returns response data or null if error occurs.
 */
async function callLambdaApi(apiUrl, data) {
  try {
    const response = await axios.post(apiUrl, data);
    console.log('API response:', response.data);
    return response.data; // Return data for further processing if needed
  } catch (err) {
    // Log detailed error info
    if (err.response) {
      console.error('API responded with error:', err.response.status, err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error setting up request:', err.message);
    }
    return null; // Return null on failure
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

// Call the API and handle response
callLambdaApi(apiUrl, data).then((result) => {
  if (result) {
    // Process result if needed
    console.log('Success:', result);
  } else {
    console.error('API call failed.');
  }
});
