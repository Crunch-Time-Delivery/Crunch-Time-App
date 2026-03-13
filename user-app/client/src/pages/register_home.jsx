<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CrunchTime User Registration</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n  /* Your existing styles, kept for completeness */\n\n  body {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 0;\n    background-color: #f9f9f9;\n    position: relative;\n  }\n\n  /* Header styles */\n  .header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 10px 20px;\n    background-color: #fff;\n    border-bottom: 1px solid #ddd;\n  }\n  .header button {\n    background: none;\n    border: none;\n    font-size: 16px;\n    cursor: pointer;\n    padding: 5px 10px;\n  }\n  .header .search-bar {\n    flex-grow: 1;\n    margin: 0 10px;\n  }\n  .header .search-bar input {\n    width: 100%;\n    padding: 5px;\n    border: 1px solid #ddd;\n    border-radius: 5px;\n  }\n\n  /* Filters styles */\n  .filters {\n    display: flex;\n    justify-content: space-between;\n    padding: 10px 20px;\n    background-color: #ffb4b4;\n    overflow-x: auto;\n  }\n  .filters button {\n    background: none;\n    border: none;\n    cursor: pointer;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    margin: 0 5px;\n  }\n  .filters button img {\n    width: 24px;\n    height: 24px;\n    margin-bottom: 5px;\n    object-fit: cover;\n  }\n\n  /* Restaurant list styles */\n  .restaurant-list {\n    padding: 10px 20px;\n    max-height: 70vh;\n    overflow-y: auto;\n  }\n  .restaurant-card {\n    display: flex;\n    background-color: #fff;\n    margin-bottom: 10px;\n    padding: 10px;\n    border-radius: 5px;\n    box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n    cursor: pointer;\n    align-items: center;\n  }\n  .restaurant-card img {\n    width: 100px;\n    height: 100px;\n    object-fit: cover;\n    margin-right: 10px;\n    border-radius: 4px;\n  }\n  .restaurant-card .details {\n    flex-grow: 1;\n  }\n  .restaurant-card .rating {\n    color: #666;\n  }\n  .restaurant-card .promo {\n    color: red;\n    font-weight: bold;\n  }\n  .restaurant-card button {\n    background: none;\n    border: none;\n    cursor: pointer;\n    font-size: 20px;\n  }\n\n  /* ==================== Registration & OTP Popup Styles ==================== */\n  #registerPopup {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: rgba(0,0,0,0.6);\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    z-index: 9999;\n  }\n  #registerFormContainer {\n    background: #fff;\n    padding: 20px;\n    border-radius: 8px;\n    width: 400px;\n    max-width: 90%;\n    box-shadow: 0 2px 10px rgba(0,0,0,0.3);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    text-align: center;\n  }\n  #registerFormContainer h2 {\n    margin-top: 0;\n  }\n  #registerForm input {\n    width: 100%;\n    padding: 8px;\n    margin: 8px 0;\n    box-sizing: border-box;\n    border-radius: 4px;\n    border: 1px solid #ccc;\n  }\n  #registerBtn {\n    width: 100%;\n    padding: 10px;\n    background-color: #ff0000;\n    border: none;\n    color: white;\n    border-radius: 4px;\n    cursor: pointer;\n    margin-top: 10px;\n  }\n  #registerBtn:disabled {\n    background-color: #aaa;\n    cursor: not-allowed;\n  }\n\n  /* OTP Section inside registration popup (initially hidden) */\n  #otpSection {\n    display: none;\n    margin-top: 10px;\n    width: 100%;\n    text-align: left;\n  }\n  #otpSection p {\n    margin: 8px 0 4px 0;\n  }\n  #otpSection input {\n    width: 100%;\n    padding: 8px;\n    margin: 8px 0;\n    box-sizing: border-box;\n    border-radius: 4px;\n    border: 1px solid #ccc;\n  }\n  #verifyOtpBtn {\n    width: 100%;\n    padding: 10px;\n    background-color: #28a745;\n    border: none;\n    color: #fff;\n    border-radius: 4px;\n    cursor: pointer;\n    margin-top: 10px;\n  }\n  #resendOtp {\n    background: none;\n    border: none;\n    color: blue;\n    cursor: pointer;\n    font-size: 14px;\n    margin-top: 5px;\n    align-self: flex-start;\n  }\n  #successMsg {\n    display: none;\n    color: green;\n    text-align: center;\n    margin-top: 15px;\n  }\n\n  /* OTP Verification Page styles */\n  #otpPage {\n    display: none;\n    padding: 20px;\n    max-width: 500px;\n    margin: 50px auto;\n    background: #fff;\n    border-radius: 8px;\n    box-shadow: 0 2px 10px rgba(0,0,0,0.3);\n    flex-direction: column;\n    align-items: center;\n    text-align: center;\n  }\n  #otpPage h2 {\n    margin-bottom: 15px;\n  }\n  #otpVerification {\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    align-items: center;\n    text-align: center;\n  }\n  #otpVerification input {\n    padding: 8px;\n    margin: 8px 0;\n    border-radius: 4px;\n    border: 1px solid #ccc;\n    width: 100%;\n    box-sizing: border-box;\n  }\n  #otpVerification button {\n    padding: 10px;\n    margin-top: 10px;\n    background-color: #ff0000;\n    border: none;\n    color: #fff;\n    border-radius: 4px;\n    cursor: pointer;\n    width: 100%;\n  }\n  #resendOtpPage {\n    background: none;\n    border: none;\n    color: blue;\n    cursor: pointer;\n    font-size: 14px;\n    margin-top: 5px;\n    align-self: flex-start;\n  }\n\n  /* Style for the checkbox section with terms and privacy links */\n  .terms-container {\n    display: flex;\n    align-items: flex-start;\n    margin: 10px 0;\n    flex-direction: column;\n    font-size: 14px;\n    text-align: left;\n  }\n  .terms-checkbox {\n    margin-right: 8px;\n    margin-top: 4px;\n  }\n  .terms-text {\n    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n  }\n  .terms-text span {\n    margin-right: 4px;\n  }\n  a {\n    color: red;\n    cursor: pointer;\n    text-decoration: underline;\n  }\n  /* Center the "Already have an account?" paragraph and "Login" link */\n  .centered {\n    text-align: center;\n    margin-top: 10px;\n  }\n  #loginBtnCenter {\n    color: red;\n    cursor: pointer;\n    text-decoration: underline;\n  }\n'
    }}
  />
  {/* Registration Popup Overlay */}
  <div id="registerPopup">
    <div id="registerFormContainer">
      <div
        className="modal-content"
        style={{
          maxWidth: 300,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <img
          src="img/screenshot (251).jpg"
          alt="Welcome Image"
          style={{ width: 250, height: "auto", marginBottom: 20 }}
        />
        <h2 style={{ color: "gray" }}>Create Account</h2>
        <p>
          Welcome to CrunchTime halaal food delivery. Signup to create a free
          account to start ordering
        </p>
        <h2>Register</h2>
        <form id="registerForm">
          <input
            type="text"
            id="fullName"
            placeholder="Full Name"
            required=""
          />
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            required=""
          />
          <input type="tel" id="phone" placeholder="Phone Number" required="" />
          <input
            type="password"
            id="password"
            placeholder="Password"
            required=""
          />
        </form>
        {/* Terms and Privacy Policy with checkbox */}
        <div className="terms-container">
          <label>
            <input
              type="checkbox"
              id="termsCheckbox"
              className="terms-checkbox"
            />
          </label>
          <div className="terms-text">
            <span>By logging in or registering, you agree to the </span>
            <a
              href="http://127.0.0.1:5501/user-app/terms-and-conditions.page.html"
              target="_blank"
              id="termsLink"
            >
              Terms &amp; Conditions
            </a>
            <span> and </span>
            <a href="dummy.pdf" target="_blank" id="privacyLink">
              Privacy Policy
            </a>
            <span>.</span>
          </div>
        </div>
        <button
          type="button"
          id="loginBtnCenter"
          onclick="window.open('http://127.0.0.1:5501/user-app/client/public/Login/loginUser.html', '_blank')"
        >
          Login
        </button>
        {/* Centered "Already have an account? Login" */}
        <div className="centered" style={{ marginTop: 15 }}>
          <span>Already have an account? </span>
          <a
            href="http://127.0.0.1:5501/driver-app/client/public/Login/loginDriver.html   "
            target="_blank"
            id="loginBtnCenter"
          >
            Login
          </a>
        </div>
        {/* OTP Section */}
        <div id="otpSection">
          <h3>Verify Account</h3>
          <p>
            Please enter the OTP number sent to your email to reset your
            password
          </p>
          <p>Enter your OTP code here</p>
          <input type="text" id="otpInput" placeholder="Enter OTP" />
          <p>Didn’t receive code? Request again</p>
          <button id="verifyOtpBtn">Confirm</button>
          <button id="resendOtp" style={{ marginTop: 5 }}>
            Resend OTP
          </button>
          <div id="successMsg" />
        </div>
      </div>
    </div>
  </div>
  {/* OTP Verification Page (hidden by default) */}
  <div
    id="otpPage"
    style={{
      display: "none",
      padding: 20,
      maxWidth: 500,
      margin: "50px auto",
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      textAlign: "center"
    }}
  >
    <h2>Verify Account</h2>
    <p>Please enter the OTP number sent to your email to reset your password</p>
    <p>Enter your OTP code here</p>
    <input type="text" id="enteredOtp" placeholder="Enter OTP" />
    <button
      id="submitOtpBtn"
      style={{
        marginTop: 10,
        padding: 10,
        backgroundColor: "#ff0000",
        color: "#fff",
        border: "none",
        borderRadius: 4
      }}
    >
      Confirm
    </button>
    <button
      id="resendOtpPage"
      style={{
        marginTop: 5,
        padding: 10,
        backgroundColor: "#ccc",
        border: "none",
        borderRadius: 4
      }}
    >
      Resend OTP
    </button>
  </div>
  {/* Your existing page content below */}
  <div className="header">
    <button>☰</button>
    <div>Crunch Time</div>
    <button>Delivery</button>
    <button>Pickup</button>
    <div className="search-bar">
      <input type="text" placeholder="Search Crunch Time " />
    </div>
    <button>Map Location - Pick up now</button>
  </div>
  <div className="filters">
    <button>
      <img
        src="Images/Ultraprocessed foods display 2 framed - shutterstock_2137640529_r.jpg"
        alt="Fast Food"
      />
      <span>Fast Food</span>
    </button>
    <button>
      <img src="Images/CR7 Veg .jpg" alt="Healthy" />
      <span>Healthy</span>
    </button>
    <button>
      <img src="Images/CR7.jpg" alt="Burgers" />
      <span>Burgers</span>
    </button>
    <button>
      <img src="Images/CR7 SUCCI.jpg" alt="Chinese" />
      <span>Chinese</span>
    </button>
    <button>
      <img src="Images/CR7 WINGS.jpg" alt="Wings" />
      <span>Wings</span>
    </button>
    <button>
      <img src="Images/CR7 PIZZA.webp" alt="Pizza" />
      <span>Pizza</span>
    </button>
    <button>
      <img src="Images/CR7 SUCCI .webp" alt="Halal" />
      <span>Halal</span>
    </button>
    <button>
      <img src="Images/CR7 KOREA .jpeg" alt="Korean" />
      <span>Korean</span>
    </button>
    <button>→</button>
  </div>
  <div className="restaurant-list">
    <div className="restaurant-card" onclick="alert('KFC Parow')">
      <img src="Images/RS KFC .jpeg" alt="KFC Parow" />
      <div className="details">
        <div>KFC, Parow</div>
        <div className="rating">4.4 ★</div>
        <div>Sponsored - 5 min - 4.4 km</div>
      </div>
      <button>♥</button>
    </div>
    <div className="restaurant-card" onclick="alert('Sannes Palace selected')">
      <img src="Images/RS PALACE .jpg" alt="Sannes Palace" />
      <div className="details">
        <div>Sannes Palace</div>
        <div className="rating">4.5 ★</div>
        <div>Spend ZAR 100, Save ZAR 15</div>
        <div>20 min - 0.5 km</div>
      </div>
      <button>♥</button>
    </div>
    <div
      className="restaurant-card"
      onclick="alert('DK Spot & Kota Restaurant selected')"
    >
      <img src="Images/RS KOTA .jpg" alt="DK Spot & Kota" />
      <div className="details">
        <div>DK Spot &amp; Kota Restaurant</div>
        <div className="rating">4.0 ★</div>
        <div>Uber Eats HDP-Owned - 16 min - 0.6 km</div>
      </div>
      <button>♥</button>
    </div>
    <div
      className="restaurant-card"
      onclick="alert('Nondyebo Eatery selected')"
    >
      <img src="Images/RS NONDYEBO.jpg" alt="Nondyebo Eatery" />
      <div className="details">
        <div>Nondyebo Eatery</div>
        <div className="rating">3.3 ★</div>
        <div>10 min - 0.6 km</div>
      </div>
      <button>♥</button>
    </div>
  </div>
</>
