import React from 'react';
const DriverHistory = ({ loadMain }) => (
  <div>
    <h1>Payment History</h1>
    <div className="history-payment">
      <p><strong>Amount Payment :</strong> R 100</p>
      <p><strong>User Name:</strong> John Doe</p>
      <p><strong>Date Pick-up:</strong> August 10, 2025</p>
      <p><strong>Location Pick-up:</strong> Park street, Cape Town</p>
      <p><strong>Location Drop-off:</strong> Board street, Cape Town</p>
    </div>
    <a href="#" onClick={(e) => { e.preventDefault(); loadMain(); }}>Back</a>
  </div>
);
export default DriverHistory;