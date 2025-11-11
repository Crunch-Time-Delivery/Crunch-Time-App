import { render, screen } from '@testing-library/react';
import PaymentHistory from '../PaymentHistory';

describe('PaymentHistory Component', () => {
  test('renders Payment History section', () => {
    render(<PaymentHistory />);
    const paymentHistoryHeading = screen.getByText(/Payment History/i);
    expect(paymentHistoryHeading).toBeInTheDocument();
  });
});