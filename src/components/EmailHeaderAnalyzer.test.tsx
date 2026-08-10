import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmailHeaderAnalyzer from './EmailHeaderAnalyzer';

describe('EmailHeaderAnalyzer', () => {
  it('renders initial state correctly', () => {
    render(<EmailHeaderAnalyzer />);
    
    expect(screen.getByTestId('header-analyzer')).toBeInTheDocument();
    expect(screen.getByText('Paste Email Headers')).toBeInTheDocument();
    expect(screen.getByText(/Paste email headers and click analyze/)).toBeInTheDocument();
  });

  it('analyzes a legit email (passes all checks)', () => {
    render(<EmailHeaderAnalyzer />);
    
    const textarea = screen.getByTestId('header-input');
    fireEvent.change(textarea, { target: { value: 'Return-Path: <bounces+1234@legit-bank.com>\nFrom: "Security Team" <security@legit-bank.com>\nAuthentication-Results: mx.google.com; spf=pass; dkim=pass; dmarc=pass' } });
    fireEvent.click(screen.getByText('Analyze Headers'));
    
    // Check results section
    expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    
    // Extracted addresses
    expect(screen.getAllByText(/"Security Team" <security@legit-bank\.com>/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/bounces\+1234@legit-bank\.com/)[0]).toBeInTheDocument();
    
    // Status indicators by data-testid
    const passes = screen.getAllByTestId('status-pass');
    expect(passes.length).toBe(3); // SPF, DKIM, DMARC
  });

  it('analyzes a scam email (fails checks and shows mismatch)', () => {
    render(<EmailHeaderAnalyzer />);
    
    const textarea = screen.getByTestId('header-input');
    fireEvent.change(textarea, { target: { value: 'Return-Path: <hacker@russian-server.ru>\nFrom: "PayPal Support" <support@paypal.com>\nAuthentication-Results: mx.google.com; spf=fail; dmarc=fail' } });
    fireEvent.click(screen.getByText('Analyze Headers'));
    
    // Mismatch warning
    expect(screen.getByText(/Mismatch detected!/)).toBeInTheDocument();
    
    // Status indicators by data-testid
    const fails = screen.getAllByTestId('status-fail');
    expect(fails.length).toBe(2); // SPF, DMARC
    
    const unknowns = screen.getAllByTestId('status-unknown');
    expect(unknowns.length).toBeGreaterThanOrEqual(1); // DKIM missing
    
    // Big red warning
    expect(screen.getByText(/This email failed authentication checks/)).toBeInTheDocument();
  });

  it('does nothing if input is empty', () => {
    render(<EmailHeaderAnalyzer />);
    fireEvent.click(screen.getByText('Analyze Headers'));
    expect(screen.getByText(/Paste email headers and click analyze/)).toBeInTheDocument();
  });

  it('handles fallback SPF checking', () => {
    render(<EmailHeaderAnalyzer />);
    const textarea = screen.getByTestId('header-input');
    
    fireEvent.change(textarea, { target: { value: 'Received-SPF: softfail\nFrom: test@test.com' } });
    fireEvent.click(screen.getByText('Analyze Headers'));
    
    expect(screen.getByText('WARNING')).toBeInTheDocument();
    expect(screen.getByText('SPF check was inconclusive.')).toBeInTheDocument();
  });
});
