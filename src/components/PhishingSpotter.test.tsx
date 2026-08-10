import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PhishingSpotter from './PhishingSpotter';

describe('PhishingSpotter', () => {
  it('renders the first scenario correctly', () => {
    render(<PhishingSpotter />);
    
    expect(screen.getByTestId('phishing-spotter')).toBeInTheDocument();
    expect(screen.getByText('The "Urgent" Account Suspension')).toBeInTheDocument();
    expect(screen.getByText(/Find and click the 3 red flags in this email./)).toBeInTheDocument();
    
    // Check initial UI elements
    expect(screen.getByTestId('flag-fromEmail')).toBeInTheDocument();
    expect(screen.getByTestId('flag-greeting')).toBeInTheDocument();
    expect(screen.getByTestId('flag-linkUrl')).toBeInTheDocument();
  });

  it('allows clicking flags and progresses to next scenario', () => {
    render(<PhishingSpotter />);
    
    // Click first flag
    fireEvent.click(screen.getByTestId('flag-fromEmail'));
    
    // Check explanation appeared
    expect(screen.getByText('Red Flags Identified:')).toBeInTheDocument();
    expect(screen.getByText(/Fake Sender Domain/)).toBeInTheDocument();
    
    // Click remaining flags
    fireEvent.click(screen.getByTestId('flag-greeting'));
    fireEvent.click(screen.getByTestId('flag-linkUrl'));
    
    // Check success message appeared
    expect(screen.getByText('Great job! You found all the red flags.')).toBeInTheDocument();
    
    // Move to next scenario
    const nextBtn = screen.getByText('Try Next Scenario');
    fireEvent.click(nextBtn);
    
    // Check scenario 2
    expect(screen.getByText('The Fake Invoice')).toBeInTheDocument();
    
    // Click scenario 2 flags
    fireEvent.click(screen.getByTestId('flag-fromEmail'));
    fireEvent.click(screen.getByTestId('flag-body'));
    fireEvent.click(screen.getByTestId('flag-linkText'));
    
    // Check start over
    const startOverBtn = screen.getByText('Start Over');
    fireEvent.click(startOverBtn);
    
    // Back to scenario 1
    expect(screen.getByText('The "Urgent" Account Suspension')).toBeInTheDocument();
  });
});
