// Function to fetch and parse JSON configuration
async function fetchConfig(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

// Function to track payment
async function trackPayment() {
  try {
    const config = await fetchConfig('payfastConfig.json');

    const response = await fetch('https://your-backend-api/track-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantID: config.merchantID,
        merchantKey: config.merchantKey,
        amount: config.paymentAmount,
        currency: config.currency
      })
    });

    if (!response.ok) {
      alert(`Error tracking payment: ${response.statusText}`);
      return;
    }

    const data = await response.json();
    // Assuming data has a 'status' property
    alert(`Payment status: ${data.status}`);
  } catch (error) {
    console.error('Error:', error);
    alert(`An error occurred: ${error.message}`);
  }
}