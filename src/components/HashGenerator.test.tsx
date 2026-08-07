import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HashGenerator from './HashGenerator';
import React from 'react';

// Setup TextEncoder polyfill for JSDOM
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('HashGenerator Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default crypto mock returning an array of bytes
    Object.defineProperty(window, 'crypto', {
      value: {
        subtle: {
          digest: vi.fn().mockResolvedValue(new Uint8Array([10, 20, 30]).buffer)
        }
      },
      writable: true
    });
  });

  it('renders correctly', () => {
    render(<HashGenerator />);
    expect(screen.getByText('Algorithm')).toBeInTheDocument();
  });

  it('generates a hash when input is provided', async () => {
    render(<HashGenerator />);
    const input = screen.getByTestId('hash-input');
    
    fireEvent.change(input, { target: { value: 'hello' } });
    
    // 10 = 0a, 20 = 14, 30 = 1e
    await waitFor(() => {
      expect(screen.getByTestId('hash-output').textContent).toBe('0a141e');
    });
  });

  it('changes algorithm', async () => {
    render(<HashGenerator />);
    const input = screen.getByTestId('hash-input');
    const select = screen.getByTestId('algo-select');
    
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.change(select, { target: { value: 'SHA-512' } });

    await waitFor(() => {
      // Just verify it gets called with the selected string to avoid cross-context Uint8Array prototype errors
      expect(window.crypto.subtle.digest).toHaveBeenCalledWith(
        'SHA-512',
        expect.anything()
      );
    });
  });

  it('handles crypto API missing error', async () => {
    Object.defineProperty(window, 'crypto', { value: {}, writable: true });
    
    render(<HashGenerator />);
    const input = screen.getByTestId('hash-input');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('hash-output').textContent).toContain('Cryptography API is not supported');
    });
  });

  it('copies hash to clipboard', async () => {
    render(<HashGenerator />);
    const input = screen.getByTestId('hash-input');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      const copyBtn = screen.getByTestId('copy-hash-btn');
      fireEvent.click(copyBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('0a141e');
    });
  });
});
