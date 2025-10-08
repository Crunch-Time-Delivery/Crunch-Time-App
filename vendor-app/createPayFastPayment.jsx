import React, { useState } from 'react';
import { createPayFastPayment } from './api';

function PaymentButton() {
  const [paymentUrl, setPaymentUrl] = useState('');

  const handlePay = async () => {
    try {
    const { paymentUrl } = await createPayFastPayment({
        amount: '100.00',
        item_name: 'Test Item',
      });
      window.location.href = paymentUrl; // redirect to PayFast
    }catch (err) {
      alert('Error creating payment');
    }
  };

  return (
    <button onClick={handlePay}>Pay with PayFast</button>
  );
}

export default PaymentButton;