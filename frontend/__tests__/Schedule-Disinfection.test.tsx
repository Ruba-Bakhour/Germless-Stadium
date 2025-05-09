import chalk from 'chalk'; // Add this at the top

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

jest.mock('@supabase/auth-helpers-nextjs');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Schedule from '../pages/Schedule-Disinfection';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('../assets/images/Blueprint.png', () => ({
  src: 'mock-blueprint.png',
}));

jest.mock('../pages/supabaseClient', () => ({
  supabase: {
    from: () => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

describe('Schedule Integration', () => {
  test('renders schedule form and submits data', async () => {
    render(<Schedule />);

    fireEvent.change(screen.getByLabelText(/Start time/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-01' } });
    fireEvent.click(screen.getByLabelText('A'));
    fireEvent.change(screen.getByLabelText(/Battery/i), { target: { value: '85' } });
    fireEvent.click(screen.getByLabelText(/Enabled/i));

    fireEvent.click(screen.getByText('Schedule'));

    await waitFor(() => {
      expect(screen.getByText('Scheduled successfully!')).toBeInTheDocument();
    });

    console.log(chalk.green.bold('✔ Schedule form submission test passed!'));
  });

  test('shows error if required fields are missing', async () => {
    render(<Schedule />);

    fireEvent.click(screen.getByText('Schedule'));

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    });

    console.log(chalk.green.bold('✔ Missing field validation test passed!'));
  });

  test('displays numeric validation error for battery', () => {
    render(<Schedule />);
    fireEvent.change(screen.getByLabelText(/Battery/i), { target: { value: 'abc' } });
    expect(screen.getByText('Please enter numbers only for the battery.')).toBeInTheDocument();

    console.log(chalk.green.bold('✔ Battery numeric validation test passed!'));
  });
});
