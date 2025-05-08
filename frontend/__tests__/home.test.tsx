import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Home from '../pages/index'; // Adjust path as needed
import { supabase } from '../pages/supabaseClient';
import { useRouter } from 'next/router';

// Mock next/router and supabase client
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../pages/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() =>
        Promise.resolve({
          data: { session: null },
          error: null,
        })
      ),
      onAuthStateChange: jest.fn((callback) => {
        // Simulate a SIGNED_OUT event
        callback('SIGNED_OUT', null);

        return {
          data: {
            subscription: {
              unsubscribe: jest.fn(),
            },
          },
        };
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({
              data: {
                id: '123',
                first_name: 'John',
                last_name: 'Doe',
                stadium_name: 'Test Stadium',
              },
              error: null,
            })
          ),
        })),
      })),
    })),
  },
}));

describe('Home Page', () => {
  const mockRouterPush = jest.fn();

  // Properly mock useRouter before each test
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      replace: mockRouterPush,
    });
    jest.clearAllMocks();
  });

  it('should redirect to login if no user session', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    render(<Home />);

    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/login'));
    console.log('✔️ Redirect to login on no session');
  });

  it('should render user info and handle navigation if user is authenticated', async () => {
    const mockUser = {
      id: '123',
      first_name: 'John',
      last_name: 'Doe',
      stadium_name: 'Test Stadium',
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: { user: { email: 'john.doe@example.com' } } },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValueOnce({
            data: mockUser,
            error: null,
          }),
        }),
      }),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Hello, John Doe')).toBeInTheDocument();
    });
    console.log('User info rendered correctly');

    fireEvent.click(screen.getByText('Schedule Disinfection'));
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/Schedule-Disinfection');
    });
    console.log('Schedule Disinfection navigation works');

    fireEvent.click(screen.getByText('Control Drone'));
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/ControlPage');
    });
    console.log('Control Drone navigation works');
  });
});
