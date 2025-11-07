import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderView from './OrderView';

test('renders order details and order items table', () => {
  const mockLoadMain = jest.fn();

  render(<OrderView loadMain={mockLoadMain} />);

  // Check main heading
  expect(screen.getByText('Order Details')).toBeInTheDocument();

  // Check order details
  expect(screen.getByText('#12345')).toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('August 15, 2025')).toBeInTheDocument();
  expect(screen.getByText('Processing')).toBeInTheDocument();
  expect(screen.getByText('Yes (simulated GPS location)')).toBeInTheDocument();
  expect(screen.getByText('123 Main St, Cape Town')).toBeInTheDocument();
  expect(screen.getByText('R99.99')).toBeInTheDocument();

  // Check order items table headers
  expect(screen.getByText('Item')).toBeInTheDocument();
  expect(screen.getByText('Qty')).toBeInTheDocument();
  expect(screen.getByText('Price')).toBeInTheDocument();
  expect(screen.getByText('Total')).toBeInTheDocument();

  // Check order items data
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('Product B')).toBeInTheDocument();

  // Click the "Back" link and verify loadMain is called
  const backLink = screen.getByText('Back');
  fireEvent.click(backLink);
  expect(mockLoadMain).toHaveBeenCalled();
});