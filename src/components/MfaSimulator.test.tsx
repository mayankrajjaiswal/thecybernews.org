import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MfaSimulator from './MfaSimulator';

describe('MfaSimulator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set a consistent fake time (e.g., exactly at a 30s boundary)
    vi.setSystemTime(new Date(1672531200000)); // Timestamp divisible by 30000
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial state correctly', () => {
    render(<MfaSimulator />);
    
    expect(screen.getByTestId('mfa-simulator')).toBeInTheDocument();
    
    // Check initial secret
    const secretInput = screen.getByTestId('secret-input') as HTMLInputElement;
    expect(secretInput.value).toBe('JBSWY3DPEHPK3PXP');
    
    // Check initial time window
    const timeWindow = screen.getByTestId('time-window');
    expect(timeWindow).toHaveTextContent(Math.floor(1672531200000 / 30000).toString());
    
    // Check initial generated code
    const code = screen.getByTestId('mfa-code');
    expect(code.textContent).toMatch(/^\d{3} \d{3}$/); // e.g., 123 456
  });

  it('updates code when secret changes', () => {
    render(<MfaSimulator />);
    const secretInput = screen.getByTestId('secret-input');
    const codeBefore = screen.getByTestId('mfa-code').textContent;
    
    fireEvent.change(secretInput, { target: { value: 'NEWSECRETKEY123' } }); // Note: regex filters out numbers not 2-7, but standard base32 allows A-Z 2-7
    
    const codeAfter = screen.getByTestId('mfa-code').textContent;
    expect(codeBefore).not.toBe(codeAfter);
  });

  it('filters invalid characters from secret input', () => {
    render(<MfaSimulator />);
    const secretInput = screen.getByTestId('secret-input') as HTMLInputElement;
    
    // Base32 only allows A-Z and 2-7. Try typing '8', '9', '0', '1', lowercase 'a'
    fireEvent.change(secretInput, { target: { value: 'a8901' } });
    
    // Should be uppercase A, and numbers 8,9,0,1 stripped
    expect(secretInput.value).toBe('A');
  });

  it('updates code and time window when 30 seconds pass', () => {
    render(<MfaSimulator />);
    const timeWindowBefore = screen.getByTestId('time-window').textContent;
    const codeBefore = screen.getByTestId('mfa-code').textContent;
    
    // Fast forward 31 seconds
    act(() => {
      vi.advanceTimersByTime(31000);
    });
    
    const timeWindowAfter = screen.getByTestId('time-window').textContent;
    const codeAfter = screen.getByTestId('mfa-code').textContent;
    
    expect(timeWindowBefore).not.toBe(timeWindowAfter);
    expect(codeBefore).not.toBe(codeAfter);
  });
});
