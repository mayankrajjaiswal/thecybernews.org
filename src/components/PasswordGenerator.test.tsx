import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PasswordGenerator from './PasswordGenerator';
import React from 'react';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('PasswordGenerator Component', () => {
  it('renders correctly with default settings', () => {
    render(<PasswordGenerator />);
    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('Generate New Password')).toBeInTheDocument();
    expect(screen.getByTestId('password-display').textContent?.length).toBe(16);
  });

  it('updates length when slider changes', () => {
    render(<PasswordGenerator />);
    const slider = screen.getByTestId('length-slider');
    fireEvent.change(slider, { target: { value: '24' } });
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByTestId('password-display').textContent?.length).toBe(24);
  });

  it('handles empty charset gracefully', () => {
    render(<PasswordGenerator />);
    const upper = screen.getByTestId('check-upper');
    const lower = screen.getByTestId('check-lower');
    const numbers = screen.getByTestId('check-numbers');
    const symbols = screen.getByTestId('check-symbols');

    fireEvent.click(upper);
    fireEvent.click(lower);
    fireEvent.click(numbers);
    fireEvent.click(symbols);

    expect(screen.getByTestId('password-display').textContent).toBe('Please select at least one option.');
    
    // Testing the strength calculation for invalid state
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  it('copies password to clipboard', () => {
    render(<PasswordGenerator />);
    const copyButton = screen.getByTestId('copy-button');
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('generates new password on button click', () => {
    render(<PasswordGenerator />);
    const initialPassword = screen.getByTestId('password-display').textContent;
    const generateButton = screen.getByText('Generate New Password');
    fireEvent.click(generateButton);
    const newPassword = screen.getByTestId('password-display').textContent;
    expect(initialPassword).not.toBe(newPassword);
  });

  it('falls back to Math.random when window.crypto is unavailable', () => {
    // Temporarily remove window.crypto
    const originalCrypto = window.crypto;
    Object.defineProperty(window, 'crypto', { value: undefined, writable: true });
    
    render(<PasswordGenerator />);
    const generateButton = screen.getByText('Generate New Password');
    fireEvent.click(generateButton);
    expect(screen.getByTestId('password-display').textContent?.length).toBe(16);
    
    // Restore window.crypto
    Object.defineProperty(window, 'crypto', { value: originalCrypto, writable: true });
  });
});
