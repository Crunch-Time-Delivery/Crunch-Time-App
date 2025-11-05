// payfast/payfast.js

// Function to load payment data from payfast.json
async function loadPayments() {
  const response = await fetch('payfast/payfast.json');
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.error('Failed to load payment data');
    return [];
  }
}

// Function to save payment data to payfast.json
async function savePayments(payments) {
  await fetch('payfast/savePayments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payments)
  });
}