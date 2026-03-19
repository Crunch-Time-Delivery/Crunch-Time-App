import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders the Vendor text', () => {
    render(<App />);
    const vendorText = screen.getByText(/Vendor/i);
    expect(vendorText).toBeInTheDocument();
  });
});