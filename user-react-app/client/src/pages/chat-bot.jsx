<>
  <meta charSet="UTF-8" />
  <title>AI Chat App - Pro</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\nbody {\n  margin: 0;\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  background: #f0f2f5;\n}\n.top-bar {\n  background: #ef0606;\n  color: #fff;\n  padding: 12px 16px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  position: sticky;\n  top: 0;\n  z-index: 100;\n}\n.top-bar button {\n  background: #fff;\n  color: #ed0808;\n  border: none;\n  padding: 6px 14px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-weight: bold;\n  font-size: 12px;\n  margin-left: 5px;\n}\n.chat-container {\n  max-width: 500px;\n  margin: 20px auto;\n  background: #fff;\n  border-radius: 14px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.08);\n  display: flex;\n  flex-direction: column;\n  height: 80vh;\n}\n.messages {\n  flex: 1;\n  padding: 15px;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n}\n.msg {\n  margin-bottom: 12px;\n  padding: 10px 14px;\n  border-radius: 15px;\n  max-width: 80%;\n  font-size: 14px;\n  position: relative;\n  line-height: 1.4;\n}\n.msg .time {\n  font-size: 10px;\n  display: block;\n  margin-top: 5px;\n  opacity: 0.7;\n}\n.user {\n  background: #f20909;\n  color: #fff;\n  margin-left: auto;\n  border-bottom-right-radius: 2px;\n}\n.bot {\n  background: #f1f3f4;\n  color: #333;\n  margin-right: auto;\n  border-bottom-left-radius: 2px;\n}\n.input-box {\n  display: flex;\n  padding: 10px;\n  border-top: 1px solid #eee;\n}\n.input-box input {\n  flex: 1;\n  padding: 12px;\n  border: 1px solid #ddd;\n  border-radius: 25px;\n  outline: none;\n  padding-left: 20px;\n}\n.input-box button {\n  background: #f40404;\n  color: #fff;\n  border: none;\n  padding: 0 20px;\n  margin-left: 10px;\n  border-radius: 25px;\n  cursor: pointer;\n}\n.input-box button:disabled {\n    background: #ccc;\n}\n"
    }}
  />
  <div className="top-bar" id="topBar">
    <div>AI Chat Bot 🤖</div>
    <div id="googleSignInButton" />
  </div>
  <div className="chat-container">
    <div className="messages" id="messages" />
    <div className="input-box">
      <input
        id="messageInput"
        disabled=""
        placeholder="Please log in…"
        onkeypress="handleKeyPress(event)"
      />
      <button id="sendBtn" disabled="" onclick="sendMessage()">
        Send
      </button>
    </div>
  </div>
</>
