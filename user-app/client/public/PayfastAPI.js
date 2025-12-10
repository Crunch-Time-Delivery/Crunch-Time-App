// Add event listener to your form
document.getElementById('payfastForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Your PayFast merchant details (replace with actual values if needed)
    const merchantID = 10004002;
    const merchantKey = "q1cd2rdny4a53";
    const currency = "ZAR";

    // Collect form data
    const formData = new FormData(this);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Add merchant details
    data['merchant_id'] = merchantID;
    data['merchant_key'] = merchantKey;
    data['currency'] = currency;

    // Send data to your server-side endpoint for processing
    fetch('/process-payment', { // Make sure this endpoint is properly implemented on your server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success && result.redirectUrl) {
            // Redirect user to PayFast gateway
            window.location.href = result.redirectUrl;
        } else {
            alert('Payment processing failed: ' + (result.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during payment processing.');
    });
});