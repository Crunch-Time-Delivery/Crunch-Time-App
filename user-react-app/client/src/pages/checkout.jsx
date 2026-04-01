import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const CheckoutPage = () => {
  // State variables
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const [total, setTotal] = useState(0);
  const [pfAmount, setPfAmount] = useState('0.00');
  const [payMethod, setPayMethod] = useState('eft');
  const [signature, setSignature] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [cardFormVisible, setCardFormVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [selectedTip, setSelectedTip] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const serviceFee = 10;
  const deliveryFee = 20;

  // Load cart total from localStorage
  useEffect(() => {
    const savedSubtotal = localStorage.getItem('cartTotal');
    const amount = parseFloat(savedSubtotal);
    if (!isNaN(amount)) {
      setSubtotal(amount);
    }
  }, []);

  // Recalculate total whenever dependencies change
  useEffect(() => {
    const newTotal = subtotal - discount + serviceFee + deliveryFee + tip;
    setTotal(newTotal);
    setPfAmount(newTotal.toFixed(2));
  }, [subtotal, discount, tip]);

  // Generate signature for PayFast
  const generateSignature = (data, passphrase = null) => {
    let pfOutput = '';
    for (const [key, val] of Object.entries(data)) {
      if (val !== '') {
        pfOutput += `${key}=${encodeURIComponent(val.trim())}&`;
      }
    }
    let getString = pfOutput.slice(0, -1);
    if (passphrase) {
      getString += `&passphrase=${encodeURIComponent(passphrase.trim())}`;
    }
    return CryptoJS.MD5(getString).toString();
  };

  // Handle Tip selection
  const handleTipClick = (amount) => {
    setTip(amount);
    setSelectedTip(amount);
  };

  // Handle voucher application
  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
    } else {
      setDiscount(0);
    }
    setShowVoucherPopup(false);
  };

  // Toggle Card Form
  const toggleCardForm = (show) => {
    setCardFormVisible(show);
  };

  // Format Card Number
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  // Prepare signature before submitting
  const preparePayFastSignature = () => {
    const data = {
      merchant_id: '10000100',
      merchant_key: '46f0cd694581a',
      amount: pfAmount,
      item_name: 'CrunchTime Order',
      item_description: 'Food delivery checkout',
      payment_method: payMethod,
    };
    const passphrase = 'jt7NOE43FZPn';
    const sig = generateSignature(data, passphrase);
    setSignature(sig);
  };

  // Handle form submission (simulate backend processing)
  const handleSubmit = () => {
    preparePayFastSignature();
    // Simulate backend process
    backendProcessAndRedirect();
  };
