import React, { useState, useEffect } from 'react';

const DriverViewAccount = () => {
  const [accountInfo, setAccountInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    vehicle: 'Toyota Prius',
    licensePlate: 'XYZ 1234',
  });

  // You can fetch real data here using useEffect

  return (
    <div>
      <h2>Driver Account Details</h2>
      <ul>
        <li>Name: {accountInfo.name}</li>
        <li>Email: {accountInfo.email}</li>
        <li>Phone: {accountInfo.phone}</li>
        <li>Vehicle: {accountInfo.vehicle}</li>
        <li>License Plate: {accountInfo.licensePlate}</li>
      </ul>
    </div>
  );
};

export default DriverViewAccount;