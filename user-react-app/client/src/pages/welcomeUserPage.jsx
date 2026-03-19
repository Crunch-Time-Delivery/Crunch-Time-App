<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome - Driver App</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  body {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n    background-color: #f4f4f4;\n  }\n\n  /* Center the welcome content vertically and horizontally */\n  #welcomeInline {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n  }\n\n  #welcomeContent {\n    max-width: 350px;\n    padding: 20px;\n    border-radius: 8px;\n    box-shadow: 0 0 10px rgba(0,0,0,0.2);\n    background: #fff;\n    text-align: center;\n  }\n\n  #welcomeContent img {\n    width: 250px;\n    height: auto;\n    margin-bottom: 20px;\n  }\n\n  /* Buttons styled as links, matching overlay button styles */\n  .btn {\n    display: block;\n    width: 100%;\n    padding: 12px;\n    margin: 10px 0;\n    font-size: 1em;\n    cursor: pointer;\n    border-radius: 4px;\n    border: none;\n    text-align: center;\n    font-weight: bold;\n    transition: background-color 0.3s, color 0.3s;\n  }\n\n  /* Style for Create Account and Browser Menu buttons to match overlay buttons */\n  .btn-create, .btn-browser {\n    background: #f60202; /* red background */\n    color: #fff; /* white text */\n  }\n\n  /* Optional: hover effects for these buttons */\n  .btn-create:hover, .btn-browser:hover {\n    background: #c00101;\n  }\n\n  /* Style for Login button to match overlay login button styles if needed */\n  #loginBtn {\n    background: #fff; /* white background */\n    color: #f60202; /* red text */\n    border: 1px solid #f60202;\n  }\n\n  #loginBtn:hover {\n    background: #f60202;\n    color: #fff;\n  }\n\n  /* Terms and Privacy links within paragraph */\n  #welcomeContent p {\n    margin-top: 20px;\n    font-size: 14px;\n  }\n  #welcomeContent a {\n    color: #f60202;\n    text-decoration: underline;\n  }\n"
    }}
  />
  <div id="welcomeInline">
    <div id="welcomeContent">
      <img src="img/screenshot (250).jpg" alt="Welcome Image" />
      <h2 style={{ color: "gray" }}>Welcome</h2>
      <p>Before enjoying CrunchTime deliveries</p>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        {/* Buttons with shared class to get styled as overlay buttons */}
        <button
          id="createAccountBtn"
          className="btn btn-create"
          onclick="handleCreateAccount()"
        >
          Create account
        </button>
        <button id="loginBtn" className="btn" onclick="handleLogin()">
          Login
        </button>
        <button
          id="browserMenuBtn"
          className="btn btn-browser"
          onclick="window.location.href='dummy.html';"
        >
          Browser Menu
        </button>
      </div>
      <p>
        By logging in or registering, you have agreed to the
        <a
          href="http://127.0.0.1:5501/user-app/client/public/terms-and-conditions.page.html"
          target="_blank"
        >
          Terms and Conditions
        </a>
        and
        <a href="dummy_privacy.pdf" target="_blank">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  </div>
</>
