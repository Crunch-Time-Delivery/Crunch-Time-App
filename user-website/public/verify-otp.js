app.post('/verify-otp', (req, res) => {
    const { phoneNumber, code } = req.body;
    
    client.verify.v2.services(process.env.VERIFY_SERVICE_SID)
        .verificationChecks
        .create({ to: `+${phoneNumber}`, code: code })
        .then(check => {
            if (check.status === 'approved') {
                res.json({ verified: true });
            } else {
                res.json({ verified: false });
            }
        })
        .catch(e => res.status(500).send(e));
});
