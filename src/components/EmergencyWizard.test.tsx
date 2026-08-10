import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmergencyWizard from './EmergencyWizard';

describe('EmergencyWizard', () => {
  it('renders the initial state with no scenario selected', () => {
    render(<EmergencyWizard />);
    
    expect(screen.getByTestId('emergency-wizard')).toBeInTheDocument();
    expect(screen.getByText('Select a situation above to view your action plan.')).toBeInTheDocument();
    expect(screen.queryByTestId('wizard-results')).not.toBeInTheDocument();
  });

  it('shows steps when a scenario is clicked', () => {
    render(<EmergencyWizard />);
    
    // Click the "link" scenario
    fireEvent.click(screen.getByText('I clicked a suspicious link in an email/text'));
    
    expect(screen.getByTestId('wizard-results')).toBeInTheDocument();
    
    // Check if the steps are rendered
    expect(screen.getByText('Disconnect from the Internet:')).toBeInTheDocument();
    expect(screen.getByText('Run a full Antivirus Scan:')).toBeInTheDocument();
    
    // The placeholder text should be gone
    expect(screen.queryByText('Select a situation above to view your action plan.')).not.toBeInTheDocument();
  });

  it('switches steps when a different scenario is clicked', () => {
    render(<EmergencyWizard />);
    
    // Click money scenario
    fireEvent.click(screen.getByText('I sent money or gift cards to a scammer'));
    
    expect(screen.getByText('Contact your bank immediately:')).toBeInTheDocument();
    expect(screen.getByText('Report Gift Cards:')).toBeInTheDocument();
    
    // Click virus scenario
    fireEvent.click(screen.getByText('I think my computer has a virus (Pop-ups, slow, frozen)'));
    
    expect(screen.getByText('Enter Safe Mode:')).toBeInTheDocument();
    expect(screen.queryByText('Report Gift Cards:')).not.toBeInTheDocument();
  });
});
