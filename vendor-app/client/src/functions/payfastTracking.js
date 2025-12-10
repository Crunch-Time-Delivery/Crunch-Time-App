// payfastTracking.js

// Replace these with your actual PayFast credentials and URLs
const PAYFAST_MERCHANT_ID = '10004002';
const PAYFAST_MERCHANT_KEY = 'q1cd2rdny4a53';
const RETURN_URL = 'https://yourvendorwebsite.com/payment-return';
const CANCEL_URL = 'https://yourvendorwebsite.com/payment-cancel';
const NOTIFY_URL = 'https://yourvendorwebsite.com/ipn-listener'; // Your server endpoint for IPN

/**
 * Initiates a payment process with PayFast
 * @param {number} amount - The amount to be paid
 * @param {string} itemName - Description of the item or order
 * @param {string} customerEmail - Customer's email address
 */
function initiatePayFastPayment(amount, itemName, customerEmail) {
    // Generate a unique transaction ID
    const transactionId = 'TXN' + Date.now();

    // Prepare data to send to PayFast
    const paymentData = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        amount: amount.toFixed(2),
        item_name: itemName,
        return_url: RETURN_URL,
        cancel_url: CANCEL_URL,
        notify_url: NOTIFY_URL,
        custom_str1: transactionId,
        email_address: customerEmail,
    };

    // Generate signature
    generateSignature(paymentData, PAYFAST_MERCHANT_KEY).then(signature => {
        paymentData['signature'] = signature;

        // Create and submit form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.payfast.co.za/eng/process';

        for (const key in paymentData) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();

        // Save transaction ID for tracking
        localStorage.setItem('currentTransactionId', transactionId);
        console.log('Redirecting to PayFast for payment...');
    });
}

/**
 * Generates SHA256 signature for PayFast
 * @param {Object} data - Data object to sign
 * @param {string} merchantKey - Your merchant key
 * @returns {Promise<string>} - The hash as a hex string
 */
function generateSignature(data, merchantKey) {
    const sortedKeys = Object.keys(data).sort();
    const dataString = sortedKeys.map(k => `${k}=${data[k]}`).join('&');

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString + merchantKey);
    return window.crypto.subtle.digest('SHA-256', dataBuffer).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    });
}

/**
 * Checks transaction status via your backend
 * @param {string} transactionId
 * @returns {Promise<Object>} Transaction status info
 */
async function checkTransactionStatus(transactionId) {
    try {
        const response = await fetch(`/api/check-transaction?transactionId=${transactionId}`);
        return await response.json();
    } catch (error) {
        console.error('Error checking transaction:', error);
        return null;
    }
}

/**
 * Handles IPN notifications received from your server
 * Your server should send IPN data here, or you process IPN server-side.
 * This function can be called after receiving IPN data.
 */
function handleIPNNotification(ipnData) {
    console.log('Received IPN:', ipnData);
    // For example, update order status in your database
    fetch('/api/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ipnData)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Order status updated:', data);
        // Optional: notify user
    });
}

// Example usage:
// initiatePayFastPayment(100.00, 'Order #1234', 'customer@example.com');