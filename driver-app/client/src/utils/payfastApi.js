import { PayFast } from 'payfast-api';

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

export { createPayFastTransaction };