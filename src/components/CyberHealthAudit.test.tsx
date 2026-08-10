import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CyberHealthAudit from './CyberHealthAudit';

describe('CyberHealthAudit', () => {
  it('renders the first question correctly', () => {
    render(<CyberHealthAudit />);
    
    expect(screen.getByTestId('health-audit')).toBeInTheDocument();
    expect(screen.getByText('How do you currently manage your passwords?')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
  });

  it('completes the audit with a perfect score', () => {
    render(<CyberHealthAudit />);
    
    // Q1
    fireEvent.click(screen.getByText('I use a dedicated Password Manager (e.g., Bitwarden, 1Password).'));
    // Q2
    fireEvent.click(screen.getByText('Yes, on all important accounts using an Authenticator App or Security Key.'));
    // Q3
    fireEvent.click(screen.getByText('They are set to update automatically in the background.'));
    // Q4
    fireEvent.click(screen.getByText('I never connect to public Wi-Fi, or I always use a trusted VPN.'));
    // Q5
    fireEvent.click(screen.getByText('Yes, I changed both the Wi-Fi password and the Admin login password.'));
    
    expect(screen.getByTestId('audit-results')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('You are doing everything right! Keep up the good work.')).toBeInTheDocument();
    
    // Reset
    fireEvent.click(screen.getByText('Take Audit Again'));
    expect(screen.getByText('How do you currently manage your passwords?')).toBeInTheDocument();
  });

  it('completes the audit with a low score and shows recommendations', () => {
    render(<CyberHealthAudit />);
    
    // Q1
    fireEvent.click(screen.getByText('I use a few variations of the same password for everything.')); // 0
    // Q2
    fireEvent.click(screen.getByText('No, it is too annoying.')); // 0
    // Q3
    fireEvent.click(screen.getByText('I ignore them for months until I am forced to update.')); // 0
    // Q4
    fireEvent.click(screen.getByText('I connect and use it normally without thinking about it.')); // 0
    // Q5
    fireEvent.click(screen.getByText('No, I use the password printed on the sticker on the back.')); // 0
    
    expect(screen.getByTestId('audit-results')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('High Risk. You need to make some immediate changes.')).toBeInTheDocument();
    
    // Check if recommendations rendered
    expect(screen.getByText(/Reusing passwords means if one site is hacked/)).toBeInTheDocument();
    expect(screen.getByText(/MFA is the single most important security feature/)).toBeInTheDocument();
  });
  
  it('completes the audit with a medium score and shows recommendations', () => {
    render(<CyberHealthAudit />);
    
    // Q1 (70%)
    fireEvent.click(screen.getByText('I let my browser or phone save them (e.g., Chrome, iCloud).')); // 7
    fireEvent.click(screen.getByText('Yes, but I mostly use SMS/Text messages for the codes.')); // 6
    fireEvent.click(screen.getByText('I install them manually within a few days of being notified.')); // 8
    fireEvent.click(screen.getByText('I connect, but only browse normal sites; I never log into my bank.')); // 5
    fireEvent.click(screen.getByText('I changed the Wi-Fi password, but the Admin login is still the default.')); // 4
    // total = 30 / 50 = 60%
    
    expect(screen.getByTestId('audit-results')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('Not bad, but there are some critical gaps to fill.')).toBeInTheDocument();
  });
});
