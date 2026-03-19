import React, { useState, useEffect } from 'react';

const DriverHistoryPayment = () => {
  const [paymentHistory, setPaymentHistory] = useState([
    {
      date: '2024-04-01',
      amount: 15.50,
      orderId: 'ORD1234',
    },
    {
      date: '2024-04-02',
      amount: 22.75,
      orderId: 'ORD1235',
    },
    // Add more mock data or fetch from API
     ]);
return (
    <div>
      <h2>Payment History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Order ID</th>
            <th>Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((payment, index) => (
            <tr key={index}>
              <td>{payment.date}</td>
              <td>{payment.orderId}</td>
              <td>{payment.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverHistoryPayment;