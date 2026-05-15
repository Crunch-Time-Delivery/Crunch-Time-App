// Assuming axios.standalone.js is included via <script> tag
// <script src="path/to/axios.standalone.js"></script>

const API_ENDPOINT = "https://your-api-id.execute-api.region.amazonaws.com/v1/example";

/**
 * Fetch data from API endpoint with error handling.
 * Optionally, you could add retries or debounce as needed.
 */
async function fetchApiData() {
  try {
    const response = await axios.get(API_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log response status and data
    console.log("Status:", response.status);
    console.log("Data:", response.data);
  } catch (error) {
    // Detailed error handling
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("Response error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something happened setting up the request
      console.error("Error setting up request:", error.message);
    }
    // Optional: handle specific status codes or retry logic here
  }
}