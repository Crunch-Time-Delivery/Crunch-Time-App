
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handlePayNow = () => {
    if (!selectedCard) {
      alert('Please select a payment method.');
      return;
    }

    // Call your backend to create the PayFast payment URL
    fetch('/create-payfast-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100.00, // Example amount
        item_name: 'Sample Item',
        card_type: selectedCard, // optional if needed
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.paymentUrl) {
          // Redirect user to PayFast
          window.location.href = data.paymentUrl;
        } else {
          alert('Error generating payment URL.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to initiate payment.');
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Choose Your Payment Method</h1>

      {/* Payment Options */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
        {/* Visa */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: selectedCard === 'Visa' ? '2px solid blue' : '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
          }}
          onClick={() => handleCardSelect('Visa')}
        >
          <img
            src="https://img.icons8.com/color/48/000000/visa.png"
            alt="Visa"
            style={{ width: '50px', height: '30px' }}
          />
          <span>Visa</span>
        </div>

        {/* MasterCard */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: selectedCard === 'MasterCard' ? '2px solid blue' : '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
          }}
          onClick={() => handleCardSelect('MasterCard')}
        >
          <img
            src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
            alt="MasterCard"
            style={{ width: '50px', height: '30px' }}
          />
          <span>MasterCard</span>
        </div>

        {/* Amex */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: selectedCard === 'Amex' ? '2px solid blue' : '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
          }}
          onClick={() => handleCardSelect('Amex')}
        >
          <img
            src="https://img.icons8.com/color/48/000000/amex.png"
            alt="American Express"
            style={{ width: '50px', height: '30px' }}
          />
          <span>Amex</span>
        </div>
      </div>

      {/* Pay Now Button */}
      <button
        style={{ marginTop: '30px', padding: '10px 20px', fontSize: '16px' }}
        onClick={handlePayNow}
      >
        Pay Now
      </button>
    </div>
  );