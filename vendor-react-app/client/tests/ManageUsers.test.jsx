import { render, screen } from '@testing-library/react';
import ManageUsers from '../ManageUsers';


describe('ManageUsers Component', () => {
  test('renders Users section', () => {
    render(<ManageUsers />);
    const usersHeading = screen.getByText(/Users/i);
    expect(usersHeading).toBeInTheDocument();
  });
});