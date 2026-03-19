<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Driver App</title>
  {/* Leaflet CSS */}
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <link rel="manifest" href="manifest.json" />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  background: #f4f4f4;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 14px 20px;\n  background: #fff;\n  box-shadow: 0 2px 6px rgba(0,0,0,.1);\n}\n.driver-label {\n  font-weight: bold;\n  font-size: 20px;\n  color: red;\n}\n.menu-button {\n  background: red;\n  color: #fff;\n  padding: 8px 14px;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n}\n.menu-container { position: relative; }\n.dropdown-content {\n  display: none;\n  position: absolute;\n  right: 0;\n  background: #fff;\n  min-width: 220px;\n  border-radius: 6px;\n  box-shadow: 0 4px 10px rgba(0,0,0,.15);\n  overflow: hidden;\n}\n.menu-container.show .dropdown-content { display: block; }\n.dropdown-content a {\n  display: block;\n  padding: 12px 15px;\n  text-decoration: none;\n  color: #333;\n  border-bottom: 1px solid #eee;\n}\n.dropdown-content a:hover { background: #f5f5f5; }\n#contentArea {\n  max-width: 900px;\n  margin: 20px auto;\n  background: #fff;\n  padding: 20px;\n  border-radius: 10px;\n  box-shadow: 0 0 10px rgba(0,0,0,.1);\n}\n.loading, .empty-state {\n  text-align: center;\n  padding: 40px;\n  color: #777;\n}\n#map {\n  width: 100%;\n  height: 300px;\n  margin-top: 10px;\n  border-radius: 8px;\n}\n"
    }}
  />
  <div id="contentArea">
    <div className="header" id="mainHeader">
      <div className="driver-label">Driver</div>
      <div className="menu-container" id="menuContainer">
        <button className="menu-button" id="menuButton">
          Menu ▼
        </button>
        <div className="dropdown-content" id="dropdownMenu">
          <a href="#" id="orderViewLink">
            Order View
          </a>
          {/* Updated link to open in new tab */}
          <a
            href="http://127.0.0.1:5501/driver-app/client/public/driver_view_account.html"
            target="_blank"
            id="driverAccountLink"
          >
            Driver View Account
          </a>
          <a href="#" id="driverHistoryPayment">
            Driver History Payment
          </a>
          <a href="#" id="logoutLink">
            Logout
          </a>
        </div>
      </div>
    </div>
    <div id="innerContent">
      <h2>Welcome Driver</h2>
      <p>Select an option from the menu.</p>
    </div>
  </div>
  {/* Add this hidden input inside your form */}
  <input type="hidden" id="user_location_id" name="user_location_id" />
  {/* Google Maps API with callback */}
</>
