// __tests__/App.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('Crunchtime Delivery App', () => {
  test('renders main components', () => {
    render(<App />);
    // Check if header is present
    expect(screen.getByText(/Crunch Time/i)).toBeInTheDocument();

    // Check if restaurant list is present
    expect(screen.getByTestId('restaurant-list')).toBeInTheDocument();

    // Check if order summary is visible
    expect(screen.getByTestId('order-summary')).toBeInTheDocument();
  });
});