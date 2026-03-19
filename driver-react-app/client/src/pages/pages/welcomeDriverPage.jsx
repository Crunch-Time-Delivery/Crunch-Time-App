<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome - Driver App</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  body {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n    background-color: #f4f4f4;\n  }\n\n  /* Center the welcome content vertically and horizontally */\n  #welcomeInline {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n  }\n\n  #welcomeContent {\n    max-width: 350px;\n    padding: 20px;\n    border-radius: 8px;\n    box-shadow: 0 0 10px rgba(0,0,0,0.2);\n    background: #fff;\n    text-align: center;\n  }\n\n  #welcomeContent img {\n    width: 250px;\n    height: auto;\n    margin-bottom: 20px;\n  }\n\n  /* Buttons styling */\n  .centered-buttons {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 10px; /* space between buttons */\n  }\n  .centered-buttons button {\n    width: 200px;\n    padding: 12px 20px;\n    font-size: 1em;\n    cursor: pointer;\n    border-radius: 8px;\n    border: none;\n    transition: background-color 0.3s, transform 0.2s;\n    font-weight: bold;\n  }\n\n\n  \n  /* Buttons styled as links, matching overlay button styles */\n  .btn {\n    display: block;\n    width: 100%;\n    padding: 12px;\n    margin: 10px 0;\n    font-size: 1em;\n    cursor: pointer;\n    border-radius: 4px;\n    border: none;\n    text-align: center;\n    font-weight: bold;\n    transition: background-color 0.3s, color 0.3s;\n  }\n\n  /* Style for Create Account and Browser Menu buttons to match overlay buttons */\n  .btn-create, .btn-browser {\n    background: #f60202; /* red background */\n    color: #fff; /* white text */\n  }\n\n  /* Optional: hover effects for these buttons */\n  .btn-create:hover, .btn-browser:hover {\n    background: #c00101;\n  }\n\n  /* Style for Login button to match overlay login button styles if needed */\n  #loginBtn {\n    background: #fff; /* white background */\n    color: #f60202; /* red text */\n    border: 1px solid #f60202;\n  }\n\n  #loginBtn:hover {\n    background: #f60202;\n    color: #fff;\n  }\n/*\n  /* Specific styles for each button */\n  .btn-create {\n    background: #f60202; /* red background */\n    color: #fff;\n  }\n  .btn-create:hover {\n    background-color: #d00101; /* darker red on hover */\n    transform: scale(1.05);\n  }\n\n  .btn-login {\n    background: #fff; /* white background */\n    color: #f60202; /* red text */\n    border: 2px solid #f60202; /* border for better visibility */\n  }\n  .btn-login:hover {\n    background-color: #f60202;\n    color: #fff;\n    transform: scale(1.05);\n  }\n\n  .btn-browser {\n    background: #f60202; /* red background */\n    color: #fff;\n  }\n  .btn-browser:hover {\n    background-color: #d00101; /* darker red on hover */\n    transform: scale(1.05);\n  }\n\n  /* Terms and Privacy links styling */\n  #termsText {\n    margin-top: 20px;\n    text-align: center;\n    font-size: 0.9em;\n    color: #555;\n  }\n  #termsText a {\n    color: red;\n    text-decoration: underline;\n  }\n"
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
        <button
          className="btn btn-create"
          onclick="window.location.href='http://127.0.0.1:5501/driver-app/client/public/registerDriver.html'"
        >
          Create account
        </button>
        <button
          className="btn"
          onclick="window.location.href='http://127.0.0.1:5501/driver-app/client/public/Login/loginDriver.html'"
        >
          Login
        </button>
        <button
          className="btn btn-browser"
          onclick="window.location.href='dummy.html'"
        >
          Browser Menu
        </button>
      </div>
      <p id="termsText">
        By logging in or registering, you have agreed to the
        <a
          href="http://127.0.0.1:5501/driver-app/client/public/terms-and-conditions.page.html"
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
    /
  </div>
</>
