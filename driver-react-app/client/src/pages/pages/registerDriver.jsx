<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Register Driver</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  background: #f4f4f4;\n  padding: 20px;\n}\n\n/* ===== CONTAINER ===== */\n.page-wrapper {\n  max-width: 680px;\n  margin: auto;\n}\n\n/* ===== CARD ===== */\n.card {\n  background: #fff;\n  padding: 25px;\n  border-radius: 10px;\n  box-shadow: 0 8px 20px rgba(0,0,0,0.1);\n}\n\n/* ===== HEADER ===== */\n.header {\n  text-align: center;\n  margin-bottom: 20px;\n}\n\n.header img {\n  width: 220px;\n  margin-bottom: 10px;\n}\n\nh1 {\n  margin: 10px 0;\n  font-size: 26px;\n}\n\n/* ===== FORM ===== */\nform label {\n  display: block;\n  margin-top: 15px;\n  font-weight: bold;\n  font-size: 14px;\n}\n\nform input,\nform select {\n  width: 100%;\n  padding: 10px;\n  margin-top: 6px;\n  border-radius: 6px;\n  border: 1px solid #ccc;\n  font-size: 14px;\n}\n\nform input[type="file"] {\n  padding: 6px;\n  background: #fafafa;\n}\n\n.section-title {\n  margin-top: 25px;\n  font-weight: bold;\n  font-size: 16px;\n  border-bottom: 1px solid #eee;\n  padding-bottom: 5px;\n}\n\n/* ===== BUTTON ===== */\n.action-btn {\n  margin-top: 30px;\n  padding: 14px;\n  width: 100%;\n  background: #ff0000;\n  color: #fff;\n  border: none;\n  border-radius: 8px;\n  font-size: 16px;\n  cursor: pointer;\n}\n\n.action-btn:hover {\n  background: #b30000;\n}\n\n/* ===== NOTIFICATION ===== */\n#notification {\n  margin-bottom: 15px;\n  text-align: center;\n  display: none;\n}\n\n#notification div {\n  padding: 12px;\n  border-radius: 6px;\n  color: white;\n  font-weight: bold;\n}\n\n/* ===== UTIL ===== */\n.hidden {\n  display: none;\n}\n\n@media (max-width: 480px) {\n  h1 {\n    font-size: 22px;\n  }\n}\n'
    }}
  />
  <div className="page-wrapper">
    <div id="notification" />
    <div className="card">
      <div className="header">
        <img src="img/screenshot (251).jpg" alt="Welcome" />
        <h1>Register as a Driver</h1>
      </div>
      <form id="driverForm">
        <div className="section-title">Personal Details</div>
        <label>Upload Selfie</label>
        <input type="file" id="driverPhoto" accept="image/*" required="" />
        <label>Full Name</label>
        <input type="text" id="driverName" required="" />
        <label>Email</label>
        <input type="email" id="driverEmail" required="" />
        <label>Password</label>
        <input type="password" id="driverPassword" required="" />
        <label>Phone Number</label>
        <input type="tel" id="driverPhone" required="" />
        <label>ID Number</label>
        <input type="text" id="driverID" required="" />
        <div className="section-title">Bank Details</div>
        <label>Bank Account Number</label>
        <input type="text" id="bankDetails" required="" />
        <label>Bank Name</label>
        <select id="bankName" required="">
          <option value="">Select Bank</option>
          <option value="FNB">FNB</option>
          <option value="Standard Bank">Standard Bank</option>
          <option value="Capitec">Capitec</option>
          <option value="Nedbank">Nedbank</option>
          <option value="Other">Other</option>
        </select>
        <div id="otherBankDiv" className="hidden">
          <label>Specify Bank</label>
          <input type="text" id="otherBank" />
        </div>
        <div className="section-title">Vehicle Information</div>
        <label>Driver License</label>
        <input type="file" id="driverLicense" accept="image/*" required="" />
        <label>Car Color</label>
        <input type="text" id="carColor" required="" />
        <label>Car Type</label>
        <input type="text" id="carType" required="" />
        <label>Car Photo</label>
        <input type="file" id="carPhoto" accept="image/*" required="" />
        <label>Car Registration Number</label>
        <input type="text" id="carRegNumber" required="" />
        <button type="submit" className="action-btn">
          Submit Registration
        </button>
      </form>
    </div>
  </div>
</>
