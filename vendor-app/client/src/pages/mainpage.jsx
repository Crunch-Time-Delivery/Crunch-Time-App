<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vendor App</title>
  {/* Font Awesome */}
  {/* Supabase SDK */}
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  body { font-family: sans-serif; background:#f0f0f0; margin:0; }\n  .header { position: fixed; top:0; width:100%; height:60px; background:#fff; display:flex; align-items:center; justify-content:space-between; padding:0 20px; box-shadow:0 2px 4px rgba(0,0,0,0.1); z-index:999; }\n  .vendor-text { font-weight:bold; color:red; font-size:1.2em; }\n  .menu-container { display: flex; align-items: center; position: relative; margin-left: -20px; }\n  .profile-btn { background:#ff0000; color:#fff; padding:8px 12px; border:none; border-radius:50px; cursor:pointer; }\n  .dropdown { display:none; position:absolute; right:20px; top:60px; background:#fff; border:1px solid #ddd; border-radius:8px; box-shadow:0 4px 8px rgba(0,0,0,0.2); min-width:200px; z-index:1000; }\n  .dropdown.show { display:block; }\n  .dropdown a { display:block; padding:10px 15px; text-decoration:none; color:#333; }\n  .dropdown a:hover { background:#f0f0f0; }\n  .container { margin-top:80px; padding:20px; max-width:1200px; margin-left:auto; margin-right:auto; background:#fff; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1); }\n  /* Buttons */\n  .section { margin-top:20px; }\n  .red-button { background-color: #f60202; color: #fff; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 1em; margin: 10px 0; }\n  /* Forms */\n  .form-container { background: #fff; padding: 20px; border-radius: 8px; max-width: 500px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n  .form-container input, .form-container select, .form-container textarea { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }\n  /* Table styles */\n  table { width:100%; border-collapse:collapse; margin-top:10px; }\n  th, td { border:1px solid #ccc; padding:8px; }\n  th { background:#f0f0f0; }\n  /* Payment status badges */\n  .badge { padding: 4px 8px; border-radius: 4px; color: #fff; font-weight: bold; font-size: 0.9em; display:inline-block; }\n  .status-success { background-color: #4CAF50; }\n  .status-pending { background-color: #FFC107; }\n"
    }}
  />
  {/* Notification Message */}
  <div id="notificationMessage" />
  {/* Header */}
  <div className="header">
    <div className="vendor-text">Vendor</div>
    <div className="menu-container">
      <button
        className="profile-btn"
        id="profileBtn"
        onclick="toggleDropdown()"
      >
        <i className="fas fa-user-circle" /> Menu
      </button>
      <div className="dropdown" id="profileDropdown">
        <a href="#" onclick="showManagement('items'); return false;">
          Manage Items
        </a>
        <a href="#" onclick="showManagement('orders'); return false;">
          Manage Orders
        </a>
        <a href="#" onclick="showManagement('payment'); return false;">
          Payment History
        </a>
        <a href="#" onclick="logout(); return false;">
          Logout
        </a>
      </div>
    </div>
  </div>
  <div className="container">
    {/* Management Buttons */}
    <div className="management-buttons">
      <button className="red-button" onclick="showSection('menuUpload')">
        Upload Restaurant Menu
      </button>
      <button className="red-button" onclick="showSection('restaurantInfo')">
        Enter Restaurant Info
      </button>
      <button className="red-button" onclick="showSection('addItem')">
        Add Item
      </button>
      <button className="red-button" onclick="showSection('addOrder')">
        Add Order
      </button>
      <button className="red-button" onclick="showManagement('payment')">
        Payment History
      </button>
    </div>
    {/* Sections */}
    <div
      id="section-menuUpload"
      className="section"
      style={{ display: "none" }}
    >
      <h3>Upload Restaurant Menu (PDF)</h3>
      <div className="form-container">
        <input type="text" id="restaurantName" placeholder="Restaurant Name" />
        <input type="file" id="menuFile" accept="application/pdf" />
        <button className="red-button" onclick="uploadMenu()">
          Upload Menu
        </button>
      </div>
    </div>
    <div
      id="section-restaurantInfo"
      className="section"
      style={{ display: "none" }}
    >
      <h3>Enter Restaurant Details</h3>
      <div className="form-container">
        <input type="text" id="restName" placeholder="Restaurant Name" />
        <input type="text" id="contact" placeholder="Contact" />
        <input type="text" id="website" placeholder="Website" />
        <input type="text" id="address" placeholder="Address" />
        <button className="red-button" onclick="saveRestaurantInfo()">
          Save Details
        </button>
      </div>
    </div>
    {/* Add Item */}
    <div id="section-addItem" className="section" style={{ display: "none" }}>
      <h3>Add Menu Item</h3>
      <div className="form-container">
        <input
          type="text"
          id="itemVendor"
          placeholder="Restaurant / Vendor Name"
        />
        <input
          type="text"
          id="itemName"
          placeholder="Item Name (e.g. Chicken Burger)"
        />
        <textarea
          id="itemDescription"
          placeholder="Item Description"
          defaultValue={""}
        />
        <select id="itemCategory">
          <option value="">Select Category</option>
          <option value="Fast Food">Fast Food</option>
          <option value="Burgers">Burgers</option>
          <option value="Pizza">Pizza</option>
          <option value="Healthy">Healthy</option>
          <option value="Asian">Asian</option>
        </select>
        <input type="number" id="itemPrice" placeholder="Price (ZAR)" />
        <input
          type="number"
          id="itemDiscount"
          placeholder="Discount % (optional)"
        />
        <input
          type="text"
          id="itemPortion"
          placeholder="Portion Size (e.g. Large)"
        />
        <input type="number" id="prepTime" placeholder="Prep Time (minutes)" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <label>
            <input type="checkbox" id="isVeg" /> Vegetarian
          </label>
          <label>
            <input type="checkbox" id="isSpicy" /> Spicy
          </label>
        </div>
        <select id="itemStock">
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
        <button className="red-button" onclick="addItem()">
          Save Item
        </button>
      </div>
    </div>
    {/* Add Order */}
    <div id="section-addOrder" className="section" style={{ display: "none" }}>
      <h3>Add Order</h3>
      <div className="form-container">
        <input type="text" id="orderId" placeholder="Order ID" />
        <input type="text" id="orderUserName" placeholder="User Name" />
        <input type="email" id="orderUserEmail" placeholder="User Email" />
        <input type="number" id="orderAmount" placeholder="Amount" />
        {/* Additional fields for vendor info */}
        <input type="text" id="vendorName" placeholder="Vendor Name" />
        <input
          type="tel"
          id="vendorContact"
          placeholder="Vendor Contact Number"
        />
        <input
          type="text"
          id="deliveryAddress"
          placeholder="Delivery Address"
        />
        <button className="red-button" onclick="saveOrder()">
          Save Order
        </button>
      </div>
    </div>
    {/* Payment History */}
    <div id="section-payment" className="section" style={{ display: "none" }}>
      <h3>Payment History</h3>
      <button className="red-button" onclick="fetchPayments()">
        Refresh
      </button>
      <div id="paymentHistoryContainer" />
    </div>
    {/* Manage sections */}
    <div id="section-items" className="section" style={{ display: "none" }}>
      <h3>Items</h3>
      <div id="itemsTable" />
    </div>
    <div id="section-orders" className="section" style={{ display: "none" }}>
      <h3>Orders</h3>
      <div id="ordersTable" />
    </div>
    <div id="section-users" className="section" style={{ display: "none" }}>
      <h3>Users</h3>
      <div id="usersTable" />
    </div>
  </div>
</>
