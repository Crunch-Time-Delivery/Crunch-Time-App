<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restaurant Info Dashboard</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  /* Reset styles */\n  * {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n  }\n\n  body {\n    font-family: Arial, sans-serif;\n    background-color: #f0f2f5;\n  }\n\n  /* Header with menu icon */\n  .header {\n    display: flex;\n    align-items: center;\n    padding: 10px 20px;\n    background-color: #fff;\n    position: relative;\n    border-bottom: 1px solid #ccc;\n  }\n\n  /* Menu container and icon */\n  .menu-container {\n    position: relative;\n  }\n\n  .menu-icon {\n    font-size: 24px;\n    cursor: pointer;\n  }\n\n  /* Dropdown menu styles */\n  #menuDropdown {\n    display: none; /* Hidden by default */\n    position: absolute;\n    top: 40px;\n    left: 0;\n    background-color: #fff;\n    border: 1px solid #ccc;\n    box-shadow: 0 2px 8px rgba(0,0,0,0.2);\n    padding: 10px;\n    z-index: 1000;\n    flex-direction: column;\n    gap: 10px;\n  }\n\n  #menuDropdown button {\n    width: 150px;\n    padding: 8px 12px;\n    border: none;\n    background-color: #f0f0f0;\n    border-radius: 4px;\n    cursor: pointer;\n    text-align: left;\n  }\n\n  #menuDropdown button:hover {\n    background-color: #ddd;\n  }\n\n  /* Top bar styles */\n  .top-bar {\n    background-color: red;\n    height: 60px;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 0 20px;\n  }\n/* Profile section styles */\n  .profile-section {\n    display: flex;\n    align-items: center;\n  }\n\n  .profile-picture {\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    background-color: #fff; /* Placeholder for profile image */\n    margin-right: 10px;\n  }\n\n  .admin-name {\n    color: #fff;\n    font-weight: bold;\n    font-size: 1.2em;\n  }\n\n  /* Search and filter container */\n  .filter-search-container {\n    display: flex;\n    align-items: center;\n    padding: 10px 20px;\n    gap: 10px;\n    background-color: #fff;\n  }\n\n  /* Select style */\n  .filter-dropdown {\n    padding: 8px 12px;\n    border-radius: 4px;\n    border: 1px solid #ccc;\n    font-size: 1em;\n  }\n\n  /* Search input style */\n  #search-input {\n    padding: 8px 12px;\n    border-radius: 4px;\n    border: 1px solid #ccc;\n    font-size: 1em;\n    flex: 1;\n  }\n\n  /* Container for info boxes */\n  #info-container {\n    padding: 20px;\n    display: flex;\n    flex-direction: column;\n    gap: 15px;\n  }\n\n  /* Info box styles */\n  .info-box {\n    display: flex;\n    background-color: #fff;\n    padding: 15px;\n    border-radius: 8px;\n    box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n    align-items: flex-start;\n    gap: 20px;\n    flex-wrap: wrap;\n  }\n\n  /* Icon section */\n  .icon-section {\n    flex-shrink: 0;\n    cursor: pointer;\n  }\n\n  .icon {\n    width: 60px;\n    height: 60px;\n    background-color: #ccc;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-size: 24px;\n    border-radius: 8px;\n    transition: background-color 0.3s;\n  }\n\n  .icon:hover {\n    background-color: #bbb;\n  }\n\n  /* Details section */\n  .details {\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n  }\n\n  /* Editable fields */\n  .field {\n    font-weight: bold;\n    outline: none;\n  }\n\n  /* Action links */\n  .links {\n    margin-top: 10px;\n    display: flex;\n    gap: 15px;\n    align-items: center;\n  }\n\n  .hyperlink-red {\n    color: red;\n    text-decoration: none;\n    font-weight: bold;\n    cursor: pointer;\n    font-size: 1em;\n  }\n  .hyperlink-red:hover {\n    text-decoration: underline;\n  }\n\n  /* Remove button style */\n  .remove-btn {\n    margin-left: 10px;\n    padding: 6px 12px;\n    background-color: #e74c3c;\n    color: #fff;\n    border: none;\n    border-radius: 4px;\n    font-size: 0.9em;\n    cursor: pointer;\n    transition: background-color 0.3s;\n  }\n  .remove-btn:hover {\n    background-color: #c0392b;\n  }\n\n  /* Add button style */\n  #add-btn {\n    margin: 20px auto;\n    padding: 12px 24px;\n    background-color: red;\n    color: #fff;\n    border: none;\n    border-radius: 6px;\n    font-size: 1em;\n    cursor: pointer;\n    display: block;\n  }\n  #add-btn:hover {\n    background-color: darkred;\n  }\n"
    }}
  />
  {/* Header with menu icon */}
  <div className="header">
    <div className="menu-container">
      <div
        className="menu-icon"
        title="Menu"
        style={{ cursor: "pointer", fontSize: 24 }}
        onclick="toggleMenuDropdown()"
      >
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
  {/* Top bar with admin info */}
  <div className="top-bar">
    <div className="profile-section">
      <div className="profile-picture" />
      <div className="admin-name">Admin Establishment</div>
    </div>
  </div>
  {/* Filter/search controls */}
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
  {/* Main container for dynamic info boxes */}
  <div id="info-container" />
  {/* Add button to create new info boxes */}
  <button id="add-btn">Add Restaurant Info</button>
</>
