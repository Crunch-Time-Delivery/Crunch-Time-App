async function initiatePayment(amount, item_name) {
  try {
    const response = await fetch('http://localhost:3001/create-payfast-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, item_name }),
    });
    const data = await response.json();
    if (data.paymentUrl) {
      // Optionally, save the payment ID or URL in your app
      window.location.href = data.paymentUrl; // Redirect to PayFast
    } else {
      alert('Failed to create payment.');
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
  }
}