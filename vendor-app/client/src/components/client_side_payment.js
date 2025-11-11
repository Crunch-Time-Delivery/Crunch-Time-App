async function initiatePayment(amount, item_name) {
  try {
    const response = await fetch('http://localhost:3001/create-payfast-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, item_name }),
    });
    const data = await response.json();
    if (data.paymentUrl) {
      // Redirect to the payment URL
      window.location.href = data.paymentUrl;
    } else {
      alert('Failed to create payment.');
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
  }
}