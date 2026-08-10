import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NistPasswordPolicy from './NistPasswordPolicy';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('NistPasswordPolicy', () => {
  it('renders initial state correctly with defaults', () => {
    render(<NistPasswordPolicy />);
    
    expect(screen.getByTestId('nist-policy-generator')).toBeInTheDocument();
    
    // Check initial preview text
    const preview = screen.getByTestId('nist-policy-preview');
    expect(preview).toHaveTextContent('[Company Name] - NIST-Compliant Password Policy');
    expect(preview).toHaveTextContent('IT Support');
    expect(preview).toHaveTextContent('at least 12 characters long');
    expect(preview).toHaveTextContent('Multi-Factor Authentication (MFA) is mandatory');
    expect(preview).toHaveTextContent(/actively screen new passwords against a/i);
  });

  it('updates the policy when inputs change', () => {
    render(<NistPasswordPolicy />);
    
    // Change Company Name
    const nameInput = screen.getByPlaceholderText('e.g. Acme Corp');
    fireEvent.change(nameInput, { target: { value: 'GlobalTech' } });
    
    // Change IT Contact
    const itInput = screen.getByPlaceholderText('e.g. IT Department');
    fireEvent.change(itInput, { target: { value: 'Security Team' } });
    
    // Toggle checkboxes
    fireEvent.click(screen.getByTestId('nist-mfa')); // Turn off MFA
    fireEvent.click(screen.getByTestId('nist-pwm')); // Turn off Password Managers
    fireEvent.click(screen.getByTestId('nist-dict')); // Turn off Dictionary Check
    
    // Check updated preview
    const preview = screen.getByTestId('nist-policy-preview');
    expect(preview).toHaveTextContent('GlobalTech - NIST-Compliant Password Policy');
    expect(preview).toHaveTextContent('Security Team');
    expect(preview).toHaveTextContent('Multi-Factor Authentication (MFA) is highly recommended for all accounts.'); // MFA off text
    expect(preview).toHaveTextContent('The use of third-party password managers is currently not supported.'); // PWM off text
    expect(preview).toHaveTextContent('Do not use easily guessable passwords'); // Dict off text
  });

  it('copies to clipboard', () => {
    window.alert = vi.fn(); // Mock alert
    
    render(<NistPasswordPolicy />);
    
    fireEvent.click(screen.getByText('Copy to Clipboard'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Policy copied to clipboard!');
  });
});
