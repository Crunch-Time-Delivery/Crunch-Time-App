// __tests__/MenuModal.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuModal from '../src/components/MenuModal';

describe('MenuModal component', () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    render(
      <MenuModal
        isOpen={true}
        onClose={mockClose}
        restaurantName="KFC Parow"
        menuItems={[
          { name: 'Zinger Burger', price: 'R50' },
          { name: 'Fries', price: 'R20' },
        ]}
      />
    );
  });

  test('renders restaurant menu', () => {
    expect(screen.getByText(/KFC Parow Menu/i)).toBeInTheDocument();
    expect(screen.getByText(/Zinger Burger/i)).toBeInTheDocument();
  });

  test('closes modal on close button', () => {
    const closeBtn = screen.getByText(/×/);
    fireEvent.click(closeBtn);
    expect(mockClose).toHaveBeenCalled();
  });
});