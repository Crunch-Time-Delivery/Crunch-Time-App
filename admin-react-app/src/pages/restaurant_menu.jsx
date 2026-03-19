<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restaurant Dashboard</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n    /* Reset styles and layout styles omitted for brevity, kept from your code */\n    * {\n      box-sizing: border-box;\n      margin: 0;\n      padding: 0;\n    }\n    body {\n      font-family: Arial, sans-serif;\n      background-color: #f0f2f5;\n    }\n    /* Header styles */\n    .header { display: flex; align-items: center; padding: 10px 20px; background: #fff; position: relative; border-bottom: 1px solid #ccc; }\n    .menu-container { position: relative; }\n    .menu-icon { font-size: 24px; cursor: pointer; }\n    #menuDropdown { display: none; position: absolute; top: 40px; left: 0; background: #fff; border: 1px solid #ccc; box-shadow: 0 2px 8px rgba(0,0,0,0.2); padding: 10px; z-index: 1000; flex-direction: column; gap: 10px; }\n    #menuDropdown button { width: 150px; padding: 8px 12px; border: none; background: #f0f0f0; border-radius: 4px; cursor: pointer; text-align: left; }\n    #menuDropdown button:hover { background: #ddd; }\n    /* Top bar styles */\n    .top-bar { background: red; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }\n    .profile-section { display: flex; align-items: center; }\n    .profile-picture { width: 40px; height: 40px; border-radius: 50%; background: #fff; margin-right: 10px; }\n    .admin-name { color: #fff; font-weight: bold; font-size: 1.2em; }\n    /* Filter / search bar styles */\n    .filter-search-container { display: flex; align-items: center; padding: 10px 20px; background: #fff; gap: 10px; }\n    .filter-dropdown { padding: 8px 12px; border-radius: 4px; border: 1px solid #ccc; font-size: 1em; }\n    #search-input { padding: 8px 12px; border-radius: 4px; border: 1px solid #ccc; font-size: 1em; flex: 1; }\n    /* Content styles */\n    #content-container { padding: 20px; display: flex; flex-direction: column; gap: 20px; }\n    /* Restaurant box styles */\n    .restaurant-box { display: flex; background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }\n    .image-section { flex-shrink: 0; margin-right: 20px; }\n    .restaurant-image { width: 150px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #ccc; cursor: pointer; }\n    .text-box { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }\n    .restaurant-name { font-size: 1.5em; margin-bottom: 10px; outline: none; cursor: pointer; }\n    .restaurant-link { color: #007bff; text-decoration: none; margin-bottom: 10px; }\n    .restaurant-link:hover { text-decoration: underline; }\n    .buttons { display: flex; gap: 10px; margin-top: 10px; }\n    .action-btn { padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 1.2em; display: flex; align-items: center; justify-content: center; }\n    .edit-btn { background: #007bff; color: #fff; }\n    .edit-btn:hover { background: #0069d9; }\n    .save-btn { background: #28a745; color: #fff; }\n    .save-btn:hover { background: #218838; }\n    .remove-btn { background: #dc3545; color: #fff; }\n    .remove-btn:hover { background: #c82333; }\n    /* Add button style */\n    #add-restaurant { margin: 20px; padding: 12px 20px; background: red; color: #fff; border: none; border-radius: 6px; font-size: 1em; cursor: pointer; }\n    #add-restaurant:hover { background: darkred; }\n  "
    }}
  />
  {/* Header with menu icon */}
  <div className="header">
    <div className="menu-container">
      <div className="menu-icon" title="Menu" onclick="toggleMenuDropdown()">
        ☰
      </div>
      <div id="menuDropdown">
        <button onclick="showSection('dashboard')">Dashboard</button>
        <button onclick="window.location.href='http://127.0.0.1:5500/driver-app/admin/estabilshment.html'">
          Establishment
        </button>
        <button onclick="window.location.href='http://127.0.0.1:5500/driver-app/admin/restaurant_menu.html'">
          Restaurant Menu
        </button>
        <button onclick="showSection('Driver')">Driver</button>
        <button onclick="showSection('Vendor')">Vendor</button>
      </div>
    </div>
  </div>
  {/* Top bar */}
  <div className="top-bar">
    <div className="profile-section">
      <div className="profile-picture" />
      <div className="admin-name">Restaurant Menu</div>
    </div>
  </div>
  {/* Filter/search */}
  <div className="filter-search-container">
    <select id="establishment-filter" className="filter-dropdown">
      <option value="">Select Establishment</option>
      <option value="Restaurant">Restaurant</option>
      <option value="Cafe">Cafe</option>
      <option value="Bar">Bar</option>
      <option value="Diner">Diner</option>
    </select>
    <input type="text" id="search-input" placeholder="Search..." />
  </div>
  {/* Content container */}
  <div id="content-container" />
  {/* Add button */}
  <button id="add-restaurant">Add Restaurant Menu</button>
</>
