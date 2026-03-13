<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Checkout</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\nbody {margin:0;font-family:Arial;background:#f5f5f5}\n/* Your existing CSS remains unchanged */\n.hidden { display:none; }\n.container { max-width:420px; margin:auto; padding-bottom:90px; }\n.header { background:#fff; padding:15px; font-weight:bold; text-align:center; }\n/* ... rest of your CSS ... */\n.map img { width:100%; height:200px; object-fit:cover; }\n.card, .tips { background:#fff; margin:12px; padding:14px; border-radius:14px; }\n.address { display:flex; justify-content:space-between; align-items:center; }\n.voucher { background:#ffb84d; padding:14px; margin:12px; border-radius:10px; text-align:center; font-weight:bold; color:#fff; cursor:pointer; }\n.summary-row { display:flex; justify-content:space-between; margin-bottom:6px; }\n.total-row { border-top:1px dashed #ddd; padding-top:8px; font-weight:bold; font-size:16px; }\n.method { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #eee; }\n.method-left { display:flex; align-items:center; gap:10px; }\n.method img { width:32px; }\n.bottom-bar {\n  position:fixed; bottom:0; left:50%; transform:translateX(-50%);\n  width:100%; max-width:420px; background:red; color:#fff;\n  padding:16px; display:flex; justify-content:space-between;\n  font-weight:bold; cursor:pointer;\n}\n/* Tips */\n.tip-options { display:flex; gap:10px; margin-top:10px; }\n.tip-btn {\n  flex:1; padding:10px; border-radius:10px;\n  border:1px solid #ddd; background:#fff;\n  cursor:pointer; font-weight:bold;\n}\n.tip-btn.active { background:red; color:#fff; border-color:red; }\n/* Popup */\n.popup-overlay {\n  position:fixed; inset:0; background:rgba(0,0,0,.5);\n  display:none; align-items:center; justify-content:center; z-index:1000;\n}\n.popup {\n  background:#fff; padding:16px; width:280px; border-radius:12px;\n}\n.popup input, .popup button {\n  width:100%; padding:10px; margin-top:10px;\n}\n"
    }}
  />
  <div className="container">
    <div className="header">Checkout</div>
    {/* MAP */}
    <div className="map">
      <img id="staticMap" src="" alt="Delivery Map" />
    </div>
    {/* ADDRESS */}
    <div className="card address">
      <div>
        <strong id="deliveryAddress">Loading address...</strong>
        <br />
        <small>Delivery 25 – 35 min</small>
      </div>
      ✏️
    </div>
    <div className="voucher" onclick="openVoucher()">
      Input voucher coupon
    </div>
    {/* Tips */}
    <div className="tips">
      <strong>Add a tip for your driver</strong>
      <div className="tip-options">
        <button className="tip-btn" onclick="setTip(5,this)">
          R5
        </button>
        <button className="tip-btn" onclick="setTip(10,this)">
          R10
        </button>
        <button className="tip-btn" onclick="setTip(15,this)">
          R15
        </button>
      </div>
    </div>
    {/* SUMMARY */}
    <div className="card">
      <div className="summary-row">
        <span>Subtotal</span>
        <span id="subtotal">R0.00</span>
      </div>
      <div className="summary-row">
        <span>Delivery Discount</span>
        <span id="discount">R0.00</span>
      </div>
      <div className="summary-row">
        <span>Service Fee</span>
        <span>R10.00</span>
      </div>
      <div className="summary-row">
        <span>Delivery Fee</span>
        <span>R20.00</span>
      </div>
      <div className="summary-row">
        <span>Tip</span>
        <span id="tipAmount">R0.00</span>
      </div>
      <div className="summary-row total-row">
        <span>Total</span>
        <span id="total">R0.00</span>
      </div>
    </div>
    {/* PAYMENT FORM + Methods */}
    <form
      id="payfastForm"
      method="POST"
      action="https://sandbox.payfast.co.za/eng/process"
    >
      {/* PayFast hidden fields */}
      <input type="hidden" name="merchant_id" defaultValue={10000100} />
      <input type="hidden" name="merchant_key" defaultValue="46f0cd694581a" />
      <input type="hidden" name="amount" id="pf_amount" defaultValue={150.0} />
      <input type="hidden" name="item_name" defaultValue="CrunchTime Order" />
      <input
        type="hidden"
        name="item_description"
        defaultValue="Food delivery checkout"
      />
      <input
        type="hidden"
        name="payment_method"
        id="pf_method"
        defaultValue="eft"
      />
      <input type="hidden" name="signature" id="pf_signature" />
      <input
        type="hidden"
        name="return_url"
        defaultValue="http://127.0.0.1:5501/user-app/client/public/checkout_order.html"
      />
      <input
        type="hidden"
        name="cancel_url"
        defaultValue="http://127.0.0.1:5501/user-app/client/public/index.html"
      />
      <input
        type="hidden"
        name="notify_url"
        defaultValue="https://example.com/notify"
      />
      {/* Payment methods */}
      <div className="card">
        {/* Instant EFT */}
        <div className="method">
          <div className="method-left">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" />
            Instant EFT (Company Account)
          </div>
          <input
            type="radio"
            name="paymethod"
            defaultValue="eft"
            defaultChecked=""
            onchange="toggleCardForm(false)"
          />
        </div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>
          Bank: ABSA • Account Name: CrunchTime • Acc #: 1234567890
        </div>
        {/* Card Payment */}
        <div className="method">
          <div className="method-left">
            <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" />
            Card Payment (Visa / MasterCard / Amex)
          </div>
          <input
            type="radio"
            name="paymethod"
            defaultValue="cc"
            onchange="toggleCardForm(true)"
          />
        </div>
        {/* Card Input Form (hidden toggle) */}
        <div className="card hidden" id="cardForm">
          <strong>Enter Card Details</strong>
          <input
            type="text"
            id="cardNumber"
            placeholder="Card Number"
            maxLength={19}
            oninput="formatCardNumber(this)"
          />
          <input type="text" placeholder="Cardholder Name" />
          <div style={{ display: "flex", gap: 10 }}>
            <input type="text" placeholder="MM/YY" maxLength={5} />
            <input type="password" placeholder="CVV" maxLength={4} />
          </div>
          <small style={{ color: "#777" }}>
            🔒 Secure payment processed by PayFast
          </small>
          <button
            type="button"
            onclick="submitCardForm()"
            style={{
              marginTop: 10,
              background: "red",
              color: "#fff",
              padding: 10,
              border: "none",
              width: "100%",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Submit Card &amp; Pay
          </button>
        </div>
      </div>
    </form>
    <div className="bottom-bar" onclick="payNow()">
      <span>Place Order</span>
      <span id="barTotal">R0.00</span>
    </div>
    {/* Voucher Popup */}
    <div className="popup-overlay" id="voucherPopup">
      <div className="popup">
        <strong>Enter Voucher Code</strong>
        <input id="voucherCode" placeholder="SAVE20" />
        <button onclick="applyVoucher()">Apply</button>
      </div>
    </div>
    {/* Scripts */}
  </div>
</>
