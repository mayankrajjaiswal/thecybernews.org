import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DomainSpoofer from './DomainSpoofer';

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('DomainSpoofer', () => {
  it('renders initial state correctly', () => {
    render(<DomainSpoofer />);
    expect(screen.getByTestId('domain-spoofer')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid domain name (e.g. google.com) and click Generate.')).toBeInTheDocument();
  });

  it('generates spoofs for a standard domain', () => {
    render(<DomainSpoofer />);
    
    const input = screen.getByPlaceholderText('e.g. acme-corp.com');
    fireEvent.change(input, { target: { value: 'paypal.com' } });
    
    fireEvent.click(screen.getByText('Generate Spoofs'));
    
    // Should have generated some variations
    expect(screen.getByText(/Variations Found/)).toBeInTheDocument();
    
    // Check TLD Swap
    expect(screen.getByText('paypal.net')).toBeInTheDocument();
    
    // Check Typo
    expect(screen.getByText('papal.com')).toBeInTheDocument(); // Missing 'y' (removed 3rd letter)
    
    // Check Subdomain Trick
    expect(screen.getByText('paypal.secure-auth-gateway.com')).toBeInTheDocument();
    
    // Check Social Engineering Additions
    expect(screen.getByText('login-paypal.com')).toBeInTheDocument();
    
    // Check Homoglyph
    expect(screen.getByText('peypal.com')).toBeInTheDocument(); // 'a' replaced with 'e'
  });

  it('handles invalid inputs gracefully', () => {
    render(<DomainSpoofer />);
    
    const input = screen.getByPlaceholderText('e.g. acme-corp.com');
    // Input without a dot
    fireEvent.change(input, { target: { value: 'justaword' } });
    fireEvent.click(screen.getByText('Generate Spoofs'));
    
    // Should reset/stay empty
    expect(screen.getByText('Enter a valid domain name (e.g. google.com) and click Generate.')).toBeInTheDocument();
  });

  it('copies a spoofed URL to clipboard', () => {
    window.alert = vi.fn();
    render(<DomainSpoofer />);
    
    const input = screen.getByPlaceholderText('e.g. acme-corp.com');
    fireEvent.change(input, { target: { value: 'test.com' } });
    fireEvent.click(screen.getByText('Generate Spoofs'));
    
    // Click the first copy button
    const copyBtns = screen.getAllByTitle('Copy URL');
    fireEvent.click(copyBtns[0]);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });
});
