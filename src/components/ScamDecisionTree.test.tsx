import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ScamDecisionTree from './ScamDecisionTree';

describe('ScamDecisionTree', () => {
  it('renders initial start state', () => {
    render(<ScamDecisionTree />);
    expect(screen.getByTestId('scam-tree')).toBeInTheDocument();
    expect(screen.getByText('How did this person or message contact you?')).toBeInTheDocument();
  });

  it('navigates the tech support pop-up scam path', () => {
    render(<ScamDecisionTree />);
    
    // Choose Pop-up
    fireEvent.click(screen.getByText('A pop-up appeared on my computer screen'));
    expect(screen.getByText(/Does the pop-up say your computer is infected/)).toBeInTheDocument();
    
    // Choose Yes
    fireEvent.click(screen.getByText(/Yes, it says I need to call/));
    
    // Check Result
    expect(screen.getByTestId('tree-result')).toBeInTheDocument();
    expect(screen.getByText('THIS IS A TECH SUPPORT SCAM. HANG UP IMMEDIATELY.')).toBeInTheDocument();
  });

  it('navigates the bank text safe path', () => {
    render(<ScamDecisionTree />);
    
    // Choose Text
    fireEvent.click(screen.getByText('I got a Text Message (SMS)'));
    // Choose Bank
    fireEvent.click(screen.getByText(/My bank account is locked/));
    // Choose No (Safe)
    fireEvent.click(screen.getByText(/No, they just told me to log into my app normally/));
    
    expect(screen.getByText('This sounds like standard banking procedure.')).toBeInTheDocument();
  });

  it('allows going back to the previous question', () => {
    render(<ScamDecisionTree />);
    
    // Go forward
    fireEvent.click(screen.getByText('They called me on the phone'));
    expect(screen.getByText('Who are they claiming to be?')).toBeInTheDocument();
    
    // Go back
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('How did this person or message contact you?')).toBeInTheDocument();
  });

  it('allows starting over from a result', () => {
    render(<ScamDecisionTree />);
    
    // Reach a result
    fireEvent.click(screen.getByText('A pop-up appeared on my computer screen'));
    fireEvent.click(screen.getByText(/No, it is just an advertisement/));
    
    expect(screen.getByText('Probably just an annoying advertisement.')).toBeInTheDocument();
    
    // Start over
    fireEvent.click(screen.getByText('Check another scenario'));
    expect(screen.getByText('How did this person or message contact you?')).toBeInTheDocument();
  });

  it('allows starting over from the top header button', () => {
    render(<ScamDecisionTree />);
    
    // Go forward 1 step
    fireEvent.click(screen.getByText('They called me on the phone'));
    
    // Top header Start Over
    fireEvent.click(screen.getByText('Start Over'));
    expect(screen.getByText('How did this person or message contact you?')).toBeInTheDocument();
  });
});
