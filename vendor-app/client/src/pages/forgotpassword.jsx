<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Forgot Password</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n  body {\n    font-family: Arial, sans-serif;\n    background-color: #f2f2f2;\n  }\n  .container {\n    max-width: 400px;\n    margin: 80px auto;\n    padding: 30px;\n    background-color: #fff;\n    border-radius: 8px;\n    box-shadow: 0 0 10px rgba(0,0,0,0.1);\n    text-align: center;\n  }\n  h2 {\n    margin-bottom: 20px;\n  }\n  input[type="email"] {\n    width: 80%;\n    padding: 10px;\n    margin-top: 10px;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n  }\n  button {\n    margin-top: 20px;\n    padding: 10px 20px;\n    background-color: #ff0000;\n    color:#fff;\n    border:none;\n    border-radius: 5px;\n    cursor: pointer;\n    font-size: 16px;\n  }\n  button:hover {\n    background-color: #b30000;\n  }\n  #message {\n    margin-top: 20px;\n    font-size: 14px;\n    color: rgb(128, 0, 0);\n  }\n'
    }}
  />
  {/* Include Supabase JS SDK */}
  <div className="container">
    <img
      src="img/screenshot (251).jpg"
      alt="Welcome Image"
      style={{ width: 250, height: "auto", marginBottom: 20 }}
    />
    <h2>Forgot Password</h2>
    <p>Enter your email address to reset your password.</p>
    <input type="email" id="forgotEmail" placeholder="Email" />
    <br />
    <button id="resetBtn">Reset Password</button>
    <div id="message" />
  </div>
</>
