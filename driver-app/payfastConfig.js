async function trackPayment() {
  const config = await fetchConfig('payfastConfig.json');

  // You would typically call your backend API to confirm payment status
  fetch('https://your-backend-api/track-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantID: config.merchantID,
      merchantKey: config.merchantKey,
      amount: config.paymentAmount,
      currency: config.currency
    })
  }).then(res => res.json())
    .then(data => {
      // Assuming data has status
      alert(`Payment status: ${data.status}`);
    });
}