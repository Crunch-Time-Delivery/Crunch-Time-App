// server.js (Node.js/Express example)
const { PayFast } = require('node-payfast');
const express = require('express');
const app = express();

// Initialize with your configuration (use environment variables in a real app)
const pf = new PayFast({
    sandbox: true, // Set to false for production
    merchant_id: process.env.MERCHANT_ID,
    merchant_key: process.env.MERCHANT_KEY,
    passphrase: process.env.PASSPHRASE // Optional but recommended
});

app.post('/create-payment-uuid', async (req, res) => {
    // Collect payment data from the request body
    const paymentData = { /* ... your payment details ... */ };

    try {
        const paymentUrl = await pf.generatePaymentUrl(paymentData);
        const uuid = paymentUrl.split('/').pop();
        res.json({ uuid: uuid });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
