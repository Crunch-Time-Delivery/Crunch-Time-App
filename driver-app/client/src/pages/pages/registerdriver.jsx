import React, { useState, useEffect } from 'react';

const RegisterDriver = () => {
  const [showForm, setShowForm] = useState(false);
  const [bankValue, setBankValue] = useState('');
  const [showOtherBank, setShowOtherBank] = useState(false);

  // Form state variables
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    idNumber: '',
    bankDetails: '',
    bankName: '',
    otherBank: '',
    carColor: '',
    carType: '',
    carRegNumber: '',
    driverPhoto: null,
    driverLicense: null,
    carPhoto: null,
  });

  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    if (files) {
      // For file inputs
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleBankChange = (e) => {
    const val = e.target.value;
    setBankValue(val);
    setShowOtherBank(val === 'Other');
    setFormData((prev) => ({ ...prev, bankName: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      phone,
      idNumber,
      bankDetails,
      bankName,
      otherBank,
      carColor,
      carType,
      carRegNumber,
      driverPhoto,
      driverLicense,
      carPhoto,
    } = formData;

    if (
      !driverPhoto ||
      !driverLicense ||
      !carPhoto
    ) {
      alert('Please upload all required images.');
      return;
    }

    const driverData = {
      name,
      email,
      password,
      idNumber,
      phoneNumber: phone,
      bankDetails,
      bankName: bankName === 'Other' ? otherBank : bankName,
      driverPhoto: URL.createObjectURL(driverPhoto),
      driverLicense: URL.createObjectURL(driverLicense),
      carPhoto: URL.createObjectURL(carPhoto),
      approved: false,
    };

    localStorage.setItem('registeredUser', JSON.stringify(driverData));
    alert('Registration successful! You can now login.');

    // Redirect to login page (update URL as needed)
    window.location.href = 'http://127.0.0.1:5500/driver-app/loginDriver.html';
  };

  if (!showForm) return null;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20, backgroundColor: '#f4f4f4' }}>
      <img
        src="img/screenshot (251).jpg"
        alt="Welcome Image"
        style={{ width: 250, marginBottom: 20 }}
      />
      <h1>Register as a Driver</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto', background: '#fff', padding: 20, borderRadius: 8 }}>
        <label>Upload Selfie (Driver Photo):</label>
        <input type="file" accept="image/*" required onChange={handleInputChange} id="driverPhoto" />

        <label>Name:</label>
        <input type="text" required onChange={handleInputChange} id="name" />

        <label>Email:</label>
        <input type="email" required onChange={handleInputChange} id="email" />

        <label>Password:</label>
        <input type="password" required onChange={handleInputChange} id="password" />

        <label>Phone Number:</label>
        <input type="tel" placeholder="e.g., 0612345678" required onChange={handleInputChange} id="phone" />

        <label>ID Number:</label>
        <input type="text" required onChange={handleInputChange} id="idNumber" />

        <label>Bank Account Details:</label>
        <input type="text" required onChange={handleInputChange} id="bankDetails" />

        <label>Bank Name:</label>
        <select required onChange={handleBankChange} value={bankValue} id="bankName">
          <option value="">Select Bank</option>
          <option value="FNB">FNB</option>
          <option value="Standard Bank">Standard Bank</option>
          <option value="Capitec">Capitec</option>
          <option value="NedBank">NedBank</option>
          <option value="Other">Other</option>
        </select>

        {showOtherBank && (
          <>
            <label>Specify Bank:</label>
            <input type="text" onChange={handleInputChange} id="otherBank" />
          </>
        )}

        <label>Driver's License Upload:</label>
        <input type="file" accept="image/*" required onChange={handleInputChange} id="driverLicense" />

        <label>Car Details:</label>
        <input type="text" placeholder="Car Color" required onChange={handleInputChange} id="carColor" />
        <input type="text" placeholder="Car Type" required onChange={handleInputChange} id="carType" />

        <label>Car Photo:</label>
        <input type="file" accept="image/*" required onChange={handleInputChange} id="carPhoto" />

        <label>Car Registration Number:</label>
        <input type="text" required onChange={handleInputChange} id="carRegNumber" />

        <button type="submit" style={{ marginTop: 20, padding: '10px 15px', backgroundColor: '#ff0000', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Submit Registration</button>
      </form>
    </div>
  );
};

export default RegisterDriver;