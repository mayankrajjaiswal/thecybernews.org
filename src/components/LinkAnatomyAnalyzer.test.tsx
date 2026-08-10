import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LinkAnatomyAnalyzer from './LinkAnatomyAnalyzer';

describe('LinkAnatomyAnalyzer', () => {
  it('renders initial state correctly', () => {
    render(<LinkAnatomyAnalyzer />);
    
    expect(screen.getByTestId('link-anatomy')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., https://apple.com.billing-update.net/login')).toBeInTheDocument();
  });

  it('analyzes a standard malicious link correctly', () => {
    render(<LinkAnatomyAnalyzer />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://login.paypal.com.secure-update.net/auth' } });
    
    fireEvent.click(screen.getByText('Analyze'));
    
    expect(screen.getByTestId('analysis-results')).toBeInTheDocument();
    
    // Check breakdown
    expect(screen.getByText(/https/)).toBeInTheDocument();
    expect(screen.getAllByText(/login\.paypal\.com/)[0]).toBeInTheDocument(); // subdomain
    expect(screen.getAllByText(/secure-update\.net/)[0]).toBeInTheDocument(); // root domain
    expect(screen.getByText(/\/auth/)).toBeInTheDocument(); // path
    
    // Check warnings
    expect(screen.getByText(/The subdomain contains the name of a famous brand/)).toBeInTheDocument();
  });

  it('analyzes a homoglyph link and http protocol', () => {
    render(<LinkAnatomyAnalyzer />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'http://appIe.com' } }); // Capital 'I' instead of 'l'
    
    fireEvent.click(screen.getByText('Analyze'));
    
    expect(screen.getByText(/http/)).toBeInTheDocument();
    // The URL parser might lowercase the output depending on how it's rendered, so we match appie.com or appIe.com
    expect(screen.getAllByText(/app.e\.com/i)[0]).toBeInTheDocument();
    
    // Check warnings
    expect(screen.getByText(/The link uses HTTP instead of HTTPS/)).toBeInTheDocument();
  });

  it('analyzes a clean link', () => {
    render(<LinkAnatomyAnalyzer />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'https://apple.com' } });
    
    fireEvent.click(screen.getByText('Analyze'));
    
    expect(screen.getByText(/No immediate structural red flags found/)).toBeInTheDocument();
  });

  it('handles invalid urls gracefully', () => {
    render(<LinkAnatomyAnalyzer />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'not-a-url' } });
    
    fireEvent.click(screen.getByText('Analyze'));
    
    expect(screen.getByText(/Could not parse URL/)).toBeInTheDocument();
  });
  
  it('handles quick example buttons', () => {
    render(<LinkAnatomyAnalyzer />);
    
    // Trigger initial analysis to render the buttons
    fireEvent.click(screen.getByText('Analyze'));
    
    const exampleBtn = screen.getByText('amazon.support.verification-center.com');
    fireEvent.click(exampleBtn);
    
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('https://amazon.support.verification-center.com');
  });
});
