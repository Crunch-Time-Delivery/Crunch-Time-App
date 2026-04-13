// Assuming axios.standalone.js is included via <script> tag
// <script src="path/to/axios.standalone.js"></script>

const API_ENDPOINT = "https://your-api-id.execute-api.region.amazonaws.com/v1/example";

async function fetchApiData() {
  try {
    // Making a GET request
    const response = await axios.get(API_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Logging the data and status
    console.log("Status:", response.status);
    console.log("Data:", response.data);
  } catch (error) {
    // Error handling
    if (error.response) {
      console.error("Error Response:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
  }
}