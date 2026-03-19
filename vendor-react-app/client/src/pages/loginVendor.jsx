<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vendor Login</title>
  {/* Font Awesome */}
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  * {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n  }\n  body {\n    height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background-color: #f0f0f0;\n    font-family: Arial, sans-serif;\n  }\n  .window-container {\n    background-color: #fff;\n    padding: 30px;\n    border-radius: 10px;\n    box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n    max-width: 400px;\n    width: 90%;\n  }\n  /* Notification styles */\n  .notification {\n    position: fixed;\n    top: 20px;\n    right: 20px;\n    padding: 12px 20px;\n    border-radius: 5px;\n    color: #fff;\n    font-weight: bold;\n    z-index: 1000;\n    opacity: 0.9;\n    font-family: Arial, sans-serif;\n  }\n  .notification.success {\n    background-color: #4CAF50;\n  }\n  .notification.error {\n    background-color: #f44336;\n  }\n  .modal {\n    position: fixed;\n    top: 0; left: 0; width: 100%; height: 100%;\n    background-color: rgba(0,0,0,0.5);\n    display: flex; align-items: center; justify-content: center; z-index: 999;\n  }\n  .modal-box {\n    background: #fff; padding: 20px; border-radius: 8px; max-width: 350px; width: 100%; text-align: center;\n  }\n  input {\n    width: 100%; padding: 8px 12px; margin: 8px 0 16px 0; border: 1px solid #ccc; border-radius: 4px;\n  }\n  button {\n    width: 100%; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;\n  }\n  .redirect-btn {\n    background-color: #f80303;\n    color: #fff;\n    margin: 10px;\n    padding: 10px 20px;\n    border-radius: 5px;\n  }\n  .redirect-btn:hover {\n    opacity: 0.8;\n  }\n  label {\n    display: block; margin-top: 10px; font-weight: bold; text-align: left;\n  }\n  #bottomButtons {\n    margin-top: 20px; display: flex; justify-content: center; gap: 10px;\n  }\n  .modal-box img {\n    max-width: 250px; height: auto; margin-bottom: 20px; border-radius: 8px;\n  }\n  /* Additional styles for OTP modal */\n  #otpModal p {\n    margin: 10px 0;\n  }\n  #loginForgotPassword {\n    display: block;\n    margin-bottom: 15px;\n    text-align: right;\n    font-size: 0.9em;\n  }\n"
    }}
  />
  <div className="window-container">
    {/* OTP Modal */}
    <div id="otpModal" className="modal" style={{ display: "none" }}>
      <div className="modal-box">
        <img src="img/screenshot (253).jpg" alt="Welcome Image" />
        <h3>Verify Account</h3>
        <p>Please enter the OTP sent to your email to verify your account</p>
        <input id="otpInput" placeholder="OTP" />
        <p>Didn’t receive code? Request again</p>
        <button
          style={{ background: "#f80202", color: "#fff" }}
          onclick="verifyOTP()"
        >
          Confirm
        </button>
      </div>
    </div>
    {/* Login Modal */}
    <div id="loginModal" className="modal" style={{ display: "flex" }}>
      <div className="modal-box">
        <img src="img/screenshot (253).jpg" alt="Welcome Image" />
        <h3>Welcome</h3>
        <p>For vendors Manage your orders in real time.</p>
        <label htmlFor="username">Email Address</label>
        <input id="username" placeholder="Email" />
        <label htmlFor="password">Password</label>
        <input id="password" placeholder="Password" type="password" />
        {/* Updated Forgot Password link */}
        <a
          id="loginForgotPassword"
          href="http://127.0.0.1:5500/vendor-app/forgotpassword.html"
          target="_blank"
        >
          Forgot Password
        </a>
        {/* Buttons for Login and registration */}
        <button
          style={{ background: "#f40101", color: "#fff" }}
          onclick="verifyLogin()"
        >
          Login
        </button>
        <p>Don't have an account? Register here</p>
        <div id="bottomButtons">
          <button className="redirect-btn" id="vendorBtn">
            Vendor
          </button>
        </div>
      </div>
    </div>
  </div>
</>
