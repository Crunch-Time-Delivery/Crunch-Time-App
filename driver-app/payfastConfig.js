// Define an interface for your config
interface PayFastConfig {
  merchantID: string;
  merchantKey: string;
  paymentAmount: number;
  currency: string;
}

// Assuming fetchConfig is a function that fetches and parses JSON
async function fetchConfig(filePath: string): Promise<PayFastConfig> {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }
  const data: PayFastConfig = await response.json();
  return data;
}

async function trackPayment(): Promise<void> {
  const config = await fetchConfig('payfastConfig.json');

  const response = await fetch('https://your-backend-api/track-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchantID: config.merchantID,
      merchantKey: config.merchantKey,
      amount: config.paymentAmount,
      currency: config.currency
    })
  });

  if (!response.ok) {
    alert(`Error tracking payment: ${response.statusText}`);
    return;
  }

  const data = await response.json();

  // Assuming data has a 'status' property
  alert(`Payment status: ${data.status}`);
}