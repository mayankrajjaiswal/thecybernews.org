import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PolicyGenerator from './PolicyGenerator';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('PolicyGenerator', () => {
  it('renders initial state correctly', () => {
    render(<PolicyGenerator />);
    
    expect(screen.getByTestId('policy-generator')).toBeInTheDocument();
    
    // Check initial preview text
    const preview = screen.getByTestId('policy-preview');
    expect(preview).toHaveTextContent('[Company Name] - Acceptable Use & Security Policy');
    expect(preview).toHaveTextContent('IT Support');
    expect(preview).toHaveTextContent('Multi-Factor Authentication (MFA) is strictly required'); // Default true
    expect(preview).toHaveTextContent('Bring Your Own Device (BYOD)'); // Default true
  });

  it('updates the policy when inputs change', () => {
    render(<PolicyGenerator />);
    
    // Change Company Name
    const nameInput = screen.getByPlaceholderText('e.g. Acme Corp');
    fireEvent.change(nameInput, { target: { value: 'GlobalTech' } });
    
    // Change IT Contact
    const itInput = screen.getByPlaceholderText('e.g. IT Department or Jane Doe');
    fireEvent.change(itInput, { target: { value: 'Security Team' } });
    
    // Toggle checkboxes
    fireEvent.click(screen.getByTestId('check-mfa')); // Turn off MFA
    fireEvent.click(screen.getByTestId('check-byod')); // Turn off BYOD
    fireEvent.click(screen.getByTestId('check-wifi')); // Turn ON Public Wi-Fi
    
    // Check updated preview
    const preview = screen.getByTestId('policy-preview');
    expect(preview).toHaveTextContent('GlobalTech - Acceptable Use & Security Policy');
    expect(preview).toHaveTextContent('Security Team');
    expect(preview).toHaveTextContent('Multi-Factor Authentication (MFA) is highly recommended for all accounts.');
    expect(preview).toHaveTextContent('Company Devices Only');
    expect(preview).toHaveTextContent('ONLY IF** they are connected to the company VPN');
  });

  it('copies to clipboard', () => {
    window.alert = vi.fn(); // Mock alert
    
    render(<PolicyGenerator />);
    
    fireEvent.click(screen.getByText('Copy to Clipboard'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Policy copied to clipboard!');
  });
});
