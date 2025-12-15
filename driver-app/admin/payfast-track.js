// Function to fetch configuration (cached after first fetch)
let payfastConfig = null;

async function fetchConfig(configUrl) {
  if (payfastConfig) return payfastConfig; // Return cached config if available
  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
    }
    payfastConfig = await response.json();
    return payfastConfig;
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
}

// Function to initiate and track a payment
async function trackPayment(paymentDetails = {}) {
  try {
    // Fetch configuration once
    const config = await fetchConfig('payfastConfig.json');

    // Prepare payment data - can override defaults with paymentDetails parameter
    const paymentData = {
      merchantID: config.merchantID,
      merchantKey: config.merchantKey,
      amount: paymentDetails.amount || config.paymentAmount,
      currency: paymentDetails.currency || config.currency,
      // Optional: add more fields like customer info, order ID, etc.
      ...paymentDetails
    };

    // Send payment data to your backend API for processing
    const response = await fetch('/track-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Add auth headers if needed, e.g.,
        // 'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(`Error tracking payment: ${response.status} ${response.statusText} - ${errorText}`);
      return;
    }

    const result = await response.json();

    // Handle different response statuses
    if (result.status) {
      alert(`Payment status: ${result.status}`);
    } else if (result.message) {
      alert(`Response: ${result.message}`);
    } else {
      alert('Payment tracking response received, but no status or message.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(`An error occurred: ${error.message}`);
  }
}

// Example: attaching to a button click
// document.getElementById('trackButton').addEventListener('click', () => {
//   // Optionally pass custom payment details
//   trackPayment({ amount: 100.00, currency: 'USD' });
// });