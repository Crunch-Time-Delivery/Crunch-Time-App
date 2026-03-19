<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Driver Login</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  /* Modal styles */\n  .modal {\n    display: none; \n    position: fixed; \n    z-index: 2000; \n    left: 0;\n    top: 0;\n    width: 100%; \n    height: 100%; \n    overflow: auto; \n    background-color: rgba(0,0,0,0.4);\n  }\n  .modal-content {\n    background-color: #fff;\n    margin: 15% auto; \n    padding: 20px;\n    border-radius: 8px;\n    width: 300px;\n    text-align: center;\n  }\n  .modal input {\n    width: 80%;\n    padding: 8px;\n    margin-top: 10px;\n  }\n  .modal button {\n    margin-top: 15px;\n    padding: 8px 12px;\n    cursor: pointer;\n  }\n  /* Buttons styling for Driver and Admin */\n  #buttonContainer {\n    margin-top: 20px;\n    display: flex;\n    gap: 10px;\n    justify-content: center;\n  }\n  .redirectBtn {\n    background-color: red;\n    color: #fff;\n    border: none;\n    padding: 10px 20px;\n    border-radius: 5px;\n    font-weight: bold;\n    cursor: pointer;\n  }\n  /* Optional: hover effect */\n  .redirectBtn:hover {\n    opacity: 0.8;\n  }\n  /* Style for the Forgot Password link */\n  #loginForgotPassword {\n    display: block;\n    text-align: center;\n    margin: 10px auto;\n    cursor: pointer;\n    color: blue;\n    text-decoration: underline;\n    font-size: 14px;\n  }\n"
    }}
  />
  {/* Container for dynamic content */}
  <div id="innerContent" />
  {/* Login Modal Structure */}
  <div id="loginModal" className="modal">
    <div className="modal-content">
      <img
        src="img/screenshot (251).jpg"
        alt="Welcome Image"
        style={{ width: 250, height: "auto", marginBottom: 20 }}
      />
      <h2>Welcome</h2>
      <h3>Login</h3>
      <p>
        Welcome to CrunchTime halaal food delivery. Login to start ordering.
      </p>
      <label>Email Address</label>
      <input type="email" id="loginEmail" placeholder="Email" />
      <label>Password</label>
      <input type="password" id="loginPassword" placeholder="Password" />
      {/* Updated Forgot Password link */}
      <a
        id="loginForgotPassword"
        href="http://127.0.0.1:5501/driver-app/client/public/Login/forgotpassword.html "
        target="_blank"
      >
        Forgot Password
      </a>
      <button
        style={{
          marginTop: 20,
          backgroundColor: "red",
          color: "#fff",
          padding: 10,
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          width: "100%"
        }}
        id="loginBtn"
      >
        Login
      </button>
      {/* Buttons for Driver and Admin */}
      <div id="buttonContainer">
        <button className="redirectBtn" id="driverBtn">
          Driver
        </button>
      </div>
    </div>
  </div>
  {/* OTP Modal */}
  <div id="otpModal" className="modal">
    <div className="modal-content">
      <h3>Verify Account</h3>
      <p>
        Please enter the OTP number sent to your email to reset your password
      </p>
      <input type="text" id="otpInput" maxLength={4} placeholder="Enter OTP" />
      <div style={{ marginTop: 10 }}>
        <button id="verifyOtpBtn">Confirm</button>
        <button id="resendOtpBtn">Resend OTP</button>
      </div>
    </div>
  </div>
</>
