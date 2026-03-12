import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DriverProfile from './DriverProfile';

beforeEach(() => {
  jest.spyOn(window, 'confirm').mockImplementation(() => true);
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  localStorage.clear();
});

test('renders driver profile with initial data', () => {
  const initialData = { name: 'Alice', email: 'alice@example.com' };
  localStorage.setItem('driverData', JSON.stringify(initialData));
  
  render(<DriverProfile loadMain={() => {}} />);
  
  expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
  expect(screen.getByDisplayValue('alice@example.com')).toBeInTheDocument();
});

test('updates profile data and saves', () => {
  render(<DriverProfile loadMain={() => {}} />);
  
  const nameInput = screen.getByDisplayValue('');
  fireEvent.change(nameInput, { target: { value: 'Bob' } });
  expect(nameInput.value).toBe('Bob');

  const saveBtn = screen.getByText('Save');
  fireEvent.click(saveBtn);

  expect(window.alert).toHaveBeenCalledWith('Profile saved and sent to admin.');
  expect(localStorage.getItem('driverData')).toBe(JSON.stringify({ name: 'Bob' }));
});

test('terminate driver prompts confirmation', () => {
  render(<DriverProfile loadMain={() => {}} />);
  const terminateBtn = screen.getByText('Terminate Driver');

  fireEvent.click(terminateBtn);
  expect(window.confirm).toHaveBeenCalled();
  expect(window.alert).toHaveBeenCalledWith('Termination request sent to admin.');
  expect(localStorage.removeItem).toHaveBeenCalledWith('driverData');
});