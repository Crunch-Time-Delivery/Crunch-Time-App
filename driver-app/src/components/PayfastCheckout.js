   // src/components/PayFastCheckout.js
import React, { useState } from 'react';
import { PayFastButton } from '@payfast/payfast';

const PayFastCheckout = ({ orderNumber, amount }) => {
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payFastButton = new PayFastButton({
      orderNumber,
      amount,
      currency: 'ZAR', // South African Rand (you can change this to other currencies)
      callback: (response) => {
        if (response.status === 'success') {
          setSucceeded(true);
          setProcessing(false);
        } else {
          setError(response.message);
        }
      },// Add your PayFast merchant ID and secret key here
     merchantId: 'YOUR_MERCHANT_ID',
      merchantKey: 'YOUR_MERCHANT_SECRET_KEY',
    });

    payFastButton.createPaymentWindow();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <PayFastButton />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {succeeded && <div style={{ color: 'green' }}>Payment successful!</div>}
      </form>
    </div>
  );
};

export default PayFastCheckout;