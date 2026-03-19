<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome Page</title>
  {/* Font Awesome */}
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  body { font-family: sans-serif; background:#f0f0f0; margin:0; }\n\n  /* Welcome overlay styles */\n  #welcomeOverlay {\n    position: fixed;\n    top:0; left:0; width:100%; height:100%;\n    background: rgba(255, 255, 255, 0.8);\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    justify-content:center;\n    z-index:10000;\n    text-align: center;\n    padding:20px;\n  }\n  #welcomeOverlay img {\n    max-width:250px;\n    margin-bottom:20px;\n  }\n  #welcomeOverlay h2 {\n    color: gray;\n    margin: 10px 0;\n  }\n  #welcomeOverlay p {\n    margin:10px 0;\n  }\n  /* Buttons in overlay */\n  .centered-buttons {\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n  }\n  .centered-buttons button {\n    width:200px;\n    padding:12px;\n    margin:10px 0;\n    font-size:1em;\n    cursor:pointer;\n    border-radius:4px;\n    border:none;\n  }\n  /* Specific overlay buttons */\n  .btn-create {\n    background:#f60202; /* red background */\n    color:#fff;\n  }\n  .btn-login {\n    background:#fff; /* white background */\n    color:#f60202; /* red text */\n  }\n  .btn-browser {\n    background:#f60202; /* red background */\n    color:#fff; /* white text */\n  }\n  /* Terms text */\n  #termsText {\n    margin-top:20px;\n    text-align:center;\n    font-size:0.9em;\n    color: #555;\n  }\n"
    }}
  />
  {/* Welcome Overlay */}
  <div id="welcomeOverlay">
    <img src="img/screenshot (253).jpg" alt="Screenshot" />
    <h2>Welcome</h2>
    <p>Before enjoying CrunchTime deliveries</p>
    <p>Register now</p>
    <div className="centered-buttons">
      <button
        id="registerBtn"
        className="btn-create"
        onclick="handleCreateAccount()"
      >
        Create account
      </button>
      <button id="loginBtn" className="btn-login" onclick="handleLogin()">
        Login
      </button>
      <button
        id="browserBtn"
        className="btn-browser"
        onclick="window.location.href='dummy.html';"
      >
        Browser Menu
      </button>
    </div>
    <div id="termsText">
      By logging in or registering, you have agreed to the Terms and Conditions
      and Privacy Policy.
    </div>
  </div>
  {/* Register Modal */}
  <div id="registerModal" className="modal" style={{ display: "none" }}>
    <div className="modal-box">
      <img
        src="img/screenshot (253).jpg"
        alt="Welcome Image"
        style={{ width: 250, height: "auto", marginBottom: 20 }}
      />
      <h2 style={{ color: "gray" }}>Welcome</h2>
      <h3>Register New Vendor</h3>
      <input type="email" id="regEmail" placeholder="Invitation Email" />
      <input type="text" id="regName" placeholder="Full Name" />
      <input type="password" id="regPassword" placeholder="Password" />
      <button
        style={{ width: "100%", background: "#fa0202", color: "#fff" }}
        onclick="startRegistration()"
      >
        Create Account
      </button>
    </div>
  </div>
</>
