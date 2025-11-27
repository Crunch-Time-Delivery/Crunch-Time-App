// Function to fetch configuration (if needed)
async function fetchConfig(configUrl) {
  const response = await fetch(configUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }
  return await response.json();
}

// Function to track payment
async function trackPayment() {
  try {
    // Fetch your configuration if needed
    const config = await fetchConfig('payfastConfig.json');

    // Send payment data to your backend API
    const response = await fetch('/track-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

    const result = await response.json();
    // Assuming result has a 'status' field
    alert(`Payment status: ${result.status}`);
  } catch (error) {
    console.error('Error:', error);
    alert(`An error occurred: ${error.message}`);
  }
}

// Call the function, e.g., on button click
// document.getElementById('trackButton').addEventListener('click', trackPayment);