const apiKey = 'AIzaSyB9sNhi824hNncjfW7HHzaI_s8JtWGfM0Q';

  // Example user_id_location object with latitude and longitude
  const user_id_location = {
    latitude: -33.9249,
    longitude: 18.4241
  };

  // Extract lat and lng from user_id_location
  const lat = user_id_location.latitude;
  const lng = user_id_location.longitude;

  // Generate the static map URL centered on user location
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=600x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

  // Set the src attribute of the image
  document.getElementById('staticMap').src = staticMapUrl;

  const backendProcessAndRedirect = () => {
    // Collect form data
    const formData = {
      merchant_id: '10000100',
      merchant_key: '46f0cd694581a',
      amount: pfAmount,
      item_name: 'CrunchTime Order',
      item_description: 'Food delivery checkout',
      payment_method: payMethod,
      signature: signature,
    };
    // Send to backend (simulate)
    fetch('/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          // Submit the form to PayFast
          document.getElementById('payfast-form').submit();
        } else {
          alert('Payment failed: ' + result.message);
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('Error processing payment.');
      });
  };

  // Handle Place Order
  const handlePlaceOrder = () => {
    if (payMethod === 'cc') {
      toggleCardForm(true);
    } else {
      handleSubmit();
    }
  };

  // Handle Card Payment Submit
  const handleCardPayment = () => {
    setPayMethod('cc');
    toggleCardForm(false);
    handleSubmit();
  };

  return (
    <div style={{ fontFamily: 'Arial', background: '#f5f5f5', margin: 0 }}>
      <div style={{ maxWidth: 420, margin: 'auto', paddingBottom: 90 }}>
        <div style={{ background: '#fff', padding: 15, fontWeight: 'bold', textAlign: 'center' }}>Checkout</div>
        {/* MAP */}
        <div className="map">
          <img src="" alt="Delivery Map" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
        </div>
        {/* ADDRESS */}
        <div className="card address" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: '#fff', margin: 12, borderRadius: 14 }}>
          <div>
            <strong id="deliveryAddress">Loading address...</strong>
            <br />
            <small>Delivery 25 – 35 min</small>
          </div>
          <div style={{ cursor: 'pointer' }}>✏️</div>
        </div>
        {/* Voucher */}
        <div
          className="voucher"
          style={{
            background: '#ffb84d',
            padding: 14,
            margin: 12,
            borderRadius: 10,
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setShowVoucherPopup(true)}
        >
          Input voucher coupon
        </div>
        {/* Tips */}
        <div style={{ background: '#fff', margin: 12, padding: 14, borderRadius: 14 }}>
          <strong>Add a tip for your driver</strong>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            {[5, 10, 15].map((amount) => (
              <button
                key={amount}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: '1px solid #ddd',
                  background: selectedTip === amount ? 'red' : '#fff',
                  color: selectedTip === amount ? '#fff' : '#000',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
                onClick={() => handleTipClick(amount)}
              >
                R{amount}
              </button>
            ))}
          </div>
        </div>
        {/* Summary */}
        <div style={{ background: '#fff', margin: 12, padding: 14, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span>Subtotal</span>
            <span id="subtotal">R{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span>Delivery Discount</span>
            <span id="discount">-R{discount.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span>Service Fee</span>
            <span>R{serviceFee.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span>Delivery Fee</span>
            <span>R{deliveryFee.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span>Tip</span>
            <span id="tipAmount">R{tip.toFixed(2)}</span>
          </div>
          <div style={{ borderTop: '1px dashed #ddd', paddingTop: 8, fontWeight: 'bold', fontSize: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <span id="total">R{total.toFixed(2)}</span>
          </div>
        </div>
        {/* Payment Form */}
        <form
          id="payfast-form"
          style={{ display: 'none' }}
          method="POST"
          action="https://sandbox.payfast.co.za/eng/process"
        >
          <input type="hidden" name="merchant_id" value="10000100" />
          <input type="hidden" name="merchant_key" value="46f0cd694581a" />
          <input type="hidden" name="amount" value={pfAmount} />
          <input type="hidden" name="item_name" value="CrunchTime Order" />
          <input type="hidden" name="item_description" value="Food delivery checkout" />
          <input type="hidden" name="payment_method" value={payMethod} />
          <input type="hidden" name="signature" value={signature} />
          <input type="hidden" name="return_url" value="http://127.0.0.1:5501/user-app/client/public/checkout_order.html" />
          <input type="hidden" name="cancel_url" value="http://127.0.0.1:5501/user-app/client/public/index.html" />
          <input type="hidden" name="notify_url" value="https://example.com/notify" />
        </form>
        {/* Visible Button to trigger payment */}
        <div
          className="bottom-bar"
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 420,
            background: 'red',
            color: '#fff',
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={handlePlaceOrder}
        >
          <span>Place Order</span>
          <span id="barTotal">R{total.toFixed(2)}</span>
        </div>
        {/* Voucher Popup */}
        {showVoucherPopup && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowVoucherPopup(false)}
          >
            <div
              style={{
                background: '#fff',
                padding: 16,
                width: 280,
                borderRadius: 12,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <strong>Enter Voucher Code</strong>
              <input
                style={{ width: '100%', padding: 10, marginTop: 10 }}
                placeholder="SAVE20"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
              />
              <button
                style={{
                  width: '100%',
                  padding: 10,
                  marginTop: 10,
                  background: 'blue',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
                onClick={handleApplyVoucher}
              >
                Apply
              </button>
            </div>
          </div>
        )}
        {/* Card Form */}
        {cardFormVisible && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => toggleCardForm(false)}
          >
            <div
              style={{
                background: '#fff',
                padding: 16,
                width: 300,
                borderRadius: 12,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <strong>Enter Card Details</strong>
              <input
                style={{ width: '100%', padding: 10, marginTop: 10 }}
                placeholder="Card Number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
              />
              <input style={{ width: '100%', padding: 10, marginTop: 10 }} placeholder="Cardholder Name" />
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <input style={{ flex: 1, padding: 10 }} placeholder="MM/YY" maxLength={5} />
                <input style={{ flex: 1, padding: 10 }} placeholder="CVV" maxLength={4} type="password" />
              </div>
              <small style={{ color: '#777', display: 'block', marginTop: 10 }}>
                🔒 Secure payment processed by PayFast
              </small>
              <button
                style={{
                  width: '100%',
                  padding: 10,
                  marginTop: 10,
                  background: 'red',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
                onClick={handleCardPayment}
              >
                Submit Card & Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;