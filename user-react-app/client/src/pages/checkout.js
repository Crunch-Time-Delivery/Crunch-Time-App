// Utility functions
function generateSignature(data, passPhrase = null) {
    let pfOutput = '';
    for (const [key, val] of Object.entries(data)) {
        if (val !== '') {
            pfOutput += `${key}=${encodeURIComponent(val.trim())}&`;
        }
    }
    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
        getString += `&passphrase=${encodeURIComponent(passPhrase.trim())}`;
    }
    // For MD5 hashing, we use CryptoJS
    return CryptoJS.MD5(getString).toString();
}

// On page load, retrieve cart total
window.addEventListener('DOMContentLoaded', () => {
  const savedSubtotal = localStorage.getItem('cartTotal');
  let savedAmount = parseFloat(savedSubtotal);
  if (isNaN(savedAmount)) savedAmount = 0;
  subtotal = savedAmount;
  document.getElementById('subtotal').innerText = "R" + subtotal.toFixed(2);
  recalc();
});

// Variables
let subtotal = 0; // will be set from localStorage
let discount = 0;
let tip = 0;
const serviceFee = 10;
const deliveryFee = 20;

/* Recalculate total */
function recalc() {
  const total = subtotal - discount + serviceFee + deliveryFee + tip;
  document.getElementById("subtotal").innerText = "R" + subtotal.toFixed(2);
  document.getElementById("discount").innerText = "-R" + discount.toFixed(2);
  document.getElementById("tipAmount").innerText = "R" + tip.toFixed(2);
  document.getElementById("total").innerText = "R" + total.toFixed(2);
  document.getElementById("barTotal").innerText = "R" + total.toFixed(2);
  document.getElementById("pf_amount").value = total.toFixed(2);
}
// ======================= Tip Selection =======================
function setTip(amount, btn) {
  window.tip = amount; // Assuming tip is a global variable
  document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  recalc(); // Recalculate totals
}

// ======================= Voucher Input =======================
function openVoucher() {
  document.getElementById('voucherPopup').style.display = 'flex';
}

function applyVoucher() {
  const code = document.getElementById('voucherCode').value.trim().toUpperCase();
  if (code === 'SAVE20') {
    window.discount = 20; // Assuming discount is a global variable
  } else {
    window.discount = 0;
  }
  document.getElementById('voucherPopup').style.display = 'none';
  recalc();
}

// ======================= Toggle Card Form =======================
function toggleCardForm(show) {
  document.getElementById('cardForm').classList.toggle('hidden', !show);
}

// ======================= Card Number Formatting =======================
function formatCardNumber(input) {
  input.value = input.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
}
// ======================= Main Payment Trigger =======================
function payNow() {
  recalc();

  const selectedMethodInput = document.querySelector('input[name="paymethod"]:checked');
  if (!selectedMethodInput) {
    alert('Please select a payment method.');
    return;
  }

  const selectedMethod = selectedMethodInput.value;

  if (selectedMethod === 'cc') {
    toggleCardForm(true);
    return;
  }

  // Set payment method and submit form for other methods
  document.getElementById('pf_method').value = selectedMethod;
  document.getElementById('payfastForm').submit();
}

// ======================= Submit Card Payment =======================
function submitCardForm() {
  const selectedMethod = 'cc';
  document.getElementById('pf_method').value = selectedMethod;
  toggleCardForm(false);
  document.getElementById('payfastForm').submit();
}

// ======================= Generate Signature with SHA-256 =======================
async function generateSignature(data, passphrase) {
  const stringToSign = Object.values(data).join(':') + ':' + passphrase;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// ======================= Prepare Payment Signature =======================
async function preparePayFastSignature() {
  try {
    const amount = document.getElementById('pf_amount').value;
    const paymentMethod = document.querySelector('input[name="paymethod"]:checked')?.value || '';

    const data = {
      merchant_id: '10000100',
      merchant_key: '46f0cd694581a',
      amount: amount,
      item_name: 'CrunchTime Order',
      item_description: 'Food delivery checkout',
      payment_method: paymentMethod,
    };

    const passphrase = 'jt7NOE43FZPn';

    const signature = await generateSignature(data, passphrase);
    document.getElementById('pf_signature').value = signature;
  } catch (error) {
    console.error('Error generating signature:', error);
    alert('Error generating payment signature.');
  }
}

// ======================= Utility: Card Number Formatting =======================
function formatCardNumber(input) {
  input.value = input.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
}

// ======================= Utility: Toggle Card Form =======================
function toggleCardForm(show) {
  const cardFormContainer = document.getElementById('cardFormContainer');
  if (cardFormContainer) {
    cardFormContainer.style.display = show ? 'block' : 'none';
  }
}

// ======================= Usage =======================
// Call toggleCardForm(true/false) when needed, e.g., on button clicks.
const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Ensure this environment variable is set

const supabase = createClient(supabaseUrl, supabaseKey);
// Backend process and redirect
function backendProcessAndRedirect() {
  const formData = new FormData(document.getElementById('payfastForm'));
  const dataObj = {};
  formData.forEach((value, key) => { dataObj[key] = value; });

  fetch('/process-payment', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dataObj)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      document.getElementById('payfastForm').submit();
    } else {
      alert('Payment failed: ' + result.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error processing payment.');
  });
}
// Import necessary modules (make sure to install @supabase/supabase-js if not already)
const { createClient } = require('@supabase/supabase-js');
// Import your Twilio functions
const { sendSMS, notifyUser } = require('./twilioFunctions'); // replace with your actual path


// Function to fetch phone numbers from Supabase
async function fetchPhoneNumbers() {
  const { data, error } = await supabase
    .from('User') // replace with your table name if different
    .select('phone_number'); // replace with your column name if different

  if (error) {
    console.error('Error fetching phone numbers:', error);
    return [];
  }
  return data.map(row => row.phone_number);
}

// Function to send SMS to all fetched phone numbers
async function sendSmsToAll() {
  const phoneNumbers = await fetchPhoneNumbers();

  for (const number of phoneNumbers) {
    await sendSMS({ to: number, message: 'Your message here' });
  }
}

// Function to call all Twilio-related functions
async function callAllTwilioFunctions() {
  try {
    // Send SMS to all numbers from database
    await sendSmsToAll();
    // Example of calling another notification function
    await notifyUser({ userId: 'user123', message: 'Notification message' });
    console.log('All functions called successfully.');
  } catch (error) {
    console.error('Error calling functions:', error);
  }
}

// Run the combined process
callAllTwilioFunctions();
// Optional: handle callback
function handlePayFastCallback() {
  console.log('Received callback from PayFast');
}

// Example: Save order to Supabase
async function saveOrderToSupabase(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData]);

  if (error) {
    console.error('Error saving order:', error);
  } else {
    console.log('Order saved:', data);
  }
}
// Initial recalc
recalc();

