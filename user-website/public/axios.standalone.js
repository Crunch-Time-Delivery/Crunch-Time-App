// Assuming axios.standalone.js is included via <script> tag
// <script src="path/to/axios.standalone.js"></script>

const API_ENDPOINT = "https://your-api-id.execute-api.region.amazonaws.com/v1/example";

/**
 * Fetch data from API endpoint with enhanced error handling.
 */
async function fetchApiData() {
  try {
    const response = await axios.get(API_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Optional: set a timeout (e.g., 5000ms)
      // timeout: 5000,
    });

    // Log response status and data
    console.log("Status:", response.status);
    console.log("Data:", response.data);
  } catch (error) {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Headers:", error.response.headers);
    } else if (error.request) {
      // No response received after request was sent
      console.error("No response received:", error.request);
    } else {
      // Error setting up the request
      console.error("Error Message:", error.message);
    }
    // Optional: add retry logic or user notifications here
  }
}