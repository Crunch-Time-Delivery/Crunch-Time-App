const axios = require('axios');

/**
 * Calls an API Gateway Lambda endpoint with provided data.
 * @param {string} apiUrl - The API Gateway URL.
 * @param {Object} data - The payload to send.
 * @param {Object} [headers={}] - Optional headers for the request.
 * @param {number} [timeout=5000] - Optional timeout in ms.
 * @returns {Object|null} - Returns response data or null if error occurs.
 */
async function callLambdaApi(apiUrl, data, headers = {}, timeout = 5000) {
  try {
    const response = await axios.post(apiUrl, data, { headers, timeout });
    console.log('API response:', response.data);
    return response.data; // Return data for further processing
  } catch (err) {
    if (err.response) {
      console.error(
        `API responded with error: ${err.response.status}`,
        err.response.data
      );
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Request setup error:', err.message);
    }
    return null; // Graceful failure
  }
}

// Usage example:
const apiUrl =
  'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/your-resource';

const data = {
  deviceId: 'order-12345',
  position: [-123.3656, 48.4284],
  userId: 'user-7890',
  message: 'Device has moved.',
};

// Call the API and handle response
callLambdaApi(apiUrl, data)
  .then((result) => {
    if (result) {
      // Process successful response
      console.log('Success:', result);
    } else {
      console.error('API call failed.');
    }
  });