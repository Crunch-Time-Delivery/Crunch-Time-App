import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DriverAccount from './DriverAccount';

// Mock localStorage
beforeEach(() => {
  // Reset localStorage before each test
  localStorage.clear();

  // Mock window.confirm
  jest.spyOn(window, 'confirm').mockImplementation(() => true);
  // Mock window.alert
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

test('renders driver profile with initial data from localStorage', () => {
  // Set initial data in localStorage
  const driverData = { name: 'John Doe' };
  localStorage.setItem('driverData', JSON.stringify(driverData));

  // Render component
  render(<DriverAccount loadMain={() => {}} />);

  // Check if name input has correct value
  const nameInput = screen.getByDisplayValue('John Doe');
  expect(nameInput).toBeInTheDocument();

  // Check for the save button
  const saveBtn = screen.getByText('Save');
  expect(saveBtn).toBeInTheDocument();

  // Check for the Terminate button
  const terminateBtn = screen.getByText('Terminate Driver');
  expect(terminateBtn).toBeInTheDocument();
});

test('updates driver name on input change and saves data', () => {
  render(<DriverAccount loadMain={() => {}} />);
  const nameInput = screen.getByDisplayValue('');
  fireEvent.change(nameInput, { target: { value: 'Alice' } });
  expect(nameInput.value).toBe('Alice');

  const saveBtn = screen.getByText('Save');
  fireEvent.click(saveBtn);
  expect(window.alert).toHaveBeenCalledWith('Profile saved and sent to admin.');
  expect(localStorage.getItem('driverData')).toBe(JSON.stringify({ name: 'Alice' }));
});

test('handles termination flow', () => {
  render(<DriverAccount loadMain={() => {}} />);
  const terminateBtn = screen.getByText('Terminate Driver');
  fireEvent.click(terminateBtn);
  expect(window.confirm).toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith('Termination request sent to admin.');
  expect(localStorage.removeItem).toHaveBeenCalledWith('driverData');
  // You can also verify that loadMain is called if you pass a mock function
});