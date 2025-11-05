import React, { useEffect, useState } from 'react';
import { PayFast } from 'payfast-api';
import { createPayFastTransaction } from '../../utils/payfastApi';

const PayFastApiKey = 'YOUR_PAYFAST_API_KEY';

const CheckoutPage = () => {
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    const createTransaction = async () => {
      const transaction = await createPayFastTransaction(1000); // Example amount
      setTransactionId(transaction.id);
    };

    createTransaction();
  }, []);

  const handlePayFastResponse = (response) => {
    console.log(response);
  };

  return (
    <div>
      <h1>PayFast Checkout</h1>
      {transactionId && (
        <PayFast
          apiKey={PayFastApiKey}
          transactionId={transactionId}
          onSuccess={handlePayFastResponse}
          onError={handlePayFastResponse}
        />
      )}
    </div>
  );
};