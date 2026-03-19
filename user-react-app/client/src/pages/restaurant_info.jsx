<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restaurant Info</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\nbody {\n  margin: 0;\n  font-family: Arial, sans-serif;\n  background: #f7f7f7;\n  color: #222;\n}\n\n/* HEADER */\n.header {\n  display: flex;\n  align-items: center;\n  padding: 12px;\n  background: #fff;\n  border-bottom: 1px solid #eee;\n}\n.header a {\n  text-decoration: none;\n  color: #000;\n  font-size: 18px;\n  margin-right: 10px;\n}\n.header h2 {\n  margin: 0;\n  font-size: 20px;\n}\n\n/* HERO IMAGE */\n.hero img {\n  width: 100%;\n  height: 220px;\n  object-fit: cover;\n}\n\n/* MAIN CONTAINER */\n.container {\n  padding: 15px;\n  background: #fff;\n  max-width: 800px;\n  margin: 0 auto;\n  padding-bottom: 80px; /* Space for checkout bar */\n}\n.restaurant-title {\n  font-size: 24px;\n  font-weight: bold;\n  margin-bottom: 8px;\n}\n.meta {\n  font-size: 13px;\n  color: #666;\n  margin-bottom: 10px;\n}\n.info-row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 14px;\n  padding: 10px 0;\n  border-top: 1px solid #eee;\n  border-bottom: 1px solid #eee;\n}\n.info-row a {\n  color: red;\n  text-decoration: none;\n  font-weight: bold;\n}\n.menu-section {\n  margin-top: 20px;\n}\n.menu-item {\n  display: flex;\n  justify-content: space-between;\n  padding: 12px 0;\n  border-bottom: 1px solid #eee;\n  cursor: pointer;\n}\n.menu-item:hover {\n  background: #fafafa;\n}\n\n/* CHECKOUT BAR */\n.checkout-bar {\n  position: fixed;\n  bottom: 0;\n  width: 100%;\n  background: #d32f2f;\n  color: #fff;\n  text-align: center;\n  padding: 15px;\n  font-weight: bold;\n  box-shadow: 0 -2px 5px rgba(0,0,0,0.2);\n  z-index: 100;\n}\n.checkout-bar a {\n  color: #fff;\n  text-decoration: none;\n  font-size: 16px;\n}\n\n/* FOOD MODAL */\n.food-modal {\n  display: none;\n  position: fixed;\n  z-index: 999;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0,0,0,0.6);\n  justify-content: center;\n  align-items: center;\n}\n.food-modal-content {\n  background: #fff;\n  padding: 20px;\n  width: 90%;\n  max-width: 400px;\n  border-radius: 8px;\n  position: relative;\n  box-shadow: 0 4px 10px rgba(0,0,0,0.2);\n}\n.food-close-btn {\n  position: absolute;\n  top: 10px;\n  right: 15px;\n  font-size: 24px;\n  font-weight: bold;\n  cursor: pointer;\n  color: #555;\n}\n.quantity-controls {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n  margin: 20px 0;\n}\n.quantity-btn {\n  padding: 8px 14px;\n  font-size: 16px;\n  border-radius: 4px;\n  border: 1px solid #ccc;\n  background: #fff;\n  cursor: pointer;\n}\n#foodQuantity {\n  font-size: 18px;\n  min-width: 30px;\n  text-align: center;\n}\n.options {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin-bottom: 20px;\n}\n.options label {\n  font-size: 14px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.custom-notes {\n  width: 100%;\n  padding: 8px;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  box-sizing: border-box;\n  resize: vertical;\n}\n.buttons {\n  display: flex;\n  justify-content: center;\n  gap: 15px;\n  margin-top: 20px;\n}\n.add-more-btn {\n  background: #d32f2f;\n  color: #fff;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: bold;\n}\n.exit-btn {\n  background: #ccc;\n  color: #222;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 4px;\n  cursor: pointer;\n}\n"
    }}
  />
  <div className="header">
    <a href="mainpage.html">←</a>
    <h2>Restaurant Info</h2>
  </div>
  <div className="hero">
    <img id="restaurantImage" alt="Banner" />
  </div>
  <div className="container">
    <div className="restaurant-title" id="restaurantName" />
    <div className="meta">⭐ 4.3 • ~25 min</div>
    <div className="info-row">
      <span>📍 Restaurant Info</span>
      <a id="mapLink" target="_blank">
        View Map
      </a>
    </div>
    <div className="info-row">
      <span id="deliveryTime">🚚 Deliver in 20 – 35 min</span>
      <a href="#" onclick="changeDelivery()">
        Change
      </a>
    </div>
    <div className="menu-section" id="menu" />
  </div>
  <div className="checkout-bar">
    <a href="my_order.html">Go to My Orders</a>
  </div>
  <div id="foodModal" className="food-modal">
    <div className="food-modal-content">
      <span className="food-close-btn" onclick="closeFoodModal()">
        ×
      </span>
      <h3 id="foodItemName" />
      <div className="quantity-controls">
        <button className="quantity-btn" onclick="changeQuantity(-1)">
          -
        </button>
        <span id="foodQuantity">1</span>
        <button className="quantity-btn" onclick="changeQuantity(1)">
          +
        </button>
      </div>
      <div className="options">
        <label>
          <input type="checkbox" id="extraCheese" /> Extra Cheese
        </label>
        <label>
          <input type="checkbox" id="lessSalt" /> Less Salt
        </label>
        <label>Add/Remove items:</label>
        <textarea
          id="specialInstructions"
          className="custom-notes"
          placeholder="e.g. No onions, add extra sauce..."
          rows={2}
          defaultValue={""}
        />
      </div>
      <div className="buttons">
        <button className="add-more-btn" onclick="addItemToOrder()">
          Add to Order
        </button>
        <button className="exit-btn" onclick="closeFoodModal()">
          Exit
        </button>
      </div>
    </div>
  </div>
</>
