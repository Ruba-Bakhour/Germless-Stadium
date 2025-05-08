import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login';
import { useRouter } from 'next/navigation';
import { supabase } from '../pages/supabaseClient';

// Mock Supabase
jest.mock('../pages/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mock useRouter from next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Login Page', () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    jest.clearAllMocks();
  });

  it('should render the login form', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();

    console.log('Login form rendered successfully');
  });

  it('should call Supabase and navigate on successful login', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { session: {} },
      error: null,
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(push).toHaveBeenCalledWith('/');
    });

    console.log('validate login and redirect successful');
  });

  it('should show alert on login error', async () => {
    window.alert = jest.fn();
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
      expect(push).not.toHaveBeenCalled();
    });

    console.log('display Login error handled and alert shown for invalid data');
  });
});
