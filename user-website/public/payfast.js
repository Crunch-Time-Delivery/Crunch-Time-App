const crypto = require('crypto');

const PAYFAST_MERCHANT_ID = '10004002'; // replace with your merchant ID
const PAYFAST_MERCHANT_KEY = 'q1cd2rdny4a53'; // replace with your merchant key
const PAYFAST_PASS_PHRASE = 'test-payfast'; // optional, if used
const PAYFAST_SANDBOX = true; // set to false for production
const crypto = require('crypto');

// Configuration (consider moving to environment variables)
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PAYFAST_PASS_PHRASE = process.env.PAYFAST_PASS_PHRASE || '';
const PAYFAST_SANDBOX = process.env.PAYFAST_SANDBOX === 'true'; // true or false

// Generate PayFast payment URL
function generatePayFastUrl(data) {
  const baseUrl = PAYFAST_SANDBOX
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';

  const queryString = Object.keys(data)
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join('&');

  return `${baseUrl}?${queryString}`;
}

// Generate MD5 signature for PayFast
function generateSignature(data) {
  const keys = Object.keys(data).sort();
  const stringToSign = keys
    .map(key => `${key}=${data[key]}`)
    .join('&');

  // Append passphrase if available
  const stringWithPassphrase = PAYFAST_PASS_PHRASE
    ? `${stringToSign}&passphrase=${PAYFAST_PASS_PHRASE}`
    : stringToSign;

  const hash = crypto.createHash('md5').update(stringWithPassphrase).digest('hex');
  return hash;
}

// Endpoint to create a payment
async function createPayment(req, res) {
  const { amount, itemName, itemDescription, customStr1 } = req.body;

  // Basic validation
  if (!amount || !itemName) {
    return res.status(400).json({ error: 'Missing required fields: amount, itemName' });
  }

  const data = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: 'https://yourdomain.com/payfast/return', // Replace with your URL
    cancel_url: 'https://yourdomain.com/payfast/cancel', // Replace with your URL
    notify_url: 'https://yourdomain.com/payfast/notify', // Replace with your URL
    amount: amount.toString(),
    item_name: itemName,
    item_description: itemDescription || '',
    custom_str1: customStr1 || '',
  };

  // Generate signature
  data['signature'] = generateSignature(data);

  // Generate payment URL
  const paymentUrl = generatePayFastUrl(data);

  res.json({ paymentUrl });
}

// Webhook handler for PayFast notifications
async function handleNotify(req, res) {
  const data = req.body;

  if (!data || typeof data !== 'object') {
    return res.status(400).send('Invalid data');
  }

  const receivedSignature = data['signature'];
  if (!receivedSignature) {
    return res.status(400).send('Missing signature');
  }

  // Verify signature
  const dataCopy = { ...data };
  delete dataCopy['signature'];
  const expectedSignature = generateSignature(dataCopy);

  if (receivedSignature !== expectedSignature) {
    return res.status(400).send('Invalid signature');
  }

  const paymentStatus = data['payment_status'];
  const customStr1 = data['custom_str1'];

  if (paymentStatus === 'COMPLETE') {
    // TODO: Update your database, mark payment as received
    // e.g., await markPaymentAsReceived(customStr1);
    return res.status(200).send('Payment verified and processed');
  } else {
    // Handle other statuses if needed
    return res.status(200).send('Payment not completed');
  }
}

module.exports = {
  createPayment,
  handleNotify,
};