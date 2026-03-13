<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Driver View Account</title>
  {/* Include Supabase SDK */}
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n  body {\n    font-family: Arial, sans-serif;\n    background: #f4f4f4;\n    margin: 0;\n    padding: 20px;\n  }\n  .card {\n    max-width: 400px;\n    margin: auto;\n    background: #fff;\n    padding: 20px;\n    border-radius: 10px;\n    box-shadow: 0 0 10px rgba(0,0,0,0.1);\n  }\n  .row {\n    display: flex;\n    justify-content: space-between;\n    margin-bottom: 10px;\n  }\n  #profileIcon {\n    width: 50px;\n    height: 50px;\n    border-radius: 50%;\n    background-color: #ccc;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 24px;\n    color: #fff;\n    margin: auto;\n    background-size: cover;\n    background-position: center;\n    position: relative;\n  }\n  /* Style for the upload label button */\n  label[for="picUpload"] {\n    position: absolute;\n    bottom: -5px;\n    right: -5px;\n    background-color: #007bff;\n    color: #fff;\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 14px;\n    cursor: pointer;\n    border: 2px solid #fff;\n    font-weight: bold;\n  }\n'
    }}
  />
  <div className="card" id="driverAccountContainer">
    {/* Content will be injected here */}
  </div>
  {/* Optional: Add output element for debugging */}
  <div id="output" style={{ whiteSpace: "pre-wrap", marginTop: 20 }} />
</>
