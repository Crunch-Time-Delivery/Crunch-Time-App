// Function to fetch configuration (if needed)
async function fetchConfig(configUrl) {
  try {
    const response = await fetch(configUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
}

// Function to track payment
async function trackPayment() {
  try {
    // Fetch your configuration
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
      const errorText = await response.text();
      alert(`Error tracking payment: ${response.status} ${response.statusText} - ${errorText}`);
      return;
    }

    const result = await response.json();
    // Handle the response based on your API's structure
    if (result.status) {
      alert(`Payment status: ${result.status}`);
    } else {
      alert('Payment tracking response received, but no status provided.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(`An error occurred: ${error.message}`);
  }
}

// Example: attach to a button click
// document.getElementById('trackButton').addEventListener('click', trackPayment);