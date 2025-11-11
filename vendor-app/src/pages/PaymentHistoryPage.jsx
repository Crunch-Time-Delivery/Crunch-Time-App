import React from 'react';

const PaymentHistory = ({ payments = [] }) => {
  return (
    <div>
      <h3>Payment History</h3>
      {payments.length === 0 ? (
        <p>No payment history.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>R {payment.amount.toFixed(2)}</td>
                <td>{payment.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistoryPage;