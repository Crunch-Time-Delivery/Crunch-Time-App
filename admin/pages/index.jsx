<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Dashboard</title>
  {/* Include Chart.js */}
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  body {\n    font-family: Arial, sans-serif; background:#f0f2f5; margin:0; padding-top:70px;\n  }\n\n  /* Top header with CRUNCHTIME */\n  .top-header {\n    width: 100%;\n    background: #fff;\n    padding: 10px 20px;\n    font-weight: bold;\n    font-size: 24px;\n    color: red;\n    text-align: center;\n    border-bottom: 1px solid #ccc;\n  }\n\n  /* Fixed Header styles */\n  .header {\n    display:flex; justify-content:space-between; align-items:center;\n    background:red; padding:10px 20px; color:#fff; position:fixed; top:0; width:100%; height:60px; z-index:1000; border-bottom:1px solid #ccc;\n  }\n\n  /* Menu container styles */\n  .menu-container {\n    position:relative;\n  }\n  #menuDropdown {\n    display:none;\n    position:absolute; top:100%; left:0; background:#fff; border:1px solid #ccc; padding:5px; box-shadow:0 2px 8px rgba(0,0,0,0.2);\n    z-index: 1001; width:200px;\n  }\n  #menuDropdown button {\n    display:block; width:100%; padding:8px; border:none; background:none; cursor:pointer; text-align:left;\n  }\n\n  /* Profile section styles */\n  .profile-section {\n    display:flex; align-items:center; cursor:pointer; margin-left:auto;\n  }\n  #profileImage {\n    border-radius:50%; width:40px; height:40px; object-fit:cover;\n  }\n  .admin-name {\n    margin-left:10px;\n  }\n\n  /* Sections hidden/shown */\n  .section { display:none; padding-top:70px; }\n  .section.active { display:block; }\n\n  /* Buttons styling */\n  button {\n    padding:8px 12px; border:none; border-radius:4px; cursor:pointer; margin:5px;\n  }\n  .btn-primary { background:#4CAF50; color:#fff; }\n  .btn-primary:hover { background:#45a049; }\n\n  /* Modal overlays for login, admin update, role view */\n  .modal {\n    display: flex; align-items: center; justify-content: center;\n    position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n    background: rgba(0,0,0,0.5); z-index:9999;\n  }\n  .modal-box {\n    background:#fff; padding:30px; border-radius:8px; width:400px; max-height:80%; overflow-y:auto;\n  }\n\n  /* Additional styling for dashboard elements */\n  h2 { margin-bottom:10px; }\n\n  /* Filter dropdown style */\n  #filterDropdown {\n    display: none; position: absolute; top: 100%; left: 0; background: #fff; border: 1px solid #ccc; padding: 10px; z-index: 1002; width: 200px;\n  }\n  #filterDropdown button {\n    display: block; width: 100%; padding: 8px; border: none; background: none; cursor: pointer; text-align: left;\n  }\n\n  /* Chart container styles */\n  .chart-container {\n    display: flex; flex-direction: column; align-items: center; margin-top: 20px;\n  }\n  canvas {\n    max-width: 400px; margin: 20px 0;\n  }\n\n  /* Role Buttons */\n  .role-buttons {\n    display: flex; gap: 10px;\n  }\n  /* Style for percentage change texts */\n  .percentage-change {\n    font-size: 14px; margin-left: 10px;\n  }\n  .chart-container {\n    padding: 20px; /* Adjusted for clarity */\n  }\n"
    }}
  />
  {/* ================== LOGIN MODAL ================== */}
  <div id="loginModal" className="modal" style={{ display: "flex" }}>
    <div className="modal-box">
      <div
        className="modal-content"
        style={{
          maxWidth: 300,
          padding: 20,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <img
          src="Screenshot (254).jpg"
          alt="Welcome Image"
          style={{ width: 250, height: "auto", marginBottom: 20 }}
        />
        <h2 style={{ color: "gray" }}>Welcome</h2>
        <h3>Admin Login</h3>
        <label>Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <label>Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button
          style={{ width: "100%", backgroundColor: "red" }}
          onclick="verifyLogin()"
        >
          Login
        </button>
      </div>
    </div>
  </div>
  {/* ================== Admin Credential Popup ================== */}
  <div id="adminPopup" className="modal" style={{ display: "none" }}>
    <div className="modal-box" style={{ width: 400 }}>
      <img
        src="Screenshot (254).jpg"
        alt="Welcome Image"
        style={{ width: 250, height: "auto", marginBottom: 20 }}
      />
      <h3>Admin Update</h3>
      <div>
        <label>Change Username:</label>
        <input
          type="text"
          id="newUsername"
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>
      <div>
        <label>Change Password:</label>
        <input
          type="password"
          id="newPassword"
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>
      <button onclick="saveAdminCredentials()">Save Credentials</button>
      <hr style={{ margin: "10px 0" }} />
      <h4>Add New Admin</h4>
      <div>
        <label>Email:</label>
        <input
          type="email"
          id="newAdminEmail"
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          id="newAdminUsername"
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          id="newAdminPassword"
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>
      <button onclick="addNewAdmin()">Add Admin</button>
      <button
        style={{
          marginTop: 10,
          background: "red",
          color: "#fff",
          width: "100%"
        }}
        onclick="closeAdminPopup()"
      >
        Close
      </button>
    </div>
  </div>
  {/* ================== HEADER with Menu & Profile ================== */}
  <div className="header">
    {/* Menu Dropdown */}
    <div className="menu-container">
      <div
        className="menu-icon"
        title="Menu"
        style={{ cursor: "pointer", fontSize: 24 }}
        onclick="toggleMenuDropdown()"
      >
        ☰
      </div>
      <div id="menuDropdown">
        <button onclick="showSection('dashboard')">Dashboard</button>
        <button onclick="window.location.href='http://127.0.0.1:5501/admin/estabilshment.html '">
          Establishment
        </button>
        <button onclick="window.location.href='http://127.0.0.1:5501/admin/restaurant_menu.html '">
          Restaurant Menu
        </button>
        <button onclick="showSection('Driver')">Driver</button>
        <button onclick="showSection('Vendor')">Vendor</button>
      </div>
    </div>
    {/* Profile Section */}
    <div
      className="profile-section"
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      onclick="triggerProfileImageUpload()"
    >
      <img
        src="https://via.placeholder.com/40"
        id="profileImage"
        alt="Profile"
      />
      <input
        type="file"
        id="profileImageInput"
        accept="image/*"
        style={{ display: "none" }}
        onchange="updateProfileImage(event)"
      />
      <div className="admin-name" id="adminName">
        Admin
      </div>
    </div>
  </div>
  {/* ================== DASHBOARD ================== */}
  <div id="dashboard" className="section active">
    {/* Dashboard content */}
    {/* Your existing dashboard code for summary, charts, etc. */}
    {/* Insert the dashboard details from your previous code here: */}
    {/* For brevity, I'll just include the main dashboard info below */}
    {/* The dashboard code begins: */}
    <div>
      <div className="top-bar" style={{ marginTop: 0 }}>
        <div className="profile-section">
          <div className="profile-picture" />
          <div className="admin-name">Admin Dashboard</div>
        </div>
        <div className="menu-icon" title="Menu">
          ☰
        </div>
      </div>
      <div className="dashboard-container">
        {/* Filters & Income */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px 0 20px"
          }}
        >
          <div style={{ position: "relative" }}>
            <button onclick="toggleFilterDropdown()">
              Filter Establishments ▼
            </button>
            <div id="filterDropdown">
              <button onclick="filterEstablishments('All')">All</button>
              <button onclick="filterEstablishments('Type 1')">Type 1</button>
              <button onclick="filterEstablishments('Type 2')">Type 2</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ backgroundColor: "red", color: "#fff" }}>
              Total Income
            </button>
            <button style={{ backgroundColor: "red", color: "#fff" }}>
              Income
            </button>
            <button style={{ backgroundColor: "red", color: "#fff" }}>
              Expense
            </button>
            <button style={{ backgroundColor: "red", color: "#fff" }}>
              Withdraw
            </button>
          </div>
        </div>
        {/* Total Income and Amounts for Income, Expense, Withdraw with % */}
        <div style={{ marginTop: 20, paddingLeft: 20 }}>
          <h2>
            Total Income: <span id="incomeAmount">R10,000</span>
            <span className="percentage-change" id="incomePerc" />
          </h2>
          <h2>
            Expense: <span id="expenseAmount">R5,000</span>
            <span className="percentage-change" id="expensePerc" />
          </h2>
          <h2>
            Withdraw: <span id="withdrawAmount">R2,000</span>
            <span className="percentage-change" id="withdrawPerc" />
          </h2>
          {/* PayFast Payment Button */}
          <form
            action="https://sandbox.payfast.co.za/eng/merchant"
            method="post"
          >
            {/* Replace with your PayFast Merchant ID and other required fields */}
            <input type="hidden" name="merchant_id" defaultValue={10000100} />
            <input
              type="hidden"
              name="merchant_key"
              defaultValue="46f0cd694581a"
            />
            <input
              type="hidden"
              name="return_url"
              defaultValue="http://127.0.0.1:5501/admin/index.html"
            />
            <input
              type="hidden"
              name="cancel_url"
              defaultValue="http://127.0.0.1:5501/admin/index.html"
            />
            <input
              type="hidden"
              name="notify_url"
              defaultValue="https://yourwebsite.com/payment-notify"
            />
            <input type="hidden" name="amount" defaultValue={2000} />{" "}
            {/* Amount to pay, e.g., R2000 */}
            <input
              type="hidden"
              name="item_name"
              defaultValue="Withdrawal Payment"
            />
            <input type="hidden" name="item_name" defaultValue="incomeAmount" />
            <input
              type="hidden"
              name="item_name"
              defaultValue="expenseAmount"
            />
            <button type="submit">Payment History</button>
          </form>
        </div>
        {/* Performance Section */}
        <div
          className="performance-section"
          style={{ marginTop: 20, padding: "0 20px" }}
        >
          <div
            className="performance-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                className="performance-title"
                style={{ fontSize: 20, fontWeight: "bold" }}
              >
                Performance
              </div>
              <div
                className="performance-icon"
                title="Performance"
                style={{ fontSize: 24 }}
              >
                📈
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 24 }}>📈</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 20
            }}
          >
            <div style={{ position: "relative", width: 150, height: 150 }}>
              <svg
                viewBox="0 0 100 100"
                width={150}
                height={150}
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx={50}
                  cy={50}
                  r={45}
                  stroke="#eee"
                  strokeWidth={10}
                  fill="none"
                />
                <circle
                  cx={50}
                  cy={50}
                  r={45}
                  stroke="yellow"
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray="282.6"
                  strokeDashoffset="84.78"
                  fill="none"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: 24,
                  fontWeight: "bold"
                }}
              >
                70%
              </div>
            </div>
            {/* Year Dropdown */}
            <div className="year-dropdown" style={{ position: "relative" }}>
              <button className="year-button" onclick="toggleYearDropdown()">
                January ▼
              </button>
              <div
                className="year-options"
                id="yearOptions"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  flexDirection: "column",
                  zIndex: 10
                }}
              >
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('January')"
                >
                  January
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('February')"
                >
                  February
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('March')"
                >
                  March
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('April')"
                >
                  April
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('May')"
                >
                  May
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('June')"
                >
                  June
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('July')"
                >
                  July
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('August')"
                >
                  August
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('September')"
                >
                  September
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('October')"
                >
                  October
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('November')"
                >
                  November
                </div>
                <div
                  style={{ padding: 8, cursor: "pointer" }}
                  onclick="selectMonth('December')"
                >
                  December
                </div>
              </div>
            </div>
          </div>
          {/* Order Total & Target Boxes */}
          <div
            className="boxes-container"
            style={{ display: "flex", gap: 20, marginTop: 20 }}
          >
            {/* Order Total */}
            <div
              className="box"
              style={{
                background: "#fff",
                padding: 15,
                flex: 1,
                borderRadius: 8,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              <div
                className="box-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10
                }}
              >
                <div
                  className="profile-icon"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#ccc",
                    marginRight: 10
                  }}
                />
                <div className="box-title" style={{ fontWeight: "bold" }}>
                  Order Total
                </div>
              </div>
              <div className="box-amount" style={{ fontSize: 20 }}>
                R5000
              </div>
            </div>
            {/* Target */}
            <div
              className="box"
              style={{
                background: "#fff",
                padding: 15,
                flex: 1,
                borderRadius: 8,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              <div
                className="box-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10
                }}
              >
                <div
                  className="profile-icon"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#ccc",
                    marginRight: 10
                  }}
                />
                <div className="box-title" style={{ fontWeight: "bold" }}>
                  Target
                </div>
              </div>
              <div className="target-container" style={{ marginTop: 10 }}>
                <div
                  className="linear-bar"
                  style={{
                    height: 10,
                    background: "#ddd",
                    borderRadius: 5,
                    overflow: "hidden"
                  }}
                >
                  <div
                    className="target-progress"
                    style={{ width: "75%", height: 10, background: "#4caf50" }}
                  />
                </div>
                <div style={{ marginTop: 10 }}>Target: 75%</div>
              </div>
            </div>
          </div>
          {/* Last Month & Last Year */}
          <div
            className="selection-row"
            style={{ display: "flex", gap: 20, marginTop: 20 }}
          >
            {/* One This Month */}
            <div className="select-box" style={{ flex: 1 }}>
              <div
                className="select-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h4>One This Month</h4>
                <div
                  className="option-icon"
                  title="Options"
                  style={{
                    width: 30,
                    height: 30,
                    background: "#eee",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  ⋮
                </div>
              </div>
              <div>Number: 80</div>
              <div
                className="wave-graph"
                style={{
                  height: 50,
                  background: "#e0e0e0",
                  marginTop: 10,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Wave Graph
              </div>
              <canvas id="waveGraphThisMonth" width={400} height={200} />
            </div>
            {/* Last Year */}
            <div className="select-box" style={{ flex: 1 }}>
              <div
                className="select-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h4>One Last</h4>
                <div
                  className="option-icon"
                  title="Options"
                  style={{
                    width: 30,
                    height: 30,
                    background: "#eee",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  ⋮
                </div>
              </div>
              <div>Number: 70</div>
              <div
                className="wave-graph"
                style={{
                  height: 50,
                  background: "#e0e0e0",
                  marginTop: 10,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Wave Graph
              </div>
              <canvas id="waveGraphLastYear" width={400} height={200} />
            </div>
          </div>
          {/* Additional info rows */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              flexDirection: "column",
              gap: 15,
              padding: "0 20px"
            }}
          >
            {/* Total orders complete */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 24 }}>
                <img
                  src="Screenshot (262).png"
                  alt="Image"
                  style={{ width: 100, height: "auto", marginBottom: 20 }}
                />
              </div>
              <div style={{ fontWeight: "bold" }}>Total orders complete</div>
              <div style={{ marginLeft: "auto" }}>2687</div>
            </div>
            {/* Total orders delivered */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 24 }}>
                <img
                  src="Screenshot (262).png"
                  alt="Image"
                  style={{ width: 100, height: "auto", marginBottom: 20 }}
                />
              </div>
              <div style={{ fontWeight: "bold" }}>Total orders delivered</div>
              <div style={{ marginLeft: "auto" }}>1784</div>
            </div>
            {/* Total orders canceled */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 24 }}>
                <img
                  src="Screenshot (261).png"
                  alt="Image"
                  style={{ width: 100, height: "auto", marginBottom: 20 }}
                />
              </div>
              <div style={{ fontWeight: "bold" }}>Total orders canceled</div>
              <div style={{ marginLeft: "auto" }}>86</div>
            </div>
            {/* Orders pending */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 24 }}>
                <img
                  src="Screenshot (260).png"
                  alt="Image"
                  style={{ width: 100, height: "auto", marginBottom: 20 }}
                />
              </div>
              <div style={{ fontWeight: "bold" }}>Orders pending</div>
              <div style={{ marginLeft: "auto" }}>467</div>
            </div>
          </div>
          {/* Popular Food Chart */}
          <div className="popular-food" style={{ marginTop: 30 }}>
            <div
              className="food-header"
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 2 }}
            >
              Popular Food
            </div>
            <div className="chart-container" style={{ marginTop: 3 }}>
              <canvas id="circleChart" width={400} height={400} />
            </div>
            <div
              className="food-types"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 5
              }}
            >
              <div
                className="food-item"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  className="food-color"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#FF6384"
                  }}
                />
                <div>Fast Food - 40%</div>
              </div>
              <div
                className="food-item"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  className="food-color"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#36A2EB"
                  }}
                />
                <div>Asian - 20%</div>
              </div>
              <div
                className="food-item"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  className="food-color"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#FFCE56"
                  }}
                />
                <div>Pasta - 15%</div>
              </div>
              <div
                className="food-item"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  className="food-color"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#4BC0C0"
                  }}
                />
                <div>Mexican - 10%</div>
              </div>
              <div
                className="food-item"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  className="food-color"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#9966FF"
                  }}
                />
                <div>Turkish - 5%</div>
              </div>
              <div
                className="food-item"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  className="food-color"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#FF9F40"
                  }}
                />
                <div>Desserts - 10%</div>
              </div>
            </div>
          </div>
          {/* View Select Role Button */}
          <div style={{ margin: "30px 20px" }}>
            <button
              style={{
                background: "red",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer"
              }}
              onclick="showRolePopup()"
            >
              View Select Role
            </button>
          </div>
          {/* Role Management Popup */}
          <div
            id="rolePopup"
            className="modal"
            style={{ display: "none", flexDirection: "column" }}
          >
            <div
              className="modal-box"
              style={{ width: "90%", maxHeight: "90%", overflowY: "auto" }}
            >
              <h3>Role Management</h3>
              {/* User, Vendor, Driver Tables */}
              <h4>User Accounts</h4>
              <table
                border={1}
                cellPadding={5}
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>user1@gmail.com</td>
                    <td className="role-buttons">
                      <button onclick="viewRoleInfo('User', 'user1@example.com')">
                        View
                      </button>
                      <button onclick="deleteRole('User', 'user1@example.com')">
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>user2@gmail.com</td>
                    <td className="role-buttons">
                      <button onclick="viewRoleInfo('User', 'user2@example.com')">
                        View
                      </button>
                      <button onclick="deleteRole('User', 'user2@example.com')">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h4>Vendor Accounts</h4>
              <table
                border={1}
                cellPadding={5}
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>vendor1@gmail.com</td>
                    <td className="role-buttons">
                      <button onclick="viewRoleInfo('Vendor', 'vendor1@example.com')">
                        View
                      </button>
                      <button onclick="deleteRole('Vendor', 'vendor1@example.com')">
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>vendor2@gmail.com</td>
                    <td className="role-buttons">
                      <button onclick="viewRoleInfo('Vendor', 'vendor2@example.com')">
                        View
                      </button>
                      <button onclick="deleteRole('Vendor', 'vendor2@example.com')">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h4>Driver Accounts</h4>
              <table
                border={1}
                cellPadding={5}
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>driver1@gmail.com</td>
                    <td className="role-buttons">
                      <button onclick="viewRoleInfo('Driver', 'driver1@example.com')">
                        View
                      </button>
                      <button onclick="deleteRole('Driver', 'driver1@example.com')">
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>driver2@gmail.com</td>
                    <td className="role-buttons">
                      <button onclick="viewRoleInfo('Driver', 'driver2@example.com')">
                        View
                      </button>
                      <button onclick="deleteRole('Driver', 'driver2@example.com')">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                style={{
                  marginTop: 15,
                  background: "red",
                  color: "#fff",
                  width: "100%",
                  padding: 10,
                  border: "none",
                  borderRadius: 6
                }}
                onclick="closeRolePopup()"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ================== Driver Section ================== */}
  <div
    id="Driver"
    className="section"
    style={{ display: "none", paddingTop: 70 }}
  >
    <h2 style={{ marginLeft: 20 }}>Driver Info &amp; Orders</h2>
    <div style={{ padding: 20 }}>
      {/* Driver 1 */}
      <div
        className="driver-profile"
        style={{ display: "flex", marginBottom: 20 }}
      >
        <img
          src="https://via.placeholder.com/80"
          className="driver-img"
          alt="Driver"
        />
        <div className="driver-info" style={{ marginLeft: 10 }}>
          <h4>John Doe</h4>
          <div className="driver-details">
            <p>Contact: 123-456-7890</p>
            <p>Plate: ABC-1234</p>
            <p>Email: john@gmail.com</p>
            <p>Ratings: 4.5 ★</p>
            <p>Comments: Very punctual.</p>
          </div>
          <button
            className="hyperlink-red"
            onclick="showPastDeliveries('John Doe')"
          >
            Past Deliveries
          </button>
          <button className="hyperlink-red" onclick="showDocuments('John Doe')">
            View Documents
          </button>
        </div>
      </div>
      {/* Driver 2 */}
      <div
        className="driver-profile"
        style={{ display: "flex", marginBottom: 20 }}
      >
        <img
          src="https://via.placeholder.com/80"
          className="driver-img"
          alt="Driver"
        />
        <div className="driver-info" style={{ marginLeft: 10 }}>
          <h4>Jane Smith</h4>
          <div className="driver-details">
            <p>Contact: 987-654-3210</p>
            <p>Plate: XYZ-5678</p>
            <p>Email: jane@gmail.com</p>
            <p>Ratings: 4.8 ★</p>
            <p>Comments: Great driver.</p>
          </div>
          <button
            className="hyperlink-red"
            onclick="showPastDeliveries('Jane Smith')"
          >
            Past Deliveries
          </button>
          <button
            className="hyperlink-red"
            onclick="showDocuments('Jane Smith')"
          >
            View Documents
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* ================== Vendor Section ================== */}
  <div
    id="Vendor"
    className="section"
    style={{ display: "none", paddingTop: 70 }}
  >
    <h2 style={{ marginLeft: 20 }}>Vendor Management</h2>
    <div style={{ padding: 20 }}>
      <button onclick="showVendors()">Show All Vendors</button>
    </div>
  </div>
  {/* ================== Role Info Popup ================== */}
  <div id="roleInfoPopup" className="modal" style={{ display: "none" }}>
    <div
      className="modal-box"
      style={{ width: "90%", maxHeight: "90%", overflowY: "auto" }}
    >
      <h3>Role Information</h3>
      <div id="roleInfoContent" style={{ marginBottom: 20 }}>
        {" "}
        {/* Role details inserted here */}{" "}
      </div>
      <button
        style={{
          marginTop: 10,
          background: "rgb(255, 0, 0)",
          color: "#fff",
          width: "100%",
          padding: 10,
          border: "none",
          borderRadius: 6
        }}
        onclick="sendNotification()"
      >
        Send Email/Notification
      </button>
      <button
        style={{
          marginTop: 10,
          background: "red",
          color: "#fff",
          width: "100%",
          padding: 10,
          border: "none",
          borderRadius: 6
        }}
        onclick="closeRoleInfo()"
      >
        Close
      </button>
    </div>
  </div>
  {/* ================== Scripts ================== */}
  {/* Import your supabase client setup (from your code) */}
</>
