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

/* Tip selection */
function setTip(amount, btn) {
  tip = amount;
  document.querySelectorAll(".tip-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  recalc();
}

/* Voucher input */
function openVoucher() {
  document.getElementById("voucherPopup").style.display = "flex";
}
function applyVoucher() {
  if (document.getElementById("voucherCode").value.toUpperCase() === "SAVE20") {
    discount = 20;
  }
  document.getElementById("voucherPopup").style.display = "none";
  recalc();
}

/* Toggle Card Form */
function toggleCardForm(show) {
  document.getElementById("cardForm").classList.toggle("hidden", !show);
}

/* Format Card Number */
function formatCardNumber(input) {
  input.value = input.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
}

/* PayNow - main trigger */
function payNow() {
  recalc();
  const selectedMethod = document.querySelector('input[name="paymethod"]:checked').value;
  if (selectedMethod === 'cc') {
    toggleCardForm(true);
    return;
  }
  document.getElementById("pf_method").value = selectedMethod;
  document.getElementById("payfastForm").submit();
}

/* Submit Card Payment */
function submitCardForm() {
  const selectedMethod = 'cc';
  document.getElementById("pf_method").value = selectedMethod;
  toggleCardForm(false);
  document.getElementById("payfastForm").submit();
}

/* Set tip buttons active state */
function setTip(amount, btn) {
  tip = amount;
  document.querySelectorAll(".tip-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  recalc();
}

/* Apply voucher */
function applyVoucher() {
  if (document.getElementById("voucherCode").value.toUpperCase() === "SAVE20") {
    discount = 20;
  }
  document.getElementById("voucherPopup").style.display = "none";
  recalc();
}

/* Generate Signature for PayFast */
function generateSignature(data, passphrase) {
  const sortedKeys = Object.keys(data).sort();
  const queryString = sortedKeys.map(k => `${k}=${encodeURIComponent(data[k])}`).join('&');
  const stringToHash = passphrase ? `${queryString}&passphrase=${encodeURIComponent(passphrase)}` : queryString;
  // Use crypto API for MD5
  return CryptoJS.MD5(stringToHash).toString();
}

/* Prepare and set signature for form submission */
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

/* On form submission, generate signature */
document.getElementById('payfastForm').addEventListener('submit', (e) => {
  preparePayFastSignature();
});

// Card form toggle
function toggleCardForm(show) {
  document.getElementById("cardForm").classList.toggle("hidden", !show);
}

/* Card number formatting */
function formatCardNumber(input) {
  input.value = input.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
}

// Initial recalc
recalc();