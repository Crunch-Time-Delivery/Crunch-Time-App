// CheckoutPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';

function CheckoutPage() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Checkout</title>
        <style>
          /* Your styles here, same as in your HTML */
          #checkoutPage { padding:20px; background:#fff; max-width:600px; margin:auto; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.2); }
          #checkoutPage h2, #checkoutPage h3 { margin-top:0; }
          #checkoutItems { list-style:none; padding:0; }
          #checkoutItems li { margin-bottom:8px; }
          #payNowButton { background-color:red; color:#fff; padding:15px; border:none; border-radius:8px; font-size:16px; font-weight:bold; cursor:pointer; width:100%; margin-top:20px; }
          /* ... other styles ... */
        </style>
      </head>
      <body>
        <!-- Your entire HTML content from above -->
        <div id="checkoutPage">
          <h2>Checkout</h2>
          <h3>Order Summary</h3>
          <ul id="checkoutItems"></ul>
          <h3>Total: <span id="totalAmount">R0</span></h3>
          <button id="payNowButton" onclick="showPaymentMethodPage()">Pay</button>
        </div>
        <!-- Modal, other elements... -->
        <div id="paymentPopup" class="modal" style="display:none;">...</div>
        <div id="bankDetailsInput" class="modal" style="display:none;">...</div>
        <div id="notification" style="display:none;">...</div>
        <script>
          // Your embedded scripts from HTML, e.g., functions like showNotificationMessage, populateOrderSummary, etc.
          // For testing, you might need to stub or mock some functions.
        </script>
        <!-- External scripts -->
        <script src="server/supabase/supabaseClient.js" async></script>
        <script src="client/public/functions/mainTwilioFunction.js" async></script>
        <!-- ... other scripts ... -->
      </body>
      </html>
      `
    }} />
  );
}

test('renders checkout page with order summary', () => {
  render(<CheckoutPage />);
  expect(screen.getByText(/Checkout/)).toBeInTheDocument();
  expect(screen.getByText(/Order Summary/)).toBeInTheDocument();

  // Check total amount
  expect(screen.getByText(/R0/)).toBeInTheDocument();

  // Check the Pay button
  const payButton = screen.getByRole('button', { name: /Pay/ });
  expect(payButton).toBeInTheDocument();
});
