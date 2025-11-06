// __tests__/RestaurantList.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RestaurantList from '../src/components/RestaurantList';

const mockRestaurants = [
  { name: 'KFC Parow', rating: 4.4 },
  { name: 'Sannes Palace', rating: 4.5 },
];

describe('RestaurantList component', () => {
  test('displays list of restaurants', () => {
    render(<RestaurantList restaurants={mockRestaurants} />);
    mockRestaurants.forEach((restaurant) => {
      expect(screen.getByText(restaurant.name)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(restaurant.rating, 'i'))).toBeInTheDocument();
    });
  });

  test('opens menu modal on restaurant click', () => {
    render(<RestaurantList restaurants={mockRestaurants} />);
    const restaurantCard = screen.getByText(/KFC Parow/i);
    fireEvent.click(restaurantCard);
    expect(screen.getByTestId('menu-modal')).toBeInTheDocument();
  });
});