// __tests__/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../src/components/Header';

describe('Header component', () => {
  test('renders header buttons and search input', () => {
    render(<Header />);
    expect(screen.getByPlaceholderText(/Search/)).toBeInTheDocument();
    expect(screen.getByText(/Map Location - Pick up now/i)).toBeInTheDocument();
  });
});