<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Search Delivery Location</title>
  {/* Leaflet CSS */}
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n    body {\n      font-family: Arial, sans-serif;\n      margin: 0;\n      padding: 20px;\n    }\n    .search-location-container {\n      max-width: 600px;\n      margin: 0 auto;\n    }\n    /* Flex container for title and red column */\n    .title-row {\n      display: flex;\n      align-items: center;\n      margin-bottom: 10px;\n    }\n    /* Title styling */\n    h1 {\n      margin: 0;\n      font-size: 24px;\n      flex: 1;\n    }\n    /* Red column styling */\n    .red-column {\n      width: 20px;\n      height: 20px;\n      background-color: red;\n      margin-left: 10px;\n      border-radius: 3px;\n    }\n    form {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 10px;\n      margin-bottom: 10px;\n    }\n    input[type="text"] {\n      flex: 1;\n      padding: 8px;\n      font-size: 16px;\n    }\n    button {\n      padding: 8px 16px;\n      font-size: 16px;\n      cursor: pointer;\n    }\n    #map {\n      height: 400px;\n      width: 100%;\n      margin-top: 20px;\n    }\n    .buttons-group {\n      display: flex;\n      gap: 10px;\n      margin-top: 10px;\n      justify-content: center;\n    }\n    #coordinates {\n      margin-top: 10px;\n      text-align: center;\n    }\n  '
    }}
  />
  <div className="search-location-container">
    <div className="title-row">
      <h1>Search Delivery Location</h1>
      <div className="red-column" />
    </div>
    {/* ADDRESS SEARCH */}
    <form id="locationForm">
      <input
        type="text"
        id="locationInput"
        placeholder="Enter address or city"
        required=""
      />
      {/* Hidden input to store location data */}
      <input type="hidden" id="user_location_id" name="user_location_id" />
      <button type="submit" id="setLocationBtn">
        Set Location
      </button>
    </form>
    {/* ACTION BUTTONS (Use My Location and Reset) */}
    <div className="buttons-group">
      <button type="button" id="locateBtn">
        Use My Location
      </button>
      <button type="button" id="resetBtn">
        Reset Map
      </button>
    </div>
    {/* MAP */}
    <div id="map" />
    <div id="coordinates">No location selected.</div>
  </div>
  {/* Google Maps API with callback */}
</>
