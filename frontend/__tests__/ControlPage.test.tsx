jest.mock('../pages/supabaseClient', () => ({
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(() => ({ data: [], error: null }))
      }))
    }
  }));
  
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ControlPage from '../pages/ControlPage';

describe('ControlPage Integration', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all drone control buttons and calls moveDrone with correct directions', async () => {
    render(<ControlPage />);

    const directions = [
      { label: /front/i, direction: 'forward' },
      { label: /left/i, direction: 'left' },
      { label: /right/i, direction: 'right' },
      { label: /back/i, direction: 'backward' },
      { label: /takeoff/i, direction: 'takeoff' },
      { label: /land/i, direction: 'land' },
      { label: /disinfect/i, direction: 'disinfect' },
    ];

    for (const { label, direction } of directions) {
      const button = screen.getByText(label);
      fireEvent.click(button);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/api/drone/move', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction }),
        }));
      });
    }

    expect(fetch).toHaveBeenCalledTimes(directions.length);
  });

  it('displays the livestream image', () => {
    render(<ControlPage />);
    const img = screen.getByAltText(/drone livestream/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://127.0.0.1:5000/video_feed');
  });
});
