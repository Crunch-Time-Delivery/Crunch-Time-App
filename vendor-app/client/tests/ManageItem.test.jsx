import { render, screen } from '@testing-library/react';
import ManageItem from '../ManageItem';

describe('ManageItem Component', () => {
  test('renders Items section', () => {
    render(<ManageItem />);
    const itemsHeading = screen.getByText(/Items/i);
    expect(itemsHeading).toBeInTheDocument();
  });
});