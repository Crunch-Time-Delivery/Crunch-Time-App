import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

test('renders header with Driver label and Menu button', () => {
  const mockToggleMenu = jest.fn();
  const mockLoadOrderView = jest.fn();
  const mockLoadDriverAccount = jest.fn();
  const mockLoadDriverHistory = jest.fn();
  const mockLogout = jest.fn();

  // Render with menu closed
  render(
    <Header
      menuOpen={false}
      toggleMenu={mockToggleMenu}
      loadOrderView={mockLoadOrderView}
      loadDriverAccount={mockLoadDriverAccount}
      loadDriverHistory={mockLoadDriverHistory}
      logout={mockLogout}
    />
  );

  // Check static elements
  expect(screen.getByText('Driver')).toBeInTheDocument();
  expect(screen.getByText('Menu ▼')).toBeInTheDocument();

  // Click menu button to toggle menu
  fireEvent.click(screen.getByText('Menu ▼'));
  expect(mockToggleMenu).toHaveBeenCalled();

  // Re-render with menu open
  render(
    <Header
      menuOpen={true}
      toggleMenu={mockToggleMenu}
      loadOrderView={mockLoadOrderView}
      loadDriverAccount={mockLoadDriverAccount}
      loadDriverHistory={mockLoadDriverHistory}
      logout={mockLogout}
    />
  );

  // Verify dropdown links are in the document
  expect(screen.getByText('Order View')).toBeInTheDocument();
  expect(screen.getByText('Driver View Account')).toBeInTheDocument();
  expect(screen.getByText('Driver History Payment')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();

  // Simulate clicking each link
  fireEvent.click(screen.getByText('Order View'));
  expect(mockLoadOrderView).toHaveBeenCalled();

  fireEvent.click(screen.getByText('Driver View Account'));
  expect(mockLoadDriverAccount).toHaveBeenCalled();

  fireEvent.click(screen.getByText('Driver History Payment'));
  expect(mockLoadDriverHistory).toHaveBeenCalled();

  // Test logout
  fireEvent.click(screen.getByText('Logout'));
  expect(mockLogout).toHaveBeenCalled();
});