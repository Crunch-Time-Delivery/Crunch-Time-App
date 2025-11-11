import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  test('renders Vendor and Menu button', () => {
    render(<Header />);
    const vendorText = screen.getByText(/Vendor/i);
    const menuButton = screen.getByRole('button', { name: /Menu/i });
    expect(vendorText).toBeInTheDocument();
    expect(menuButton).toBeInTheDocument();
  });
});