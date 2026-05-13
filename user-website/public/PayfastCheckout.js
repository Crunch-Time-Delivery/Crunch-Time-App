  import React, { useState } from 'react';
import { PayFastButton } from '@payfast/payfast';

const PayFastCheckout = ({ orderNumber, amount }) => {
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);
    setProcessing(true);

    const payFastButton = new PayFastButton({
      orderNumber,
      amount,
      currency: 'ZAR', // Adjust currency as needed
      merchantId: 'YOUR_MERCHANT_ID', // Replace with your actual merchant ID
      merchantKey: 'YOUR_MERCHANT_SECRET_KEY', // Replace with your secret key
      callback: (response) => {
        if (response.status === 'success') {
          setSucceeded(true);
        } else {
          setError(response.message || 'Payment failed. Please try again.');
        }
        setProcessing(false);
      },
    });

    try {
      payFastButton.createPaymentWindow();
    } catch (err) {
      console.error('Error initiating PayFast payment:', err);
      setError('Unable to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <button type="submit" disabled={processing} style={{ padding: '10px 20px' }}>
          {processing ? 'Processing...' : 'Pay with PayFast'}
        </button>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {succeeded && <div style={{ color: 'green', marginTop: '10px' }}>Payment successful!</div>}
      </form>
    </div>
  );
};

export default PayFastCheckout;