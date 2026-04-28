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
  const selectedMethod = document.querySelector('input[name="paymethod"]:checked').value;
  if (selectedMethod === 'cc') {
    toggleCardForm(true);
    return;
  }
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

// ======================= Signature Generation for PayFast =======================
function generateSignature(data, passphrase) {
  const sortedKeys = Object.keys(data).sort();
  const queryString = sortedKeys.map(k => `${k}=${encodeURIComponent(data[k])}`).join('&');
  const stringToHash = passphrase ? `${queryString}&passphrase=${encodeURIComponent(passphrase)}` : queryString;
  
  // Using CryptoJS MD5 (ensure CryptoJS is loaded)
  return CryptoJS.MD5(stringToHash).toString();
}

// Prepare signature before form submission
function preparePayFastSignature() {
  const data = {
    merchant_id: '10000100',
    merchant_key: '46f0cd694581a',
    amount: document.getElementById('pf_amount').value,
    item_name: 'CrunchTime Order',
    item_description: 'Food delivery checkout',
    payment_method: document.querySelector('input[name="paymethod"]:checked').value
  };
  const passphrase = 'jt7NOE43FZPn';
  const signature = generateSignature(data, passphrase);
  document.getElementById('pf_signature').value = signature;
}

// Attach signature generation to form submit
document.getElementById('payfastForm').addEventListener('submit', () => {
  preparePayFastSignature();
});

// ======================= Utility: Card Number Formatting =======================
function formatCardNumber(input) {
  input.value = input.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
}

// ======================= Initial Call =======================
recalc(); // Call recalc initially to set totals