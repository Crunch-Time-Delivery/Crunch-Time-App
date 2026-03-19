<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Home Dashboard</title>
  {/* External CSS */}
  <link rel="stylesheet" href="assets/index.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <link rel="manifest" href="manifest.json" />
  <meta name="theme-color" content="#2196F3" />
  {/* External JS libraries */}
  {/* Combined Styles */}
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n/* --- Merged Styles --- */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  background-color: #f9f9f9;\n}\n/* Common styles from both snippets, adjusted as needed */\n\n#root { display: none; }\n\n/* Header styles */\n.header {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 20px;\n  background: #fff;\n  border-bottom: 1px solid #ddd;\n}\n.header button {\n  background: none;\n  border: none;\n  font-size: 16px;\n  cursor: pointer;\n  padding: 5px 10px;\n}\n.search-bar {\n  flex: 1;\n  min-width: 200px;\n  margin: 10px;\n}\n.search-bar input {\n  width: 100%;\n  padding: 5px;\n  border: 1px solid #ddd;\n  border-radius: 5px;\n}\n\n/* Filters styles */\n.filters {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  padding: 10px 20px;\n  background: #ffb4b4;\n  border-bottom: 1px solid #ddd;\n}\n.filters button {\n  background: none;\n  border: none;\n  cursor: pointer;\n  margin: 5px;\n  padding: 5px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.filters button img {\n  width: 24px;\n  height: 24px;\n  margin-bottom: 5px;\n  object-fit: cover;\n  border-radius: 4px;\n}\n.filters button span {\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n}\n\n/* Restaurant cards */\n.restaurant-list {\n  padding: 10px 20px;\n  max-height: 70vh;\n  overflow-y: auto;\n}\n.restaurant-card {\n  display: flex;\n  background: #fff;\n  margin-bottom: 10px;\n  padding: 10px;\n  border-radius: 5px;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n  cursor: pointer;\n  position: relative;\n  align-items: center;\n}\n.restaurant-card img {\n  width: 100px;\n  height: 100px;\n  object-fit: cover;\n  margin-right: 10px;\n}\n.restaurant-card .details {\n  flex: 1;\n}\n.restaurant-card .rating { color: #666; font-weight: bold; }\n.restaurant-card .promo { color: red; font-weight: bold; }\n.fav {\n  position: absolute; top: 10px; right: 10px; font-size: 20px; background:none; border:none; cursor:pointer;\n}\n\n/* Modal overlays & other styles omitted for brevity, reusing your extensive styles from second snippet */\n.modal {\n  display: none; position: fixed; z-index: 999; left:0; top:0; width:100%; height:100%;\n  background: rgba(0,0,0,0.5);\n}\n.modal-content {\n  background:#fff; margin:50px auto; padding:20px; border-radius:10px; max-width:600px; position:relative;\n}\n.close-btn {\n  position:absolute; top:10px; right:15px; font-size:24px; cursor:pointer; font-weight:bold;\n}\n#restaurantImage {\n  width:100%; max-height:200px; object-fit:cover; border-radius:5px; margin-bottom:10px; cursor:pointer;\n}\n/* Additional modal styles, buttons, QR code, profile modal, etc., retained from your second snippet */\n#profileModal {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(0,0,0,0.6);\n  z-index: 9999;\n  justify-content: center;\n  align-items: center;\n}\n.profile-box {\n  background: #fff;\n  width: 380px;\n  padding: 20px;\n  border-radius: 10px;\n}\n.profile-box h3 {\n  text-align: center;\n  margin-top: 0;\n}\n.profile-box input,\n.profile-box select {\n  width: 100%;\n  padding: 8px;\n  margin: 6px 0;\n}\n.profile-box button {\n  width: 100%;\n  padding: 10px;\n  margin-top: 8px;\n  font-weight: bold;\n  border: none;\n  cursor: pointer;\n  border-radius: 6px;\n}\n.save-btn { background: #f00707; color: white }\n.delete-btn { background: red; color: white }\n.close-btn { background: #777; color: white }\n/* Additional styles for notifications, QR, payment, etc., also retained */\n#notification {\n  display:none; position:fixed; top:20px; width:100%; z-index:9999; text-align:center;\n}\n"
    }}
  />
  {/* HEADER */}
  <div className="header">
    <button>☰</button>
    <div>Crunch Time</div>
    <button>Delivery</button>
    <button>Pickup</button>
    <div className="search-bar">
      <input type="text" placeholder="Search Crunch Time" />
    </div>
    <button onclick="window.location.href='http://127.0.0.1:5501/user-app/search_location.html'">
      Map Location - Pick up now
    </button>
    <span className="user-icon" onclick="openProfile()">
      👤
    </span>
  </div>
  {/* PROFILE MODAL */}
  <div id="profileModal">
    <div className="profile-box">
      <h3>User Profile</h3>
      <input id="username" disabled="" placeholder="Username" />
      <input id="email" disabled="" placeholder="Email" />
      <input id="password" placeholder="Password" />
      <button className="save-btn" onclick="updatePassword()">
        Update Password
      </button>
      <hr />
      <h4>Card Details</h4>
      <select id="cardType">
        <option value="">Select Card</option>
        <option>Visa</option>
        <option>MasterCard</option>
        <option>Amex</option>
      </select>
      <input id="cardNumber" placeholder="Card Number" />
      <input id="cvv" placeholder="CVV" />
      <input id="securityCode" placeholder="Security Code" />
      <button className="save-btn" onclick="saveCardDetails()">
        Save Card
      </button>
      <button className="delete-btn" onclick="deleteUser()">
        Delete Account
      </button>
      <button className="close-btn" onclick="closeProfile()">
        Close
      </button>
    </div>
  </div>
  {/* FILTER BUTTONS */}
  <div className="filters">
    <button className="filter-btn" onclick="selectCategory('Fast Food')">
      <img
        src="Images/Ultraprocessed foods display 2 framed - shutterstock_2137640529_r.jpg"
        alt="Fast Food"
      />
      <span>Fast Food</span>
    </button>
    <button className="filter-btn" onclick="selectCategory('Burgers')">
      <img src="Images/CR7.jpg" alt="Burgers" />
      <span>Burgers</span>
    </button>
    <button className="filter-btn" onclick="selectCategory('Asian')">
      <img src="Images/CR7 SUCCI.jpg" alt="Asian" />
      <span>Asian</span>
    </button>
    <button className="filter-btn" onclick="selectCategory('Pizza')">
      <img src="Images/CR7 PIZZA.webp" alt="Pizza" />
      <span>Pizza</span>
    </button>
  </div>
  {/* Restaurant lists for categories (initially hidden, shown per selection) */}
  <div className="restaurant-list" id="fastfoodList">
    {/* Sample restaurants for Fast Food */}
    <div className="restaurant-card" onclick="showMenu('KFC Parow')">
      <img src="Images/RS KFC .jpeg" alt="KFC Parow" />
      <div className="details">
        <div>KFC, Parow</div>
        <div className="rating">4.4 ★</div>
        <div>Sponsored - 5 min</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
    <div className="restaurant-card" onclick="showMenu('Sannes Palace')">
      <img src="Images/RS PALACE .jpg" alt="Sannes Palace" />
      <div className="details">
        <div>Sannes Palace</div>
        <div className="rating">4.5 ★</div>
        <div>20 min - 0.5 km</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
    <div className="restaurant-card" onclick="showMenu('DK Spot & Kota')">
      <img
        src="Images/RS KOTA .jpg"
        alt="DK Spot & Kota"
        onclick="window.location.href='http://127.0.0.1:5501/user-app/client/public/restaurant_info.html'; event.stopPropagation();"
      />
      <div className="details">
        <div>DK Spot &amp; Kota Restaurant</div>
        <div className="rating">4.0 ★</div>
        <div>Uber Eats HDP-Owned - 16 min - 0.6 km</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
    <div className="restaurant-card" onclick="showMenu('Nondyebo Eatery')">
      <img
        src="Images/RS NONDYEBO.jpg"
        alt="Nondyebo Eatery"
        onclick="window.location.href='http://127.0.0.1:5501/user-app/client/public/restaurant_info.html'; event.stopPropagation();"
      />
      <div className="details">
        <div>Nondyebo Eatery</div>
        <div className="rating">3.3 ★</div>
        <div>10 min - 0.6 km</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
  </div>
  <div className="restaurant-list" id="burgersList" style={{ display: "none" }}>
    {/* Burgers */}
    <div className="restaurant-card" onclick="showMenu('Rodeo Spur Halaal')">
      <img src="Images/spur.jpg" alt="Rodeo Spur Halaal" />
      <div className="details">
        <div>Rodeo Spur Halaal</div>
        <div className="rating">4.4 ★</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
    <div className="restaurant-card" onclick="showMenu('RocoMamas Rondebosch')">
      <img
        src="Images/img.jpg"
        alt="RocoMamas Rondebosch"
        onclick="window.location.href='http://127.0.0.1:5501/user-app/client/public/restaurant_info.html'; event.stopPropagation();"
      />
      <div className="details">
        <div>RocoMamas Rondebosch</div>
        <div className="rating">4.0 ★</div>
        <div>Uber Eats HDP-Owned - 16 min - 0.6 km</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
    <div
      className="restaurant-card"
      onclick="showMenu('Krispy King Rondebosch')"
    >
      <img
        src="Images/fried_chicken.jpg"
        alt="Krispy King Rondebosch"
        onclick="window.location.href='http://127.0.0.1:5501/user-app/client/public/restaurant_info.html'; event.stopPropagation();"
      />
      <div className="details">
        <div>KRISPY KING RONDEBOSCH (HALAL)</div>
        <div className="rating">3.3 ★</div>
        <div>10 min - 0.6 km</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
  </div>
  <div className="restaurant-list" id="asianList" style={{ display: "none" }}>
    {/* Asian */}
    <div
      className="restaurant-card"
      onclick="showMenu('Khao Hom Halal Thai Cuisine')"
    >
      <img src="Images/download.png" alt="Khao Hom Halal Thai Cuisine" />
      <div className="details">
        <div>Khao Hom Thai Cuisine</div>
        <div className="rating">4.4 ★</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
    <div
      className="restaurant-card"
      onclick="showMenu('Somma Asian Restaurant Rondebosch')"
    >
      <img
        src="Images/asian_(1).jpg"
        alt="Somma Asian Restaurant Rondebosch"
        onclick="window.location.href='http://127.0.0.1:5501/user-app/client/public/restaurant_info.html'; event.stopPropagation();"
      />
      <div className="details">
        <div>Somma Asian Restaurant Rondebosch</div>
        <div className="rating">4.0 ★</div>
        <div>Uber Eats HDP-Owned - 16 min - 0.6 km</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
  </div>
  <div className="restaurant-list" id="pizzaList" style={{ display: "none" }}>
    {/* Pizza */}
    <div
      className="restaurant-card"
      onclick="showMenu('La Infernos Pizzeria (Kromboom')"
    >
      <img
        src="Images/wood-pizza.png"
        alt="La Inferno's Pizzeria (Kromboom)"
        onclick="window.location.href='http://127.0.0.1:5501/user-app/client/public/restaurant_info.html'; event.stopPropagation();"
      />
      <div className="details">
        <div>La Inferno's Pizzeria (Kromboom)</div>
        <div className="rating">4.4 ★</div>
        <div>Sponsored - 5 min - 4.4 km</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
    <div className="restaurant-card" onclick="showMenu('Romans Pizza ')">
      <img
        src="Images/roman_pizza.jpg"
        alt="Roman's Pizza "
        onclick="window.location.href='http://127.0.0.1:5501/user-app/client/public/restaurant_info.html'; event.stopPropagation();"
      />
      <div className="details">
        <div>Roman's Pizza </div>
        <div className="rating">3.3 ★</div>
        <div>10 min - 0.6 km</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
    <div className="restaurant-card" onclick="showMenu('Debonairs Pizza')">
      <img src="Images/download (1).png" alt="Debonairs Pizza" />
      <div className="details">
        <div>Debonairs Pizza</div>
        <div className="rating">4.0 ★</div>
      </div>
      <button
        className="fav"
        onclick="event.stopPropagation(); toggleFavorite(this)"
      >
        ♥
      </button>
    </div>
  </div>
  {/* Notification */}
  <div
    id="notification"
    style={{
      display: "none",
      position: "fixed",
      top: 20,
      width: "100%",
      zIndex: 9999,
      textAlign: "center"
    }}
  >
    <div
      style={{
        backgroundColor: "#4CAF50",
        color: "white",
        padding: 10,
        display: "inline-block",
        borderRadius: 4
      }}
    >
      Sending notification...
    </div>
  </div>
  {/* JavaScript: core functions from both snippets */}
  {/* Profile Modal Scripts and other functions (loadProfile, updatePassword, saveCardDetails, deleteUser, etc.) */}
</>
