import { PayFast } from 'payfast-api';

document.getElementById('payfastForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission
 // Your PayFast merchant details (replace with actual values)
 const merchantID = 10004002;
const merchantKey = "q1cd2rdny4a53";
  const currency = "ZAR";

  // Collect form data
  const formData = new FormData(this);
  const data = {};

  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Include merchant details
  data['merchant_id'] = merchantID;
  data['merchant_key'] = merchantKey;
  data['currency'] = currency;

  try {
    // Call your API to create a transaction via payfast-api
    const transaction = await createPayFastTransaction(data.amount);

    // Assuming your backend needs the transaction details
    // Send data to your server-side endpoint
    const response = await fetch('/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantID,
        merchant_key: merchantKey,
        amount: data.amount,
        currency: currency,
        transaction_id: transaction.id, // example usage
        // add other relevant data if needed
      }),
    });

    const result = await response.json();

    if (result.success && result.redirectUrl) {
      // Redirect to PayFast gateway or success page
      window.location.href = result.redirectUrl;
    } else {
      alert('Payment processing failed: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during payment processing.');
  }
});

// The createPayFastTransaction function
const createPayFastTransaction = async (amount) => {
  const apiKey = 'YOUR_PAYFAST_API_KEY';
  const payFast = new PayFast(apiKey);
  const transaction = await payFast.createTransaction({
    amount,
    currency: 'ZAR',
    returnUrl: 'https://your-return-url.com',
  });
  return transaction;
};
