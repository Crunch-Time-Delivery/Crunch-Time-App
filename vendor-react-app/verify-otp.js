
app.post('/verify-otp', async (req, res) => {
  const { phoneNumber, code } = req.body;

  // Validate inputs
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid or missing phoneNumber' });
  }
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid or missing code' });
  }

  try {
    const check = await client.verify.v2.services(process.env.VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: `+${phoneNumber}`, code: code });

    if (check.status === 'approved') {
      res.json({ success: true, verified: true });
    } else {
      res.json({ success: true, verified: false });
    }
  } catch (e) {
    console.error('Error verifying OTP:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});