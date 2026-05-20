// ======================= Utility Functions =======================

/**
 * Generate MD5 hash signature for payment data.
 * @param {Object} data - Payment data object.
 * @param {string|null} passPhrase - Optional passphrase.
 * @returns {string} - MD5 hash signature.
 */
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
  // Using CryptoJS MD5 hashing
  return CryptoJS.MD5(getString).toString();
}

/**
 * Recursively recalculate totals (called on page load and updates).
 */
function recalc() {
  const subtotal = parseFloat(localStorage.getItem('cartTotal')) || 0;
  const discount = window.discount || 0;
  const tip = window.tip || 0;
  const serviceFee = 10;
  const deliveryFee = 20;

  const total = subtotal - discount + serviceFee + deliveryFee + tip;

  document.getElementById('subtotal').innerText = `R${subtotal.toFixed(2)}`;
  document.getElementById('discount').innerText = `-R${discount.toFixed(2)}`;
  document.getElementById('tipAmount').innerText = `R${tip.toFixed(2)}`;
  document.getElementById('total').innerText = `R${total.toFixed(2)}`;
  document.getElementById('barTotal').innerText = `R${total.toFixed(2)}`;
  document.getElementById('pf_amount').value = total.toFixed(2);
}

/**
 * Set tip amount and update UI.
 * @param {number} amount - Tip amount.
 * @param {HTMLElement} btn - Button element clicked.
 */
function setTip(amount, btn) {
  window.tip = amount;
  document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  recalc();
}

/**
 * Open voucher popup.
 */
function openVoucher() {
  document.getElementById('voucherPopup').style.display = 'flex';
}

/**
 * Apply voucher code for discount.
 */
function applyVoucher() {
  const code = document.getElementById('voucherCode').value.trim().toUpperCase();
  window.discount = (code === 'SAVE20') ? 20 : 0;
  document.getElementById('voucherPopup').style.display = 'none';
  recalc();
}

/**
 * Show or hide the card input form.
 * @param {boolean} show - Whether to show the form.
 */
function toggleCardForm(show) {
  document.getElementById('cardForm').classList.toggle('hidden', !show);
}

/**
 * Format credit card number input.
 * @param {HTMLInputElement} input - Card number input element.
 */
function formatCardNumber(input) {
  input.value = input.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
}

// ======================= Payment Processing =======================

/**
 * Initiate payment based on selected method.
 */
function payNow() {
  recalc();

  const selectedMethodInput = document.querySelector('input[name="paymethod"]:checked');
  if (!selectedMethodInput) {
    alert('Please select a payment method.');
    return;
  }
  const method = selectedMethodInput.value;

  if (method === 'cc') {
    toggleCardForm(true);
    return;
  }

  // Set payment method for backend
  document.getElementById('pf_method').value = method;
  // Submit form or process payment
  document.getElementById('payfastForm').submit();
}

/**
 * Handle card payment submission.
 */
function submitCardForm() {
  document.getElementById('pf_method').value = 'cc';
  toggleCardForm(false);
  document.getElementById('payfastForm').submit();
}

/**
 * Generate MD5 signature for PayFast.
 * @param {Object} data - Payment data.
 * @param {string} passPhrase - Secret passphrase.
 * @returns {string} - MD5 hash signature.
 */
function generateSignature(data, passPhrase) {
  let stringToSign = '';
  for (const [key, val] of Object.entries(data)) {
    if (val !== '') {
      stringToSign += `${key}=${encodeURIComponent(val.trim())}&`;
    }
  }
  stringToSign = stringToSign.slice(0, -1);
  if (passPhrase) {
    stringToSign += `&passphrase=${encodeURIComponent(passPhrase.trim())}`;
  }
  return CryptoJS.MD5(stringToSign).toString();
}

/**
 * Prepare and set the signature before payment.
 */
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

    const signature = generateSignature(data, passphrase);
    document.getElementById('pf_signature').value = signature;
  } catch (err) {
    console.error('Error generating signature:', err);
    alert('Error generating payment signature.');
  }
}

// ======================= Initialize on Page Load =======================

window.addEventListener('DOMContentLoaded', () => {
  // Retrieve cart total from localStorage
  const savedSubtotal = localStorage.getItem('cartTotal');
  let amount = parseFloat(savedSubtotal);
  if (isNaN(amount)) amount = 0;
  window.subtotal = amount;
  document.getElementById('subtotal').innerText = `R${amount.toFixed(2)}`;
  recalc();
});

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

