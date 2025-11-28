document.getElementById('payfastForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Your PayFast merchant details (replace with actual values)
    const merchantID: "10004002 ";
 const  merchantKey: "q1cd2rdny4a53 ";
    const currency = "ZAR";

    // Collect form data
    const formData = new FormData(this);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Include merchant details in data if needed
    data['merchant_id'] = merchantID;
    data['merchant_key'] = merchantKey;
    data['currency'] = currency;

    // Send data to your server-side endpoint
    fetch('/process-payment', { // Replace with your actual server endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success && result.redirectUrl) {
            // Redirect to PayFast gateway or a success page
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
