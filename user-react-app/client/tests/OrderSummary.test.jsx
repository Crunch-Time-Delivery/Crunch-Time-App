// __tests__/OrderSummary.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderSummary from '../src/components/OrderSummary';

const mockOrderItems = [
  { name: 'Zinger Burger', quantity: 2, price: 'R50' },
  { name: 'Fries', quantity: 1, price: 'R20' },
];

describe('OrderSummary component', () => {
  const mockRemoveItem = jest.fn();

  beforeEach(() => {
    render(
      <OrderSummary
        items={mockOrderItems}
        onRemoveItem={mockRemoveItem}
        total={70}
      />
    );
  });

  test('displays order items and total', () => {
    expect(screen.getByText(/Zinger Burger x2/i)).toBeInTheDocument();
    expect(screen.getByText(/R70/i)).toBeInTheDocument();
  });

  test('removes item on remove button click', () => {
    const removeBtns = screen.getAllByText(/Remove/);
    fireEvent.click(removeBtns[0]);
    expect(mockRemoveItem).toHaveBeenCalledWith(0);
  });
});