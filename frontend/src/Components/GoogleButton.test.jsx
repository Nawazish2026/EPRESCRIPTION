import React from 'react';
import { render, screen } from '@testing-library/react';
import GoogleButton from './GoogleButton';

test('renders GoogleButton component', () => {
  render(<GoogleButton />);
  const buttonElement = screen.getByText(/Continue with Google/i);
  expect(buttonElement).toBeInTheDocument();
});
