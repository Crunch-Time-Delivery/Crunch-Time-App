<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Orders</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n/* Your existing CSS remains unchanged */\n* { box-sizing: border-box; }\nbody {\n  margin: 0;\n  font-family: Arial, sans-serif;\n  background: #f5f5f5;\n}\n\n/* HEADER */\nheader {\n  display: flex;\n  align-items: center;\n  padding: 14px;\n  background: #fff;\n}\nheader button {\n  background: none;\n  border: none;\n  font-size: 20px;\n  cursor: pointer;\n}\nheader h1 {\n  flex: 1;\n  text-align: center;\n  margin: 0;\n  font-size: 18px;\n}\n\n/* TABS */\n.tab-container {\n  display: flex;\n  margin: 15px;\n  background: #eee;\n  border-radius: 14px;\n  overflow: hidden;\n}\n.tab {\n  flex: 1;\n  padding: 12px 0;\n  text-align: center;\n  font-weight: 600;\n  cursor: pointer;\n}\n.tab.active.in-progress {\n  background: red;\n  color: #fff;\n}\n.tab.active.completed {\n  background: #ffcc00;\n}\n\n/* CONTENT */\n.content {\n  margin: 15px;\n}\n\n/* CART CARD */\n.cart-card {\n  background: #fff;\n  border-radius: 18px;\n  padding: 15px;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.08);\n}\n.cart-header {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 10px;\n}\n.timer {\n  color: red;\n  font-weight: bold;\n}\n\n/* CART ITEM */\n.cart-item {\n  display: flex;\n  margin-top: 12px;\n}\n.cart-item img {\n  width: 80px;\n  height: 80px;\n  border-radius: 14px;\n  object-fit: cover;\n}\n.item-info {\n  flex: 1;\n  margin-left: 12px;\n}\n.item-top {\n  display: flex;\n  justify-content: space-between;\n}\n.item-title {\n  font-weight: bold;\n}\n.remove-btn {\n  background: none;\n  border: none;\n  color: red;\n  font-weight: bold;\n  cursor: pointer;\n}\n.price-row {\n  margin-top: 4px;\n  font-weight: bold;\n}\n.qty-controls {\n  display: flex;\n  align-items: center;\n  margin-top: 8px;\n}\n.qty-controls button {\n  width: 30px;\n  height: 30px;\n  border: none;\n  border-radius: 8px;\n  background: #eee;\n  font-size: 18px;\n  cursor: pointer;\n}\n.qty-controls span {\n  margin: 0 12px;\n  font-weight: bold;\n}\n\n/* CHECKOUT BAR */\n.checkout-bar {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: #fff;\n  display: flex;\n  justify-content: space-between;\n  padding: 15px;\n  box-shadow: 0 -3px 10px rgba(0,0,0,0.1);\n}\n.checkout-btn, .addon-btn {\n  border: none;\n  padding: 12px 20px;\n  border-radius: 12px;\n  cursor: pointer;\n  font-weight: bold;\n}\n.checkout-btn {\n  background: red;\n  color: #fff;\n}\n.addon-btn {\n  background: #ff0011;\n  color: #fff;\n  margin-right: 10px;\n}\n\n/* MODAL */\n.modal-overlay {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(0,0,0,0.6);\n  z-index: 9999;\n  justify-content: center;\n  align-items: center;\n}\n.modal {\n  position: relative;\n  width: 90%;\n  max-width: 500px;\n  height: 80%;\n  background: #fff;\n  border-radius: 16px;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  padding: 12px;\n  border-bottom: 1px solid #eee;\n}\n.modal iframe {\n  flex: 1;\n  border: none;\n}\n"
    }}
  />
  <header>
    <button onclick="goBack()">←</button>
    <h1>My Orders</h1>
  </header>
  <div className="tab-container">
    <div className="tab in-progress active" onclick="setTab('inProgress')">
      In Progress
    </div>
    <div className="tab completed" onclick="setTab('completed')">
      Completed
    </div>
  </div>
  <div id="inProgress" className="content">
    <div className="cart-card">
      <div className="cart-header">
        <strong>My Cart</strong>
        <span className="timer">35 min</span>
      </div>
      <div id="cartItems" />
    </div>
  </div>
  <div id="completed" className="content" style={{ display: "none" }}>
    <p style={{ textAlign: "center", color: "#777" }}>
      No completed orders yet
    </p>
  </div>
  <div className="checkout-bar">
    <button className="addon-btn" onclick="openAddonMenu()">
      + Add-on Menu
    </button>
    <strong id="totalPrice">R0.00</strong>
    <button className="checkout-btn" onclick="goToCheckout()">
      Checkout
    </button>
  </div>
  {/* ADD-ON MODAL */}
  <div id="addonModal" className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <strong>Select Items</strong>
        <button onclick="closeAddonMenu()">✕</button>
      </div>
      <iframe
        id="addonIframe"
        src="http://127.0.0.1:5501/user-app/client/public/restaurant_info.html"
      />
    </div>
  </div>
</>
