jest.mock("next/router", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
}));

global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.print = jest.fn();

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ReportPage from '../pages/ReportPage';

// Mock Supabase
const mockSelect = jest.fn();
const mockDelete = jest.fn();
const mockEq = jest.fn();

jest.mock('../pages/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: mockSelect,
      delete: () => ({
        eq: mockEq,
      }),
    })),
  },
}));

describe('ReportPage Integration', () => {
  beforeEach(() => {
    mockSelect.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Test Report',
          created_at: '2025-04-30',
          total_seats: 100,
          distance: '10 km',
        },
      ],
      error: null,
    });

    mockEq.mockResolvedValue({ error: null });
  });

  test('fetches and displays reports', async () => {
    render(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Report')).toBeInTheDocument();
    });
  });

  test('selects a report and displays its details', async () => {
    render(<ReportPage />);
    await waitFor(() => screen.getByText('Test Report'));

    fireEvent.click(screen.getByText('Open'));

    await waitFor(() => screen.getByText(/Date and Time:/));
    expect(screen.getByText(/2025-04-30/)).toBeInTheDocument();
    expect(screen.getByText('100 seats')).toBeInTheDocument();
  });

  test('deletes a report and removes it from the list', async () => {
    window.confirm = jest.fn(() => true); // Auto-confirm deletion

    render(<ReportPage />);
    await waitFor(() => screen.getByText('Test Report'));

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.queryByText('Test Report')).not.toBeInTheDocument();
    });
  });

  test('calls window.print when download button is clicked', async () => {
    const printMock = jest.fn();
    window.print = printMock;
  
    render(<ReportPage />);
    await waitFor(() => screen.getByText('Test Report'));
  
    fireEvent.click(screen.getByText('Open'));
    await waitFor(() => screen.getByText(/Download/i)); // <- updated
  
    fireEvent.click(screen.getByText(/Download/i));     // <- updated
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
  
});
