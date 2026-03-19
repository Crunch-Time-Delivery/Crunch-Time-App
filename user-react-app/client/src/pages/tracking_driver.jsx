<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Track Driver</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body {\n      font-family: Arial, sans-serif;\n      background: #f4f6f9;\n      color: #333;\n      padding: 20px;\n    }\n    .container {\n      max-width: 500px;\n      margin: 0 auto;\n      background: white;\n      border-radius: 12px;\n      padding: 20px;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n    }\n    h1 {\n      text-align: center;\n      color: #d32f2f;\n      margin-bottom: 20px;\n      font-size: 24px;\n    }\n    .input-group {\n      display: flex;\n      gap: 10px;\n      margin-bottom: 15px;\n    }\n    input {\n      flex: 1;\n      padding: 12px;\n      font-size: 16px;\n      border: 1px solid #ccc;\n      border-radius: 8px;\n      outline: none;\n    }\n    input:focus {\n      border-color: #d32f2f;\n    }\n    button {\n      padding: 12px 20px;\n      background: #d32f2f;\n      color: white;\n      border: none;\n      border-radius: 8px;\n      font-weight: bold;\n      cursor: pointer;\n      transition: background 0.2s;\n    }\n    button:hover:not(:disabled) {\n      background: #b71c1c;\n    }\n    button:disabled {\n      background: #ccc;\n      cursor: not-allowed;\n    }\n    #map {\n      width: 100%;\n      height: 300px;\n      border: 2px solid #ddd;\n      border-radius: 8px;\n      margin-top: 15px;\n      background: #e8f5e9;\n    }\n    .status {\n      margin-top: 10px;\n      padding: 10px;\n      border-radius: 6px;\n      text-align: center;\n      font-size: 14px;\n      display: none;\n    }\n    .status.connecting { background: #fff8e1; color: #ff8f00; display: block; }\n    .status.tracking { background: #e8f5e9; color: #2e7d32; display: block; }\n    .status.error { background: #ffebee; color: #c62828; display: block; }\n  "
    }}
  />
  <div className="container">
    <h1>Track Your Driver</h1>
    <div className="input-group">
      <input
        type="text"
        id="orderId"
        placeholder="Enter Order ID (e.g. ORD123)"
      />
      <button id="trackBtn">Track</button>
    </div>
    <div id="map" />
    <div id="status" className="status">
      No location selected.
    </div>
  </div>
  {/* Google Maps API - Replace YOUR_API_KEY with your actual API key */}
</>
