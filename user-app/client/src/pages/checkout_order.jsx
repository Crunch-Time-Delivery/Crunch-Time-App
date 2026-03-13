<>
  <meta charSet="UTF-8" />
  <title>Checkout Order</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  {/* Font Awesome CDN */}
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n/* Your existing styles plus new styles for top pin message */\n\n* { box-sizing: border-box; }\nbody { margin: 0; font-family: Arial, sans-serif; background: #f5f5f5; }\n.app { width: 100vw; min-height: 100vh; display: flex; flex-direction: column; }\n\n.header { padding: 14px; display: flex; align-items: center; border-bottom: 1px solid #ddd; background: white; }\n.header i { font-size: 18px; cursor: pointer; }\n.header h2 { margin: auto; font-size: clamp(16px, 2.5vw, 20px); }\n\n.status { text-align: center; padding: 10px; font-size: clamp(12px, 2.5vw, 14px); background: #fff; font-weight: bold; }\n\n.map { flex: 1; }\n\n.driver-panel { background: white; border-radius: 25px 25px 0 0; padding: 14px; box-shadow: 0 -5px 20px rgba(0,0,0,0.1); }\n.driver-row { display: flex; align-items: center; gap: 10px; }\n.driver-avatar { width: 12vw; height: 12vw; max-width: 60px; max-height: 60px; min-width: 45px; min-height: 45px; border-radius: 50%; background: #ff3d3d; display: flex; align-items: center; justify-content: center; color: white; font-size: clamp(18px, 4vw, 28px); }\n.actions { margin-left: auto; display: flex; gap: 10px; }\n.action-btn { width: 10vw; height: 10vw; max-width: 42px; max-height: 42px; min-width: 34px; min-height: 34px; background: #ff3d3d; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: clamp(14px, 3vw, 18px); cursor: pointer; }\n.info { margin-top: 10px; display: flex; justify-content: space-between; align-items: center; }\n.badge { background: red; color: #fff; padding: 4px 10px; border-radius: 8px; font-size: clamp(11px, 2.5vw, 13px); }\n.rating { background: #ffe600; padding: 4px 10px; border-radius: 8px; font-size: clamp(11px, 2.5vw, 13px); font-weight: bold; }\n.time { font-size: clamp(20px, 5vw, 28px); font-weight: bold; }\n.tabs { display: flex; justify-content: space-between; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px; }\n.tabs div { font-weight: bold; font-size: clamp(13px, 3vw, 15px); color: #444; cursor: pointer; }\n.tabs .active { color: red; }\n.panel { display: none; margin-top: 10px; font-size: clamp(12px, 3vw, 14px); }\n.panel.active { display: block; }\n\n/* Styles for top pin message */\n#topPinMessage {\n  position: fixed;\n  top: 10px;\n  left: 50%;\n  transform: translateX(-50%);\n  background: #fff3cd;\n  border: 1px solid #ffeeba;\n  padding: 15px;\n  border-radius: 10px;\n  max-width: 600px;\n  width: 90%;\n  cursor: default;\n  box-shadow: 0 4px 8px rgba(0,0,0,0.2);\n  z-index: 10000;\n}\n#topPinMessage h3 {\n  margin: 0;\n  font-size: 16px;\n}\n#topPinMessage span {\n  font-weight: bold;\n}\n#topPinMessage button {\n  position: absolute;\n  top: 5px;\n  right: 10px;\n  background: none;\n  border: none;\n  font-size: 1.2em;\n  cursor: pointer;\n}\n"
    }}
  />
  {/* The top pin message */}
  <div id="topPinMessage">
    <h3>
      Order PIN: <span id="orderPin">Loading...</span>
    </h3>
  </div>
  {/* Main app content */}
  <div className="app">
    <div className="header">
      <i className="fa fa-arrow-left" onclick="goBack()" />
      <h2 id="restaurantName">KFC</h2>
    </div>
    <div className="status">The courier is on their way to you</div>
    {/* Map container */}
    <div className="map" id="map" style={{ height: "50vh", width: "100%" }} />
    <div className="driver-panel">
      <div className="driver-row">
        <div className="driver-avatar">
          <i className="fa-solid fa-motorcycle" />
        </div>
        <div>
          <strong id="loadDriverName">Your Driver</strong>
          <br />
          <small>On the way</small>
        </div>
        <div className="actions">
          <div className="action-btn" onclick="callDriver()">
            <i className="fa fa-phone" />
          </div>
          <div className="action-btn" onclick="chatDriver()">
            <i className="fa fa-comment" />
          </div>
        </div>
      </div>
      {/* Order info section */}
      <div className="info" id="orderInfoSection">
        <div>
          <div className="badge" id="driverPlateNo">
            CAA5567
          </div>
          <div className="rating">4.8 ⭐</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="time" id="deliveryTime">
            12:56
          </div>
          <small>Estimated time to delivery</small>
        </div>
      </div>
      {/* Tabs */}
      <div className="tabs">
        <div id="tabProgress" className="active" onclick="showTab('progress')">
          Order Progress
        </div>
        <div id="tabInfo" onclick="showTab('info')">
          Order Info
        </div>
      </div>
      <div id="progress" className="panel active">
        <p>✔ Order confirmed</p>
        <p>✔ Restaurant preparing food</p>
        <p>🚴 Driver on the way</p>
      </div>
      <div id="info" className="panel">
        <p>
          <strong>Order:</strong> #CAA5567{" "}
        </p>
        <p>
          <strong>Restaurant:</strong> KFC Parow{" "}
        </p>
        <p>
          <strong>Status:</strong> Out for delivery{" "}
        </p>
      </div>
    </div>
  </div>
  {/* Notification container */}
  <div
    id="notification"
    style={{
      position: "fixed",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#333",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: 8,
      display: "none",
      zIndex: 9999
    }}
  />
  {/* Load Google Maps API with your API key */}
</>
