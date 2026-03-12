import { render, screen } from '@testing-library/react';
import ManageOrder from '../ManageOrder';

describe('ManageOrder Component', () => {
  test('renders Orders section', () => {
    render(<ManageOrder />);
    const ordersHeading = screen.getByText(/Orders/i);
    expect(ordersHeading).toBeInTheDocument();
  });
});