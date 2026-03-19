<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Register Modal</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\nbody {\n  font-family: sans-serif;\n  background: #f0f0f0;\n  margin: 0;\n}\n\n/* Modal styles */\n.modal {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: fixed; \n  inset: 0;\n  background: rgba(0, 0, 0, 0.5);\n}\n\n.modal-box {\n  background: #fff;\n  padding: 20px;\n  border-radius: 8px;\n  max-width: 400px;\n  width: 90%;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.modal-box input {\n  width: 100%;\n  padding: 10px;\n  margin: 10px 0;\n  border-radius: 4px;\n  border: 1px solid #ccc;\n}\n\n.modal-box button {\n  width: 100%;\n  padding: 12px;\n  background: #fa0202;\n  color: #fff;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 1em;\n}\n"
    }}
  />
  {/* Register Modal */}
  <div id="registerModal" className="modal">
    <div className="modal-box">
      <img
        src="img/screenshot (253).jpg"
        alt="Welcome Image"
        style={{ width: 250, marginBottom: 20 }}
      />
      <h2 style={{ color: "gray" }}>Welcome</h2>
      <h3>Register New Vendor</h3>
      <input type="text" id="regName" placeholder="Full Name" />
      <input type="email" id="regEmail" placeholder="Email Address" />
      <input type="password" id="regPassword" placeholder="Password" />
      {/* SINGLE WORKING BUTTON */}
      <button id="createAccountBtn">Create Account</button>
    </div>
  </div>
</>
