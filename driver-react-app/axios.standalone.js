// Assuming axios.standalone.js is included via <script> tag
// <script src="path/to/axios.standalone.js"></script>

const API_ENDPOINT = "https://your-api-id.execute-api.region.amazonaws.com/v1/example";

async function fetchApiData() {
  try {
    // Make a GET request to the API endpoint
    const response = await axios.get(API_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Optional: add timeout or other configs here
    });

    // Log response status and data
    console.log("Status:", response.status);
    console.log("Data:", response.data);
  } catch (error) {
    // Handle errors
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
    } else if (error.request) {
      // No response received after request was sent
      console.error("No response received:", error.request);
    } else {
      // Error setting up the request
      console.error("Error Message:", error.message);
    }
  }
}