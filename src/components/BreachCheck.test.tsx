import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BreachCheck from './BreachCheck';
import React from 'react';

// Setup TextEncoder polyfill for JSDOM
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;

describe('BreachCheck Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default crypto mock
    Object.defineProperty(window, 'crypto', {
      value: {
        subtle: {
          digest: vi.fn().mockResolvedValue(new ArrayBuffer(20)) // Mock 20 byte SHA-1 buffer
        }
      },
      writable: true
    });
    
    // Default fetch mock
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue('00000000000000000000000000000000000:5\nFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF:10')
    });
  });

  it('renders correctly', () => {
    render(<BreachCheck />);
    expect(screen.getByText('Check a Password')).toBeInTheDocument();
  });

  it('handles crypto missing gracefully', async () => {
    Object.defineProperty(window, 'crypto', { value: {}, writable: true });
    
    render(<BreachCheck />);
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'test' } });
    fireEvent.click(screen.getByTestId('check-button'));
    
    await waitFor(() => {
      expect(screen.getByText('Cryptography API not available in this browser.')).toBeInTheDocument();
    });
  });

  it('shows safe message when password is not breached', async () => {
    // Mock the hash to be all 1s, which DOES NOT match the fetch response of 0s and Fs
    Object.defineProperty(window, 'crypto', {
      value: {
        subtle: {
          digest: vi.fn().mockResolvedValue(new Uint8Array(20).fill(1).buffer)
        }
      },
      writable: true
    });

    render(<BreachCheck />);
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'SuperSecretSafe123!' } });
    fireEvent.click(screen.getByTestId('check-button'));
    
    await waitFor(() => {
      expect(screen.getByText('Good News!')).toBeInTheDocument();
    });
  });

  it('shows pwned message when password is breached', async () => {
    // We mock the hash so that suffix matches our mocked fetch response
    Object.defineProperty(window, 'crypto', {
      value: {
        subtle: {
          digest: vi.fn().mockResolvedValue(new Uint8Array(20).fill(255).buffer) // All FFs
        }
      },
      writable: true
    });

    render(<BreachCheck />);
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('check-button'));
    
    await waitFor(() => {
      expect(screen.getByText('Oh no — Pwned!')).toBeInTheDocument();
      // Should show the count of 10 based on our mock response FFFF...:10
      expect(screen.getByText(/10 times/)).toBeInTheDocument();
    });
  });

  it('handles fetch errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    
    render(<BreachCheck />);
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'test' } });
    fireEvent.click(screen.getByTestId('check-button'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to connect to the breach database.')).toBeInTheDocument();
    });
  });
});
