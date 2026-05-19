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

    // Initialize PayFastButton with your credentials
    const payFastButton = new PayFastButton({
      orderNumber,
      amount,
      currency: 'ZAR', // Adjust currency as needed
      merchantId: process.env.REACT_APP_PAYFAST_MERCHANT_ID, // Use environment variables for security
      merchantKey: process.env.REACT_APP_PAYFAST_MERCHANT_KEY,
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
      // Start the payment process
      payFastButton.createPaymentWindow();
    } catch (err) {
      console.error('Error initiating PayFast payment:', err);
      setError('Unable to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={processing}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: processing ? 'not-allowed' : 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {processing ? 'Processing...' : 'Pay with PayFast'}
        </button>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
        )}
        {succeeded && (
          <div style={{ color: 'green', marginTop: '10px' }}>Payment successful!</div>
        )}
      </form>
    </div>
  );
};

export default PayFastCheckout;