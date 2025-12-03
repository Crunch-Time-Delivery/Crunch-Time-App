// payfastTracking.js

// Replace these with your actual PayFast credentials and URLs
const PAYFAST_MERCHANT_ID = '10004002';
const PAYFAST_MERCHANT_KEY = 'q1cd2rdny4a53';
const RETURN_URL = 'https://yourvendorwebsite.com/payment-return';
const CANCEL_URL = 'https://yourvendorwebsite.com/payment-cancel';
const NOTIFY_URL = 'https://yourvendorwebsite.com/ipn-listener'; // PayFast server sends IPN notifications here

/**
 * Initiates a payment process with PayFast
 * @param {number} amount - The amount to be paid
 * @param {string} itemName - Description of the item or order
 * @param {string} customerEmail - Customer's email address
 */
function initiatePayFastPayment(amount, itemName, customerEmail) {
    // Generate a unique transaction ID or order ID
    const transactionId = 'TXN' + Date.now();
 
    // Prepare data for PayFast
    const paymentData = {
        merchant_id:'10004002',
        merchant_key: 'q1cd2rdny4a53',
        amount: amount.toFixed(2),
        item_name: itemName,
        return_url: RETURN_URL,
        cancel_url: CANCEL_URL,
        notify_url: NOTIFY_URL,
        custom_str1: transactionId, // You can pass custom data here
        email_address: customerEmail,
    };

    // Generate signature for security
    const signature = generateSignature(paymentData, PAYFAST_MERCHANT_KEY);
    paymentData.signature = signature;

    // Create a form dynamically and submit it
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

    // Store transaction ID for tracking
    localStorage.setItem('currentTransactionId', transactionId);
    console.log('Redirecting to PayFast for payment...');
}

/**
 * Generates SHA256 signature for PayFast security
 * @param {Object} data - Data object to sign
 * @param {string} merchantKey - Your merchant key
 * @returns {string} - Hexadecimal SHA256 hash
 */
function generateSignature(data, merchantKey) {
    const sortedKeys = Object.keys(data).sort();
    const dataString = sortedKeys.map(k => `${k}=${data[k]}`).join('&');
    const crypto = window.crypto || window.msCrypto;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString + merchantKey);
    return crypto.subtle.digest('SHA-256', dataBuffer).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    });
}

/**
 * Checks the status of a transaction by querying your backend
 * @param {string} transactionId - The transaction ID to check
 * @returns {Promise<Object>} - The transaction status details
 */
async function checkTransactionStatus(transactionId) {
    try {
        const response = await fetch(`/api/check-transaction?transactionId=${transactionId}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error checking transaction status:', error);
        return null;
    }
}

/**
 * Handles IPN notification received from your backend
 * You should set up an API endpoint to receive IPN and process it
 */
function handleIPNNotification(ipnData) {
    // Example: Save to your database, update order status, etc.
    console.log('Received IPN:', ipnData);
    // You can call your backend API to update order status
    fetch('/api/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ipnData)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Order status updated:', data);
        // Optionally, notify user of payment success/failure
    });
}

/**
 * Example usage:
 * initiatePayFastPayment(100.00, 'Order #1234', 'customer@example.com');
 */

// Export functions if using modules
// export { initiatePayFastPayment, checkTransactionStatus, handleIPNNotification };
