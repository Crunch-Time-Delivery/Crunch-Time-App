import React, { useState } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import './geolocation.css'; // Import CSS for styling

const supabaseUrl = 'https://wbpgmgtoyzlnawvsfeiu.supabase.co';
const supabaseKey =  process.env.SUPABASE_KEY // Ensure this is set in .env
const supabase = createClient(supabaseUrl, supabaseKey);

function Dashboard() {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [month, setMonth] = useState('January');

  const toggleYearDropdown = () => {
    setIsYearDropdownOpen(prev => !prev);
  };

  const selectMonth = (selectedMonth) => {
    setMonth(selectedMonth);
    setIsYearDropdownOpen(false);
  };

  const orderStats = {
    totalComplete: 120,
    totalDelivered: 100,
    totalCancelled: 10,
    pending: 10,
  };

  const foodData = [
    { type: 'Fast Food', percent: 40, color: '#FF6384' },
    { type: 'Asian', percent: 20, color: '#36A2EB' },
    { type: 'Pasta', percent: 15, color: '#FFCE56' },
    { type: 'Mexican', percent: 10, color: '#4BC0C0' },
    { type: 'Turkish', percent: 5, color: '#9966FF' },
    { type: 'Desserts', percent: 10, color: '#FF9F40' },
  ];

  return (
    <div>
      {/* Top Red Bar */}
      <div className="top-bar">
        <div className="profile-section">
          <div className="profile-picture"></div>
          <div className="admin-name">Admin Name</div>
        </div>
        <div className="menu-icon" title="Menu">&#9776;</div>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        {/* Filter Buttons & Income */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="filter-btn">Filter Establishments ▼</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px' }}>Total Income</button>
            <button style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px' }}>Income</button>
            <button style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px' }}>Expense</button>
            <button style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px' }}>Withdraw</button>
          </div>
        </div>

        {/* Income Display */}
        <div style={{ marginTop: '20px' }}>
          <h2>Total Income: $10,000</h2>
        </div>

        {/* Performance & Year Dropdown */}
        <div className="performance-section" style={{ marginTop: '30px' }}>
          <div className="performance-header" style={{ position: 'relative' }}>
            <div className="order-rate">Order Rate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="performance-title">Performance</div>
              <div className="performance-icon" title="Performance">&#128200;</div>
            </div>
            {/* Year Dropdown */}
            <div className={`year-dropdown ${isYearDropdownOpen ? 'active' : ''}`} style={{ position: 'relative' }}>
              <button className="year-button" onClick={toggleYearDropdown}>{month} ▼</button>
              {isYearDropdownOpen && (
                <div className="year-options" style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', border: '1px solid #ccc', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                  <div style={{ padding: '8px', cursor: 'pointer' }} onClick={() => selectMonth('January')}>January</div>
                  <div style={{ padding: '8px', cursor: 'pointer' }} onClick={() => selectMonth('February')}>February</div>
                  {/* Add more months as needed */}
                </div>
              )}
            </div>
          </div>

          {/* Boxes for Order Total and Target */}
          <div className="boxes-container" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            {/* Order Total */}
            <div className="box">
              <div className="box-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div className="profile-icon"></div>
                <div className="box-title">Order Total</div>
              </div>
              <div className="box-amount">$5000</div>
            </div>
            {/* Target */}
            <div className="box">
              <div className="box-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div className="profile-icon"></div>
                <div className="box-title">Target</div>
              </div>
              <div className="target-container">
                <div className="linear-bar">
                  <div className="target-progress"></div>
                </div>
                <div style={{ marginTop: '10px' }}>Target: 75%</div>
              </div>
            </div>
          </div>

          {/* Last Month & Last Year Selects */}
          <div className="selection-row" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            {/* Last Month */}
            <div className="select-box">
              <div className="select-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>One This Month</h4>
                <div className="option-icon" title="Options">&#8942;</div>
              </div>
              <div>Number: 80</div>
              {/* Wave Graph Placeholder */}
              <div className="wave-graph">Wave Graph</div>
            </div>
            {/* Last Year */}
            <div className="select-box">
              <div className="select-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>One Last</h4>
                <div className="option-icon" title="Options">&#8942;</div>
              </div>
              <div>Number: 70</div>
              {/* Wave Graph Placeholder */}
              <div className="wave-graph">Wave Graph</div>
            </div>
          </div>

          {/* Bottom Order Stats */}
          <div className="stats" style={{ marginTop: '30px' }}>
            {/* Orders Complete */}
            <div className="stat-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', position: 'relative' }}>
              <button className="stat-button" title="Orders Complete">&#10003;</button>
              <div className="stat-info">Total Orders Complete: {orderStats.totalComplete}</div>
            </div>
            {/* Orders Delivered */}
            <div className="stat-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', position: 'relative' }}>
              <button className="stat-button" title="Orders Delivered">&#10003;</button>
              <div className="stat-info">Total Orders Delivered: {orderStats.totalDelivered}</div>
            </div>
            {/* Orders Cancelled */}
            <div className="stat-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', position: 'relative' }}>
              <button className="stat-button" title="Orders Cancelled">&#9888;</button>
              <div className="stat-info">Total Orders Cancelled: {orderStats.totalCancelled}</div>
            </div>
            {/* Orders Pending */}
            <div className="stat-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', position: 'relative' }}>
              <button className="stat-button" title="Orders Pending">&#9203;</button>
              <div className="stat-info">Orders Pending: {orderStats.pending}</div>
            </div>
          </div>

          {/* Popular Food Section */}
          <div className="popular-food" style={{ marginTop: '30px' }}>
            <div className="food-header">Popular Food</div>
            {/* Circular Graph Placeholder */}
            <div className="circle-graph">Circle Graph</div>
            {/* Food Types List */}
            <div className="food-types">
              {foodData.map((food, index) => (
                <div key={index} className="food-item">
                  <div className="food-color" style={{ backgroundColor: food.color }}></div>
                  <div>{food.type} - {food.percent}%</div>
                </div>
              ))}
            </div>
            {/* Order Delivered Text */}
            <div style={{ marginTop: '20px', fontWeight: 'bold' }}>Order Delivered</div>
            {/* Bar graph for each food type */}
            <div style={{ marginTop: '10px' }}>
              {foodData.map((food, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{food.type}</div>
                    <div>{food.percent}%</div>
                  </div>
                  <div className="linear-bar" style={{ backgroundColor: '#ddd', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${food.percent}%`, height: '10px', backgroundColor: food.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;