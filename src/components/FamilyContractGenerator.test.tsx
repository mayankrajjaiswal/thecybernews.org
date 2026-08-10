import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FamilyContractGenerator from './FamilyContractGenerator';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('FamilyContractGenerator', () => {
  it('renders initial state correctly with defaults', () => {
    render(<FamilyContractGenerator />);
    
    expect(screen.getByTestId('contract-generator')).toBeInTheDocument();
    
    // Check initial preview text
    const preview = screen.getByTestId('contract-preview');
    expect(preview).toHaveTextContent('[Parent Name] (Parent/Guardian) and [Child Name] (Child)');
    expect(preview).toHaveTextContent('21:00');
    expect(preview).toHaveTextContent('2 hours');
    expect(preview).toHaveTextContent('NOT allowed to create social media accounts'); // Default false
    expect(preview).toHaveTextContent('allowed to play multiplayer games'); // Default true
    expect(preview).toHaveTextContent('loss of device privileges for 24 hours');
  });

  it('updates the contract when inputs change', () => {
    render(<FamilyContractGenerator />);
    
    // Change Names
    const parentInput = screen.getByPlaceholderText('e.g. Mom & Dad');
    fireEvent.change(parentInput, { target: { value: 'Mom' } });
    
    const childInput = screen.getByPlaceholderText('e.g. Alex');
    fireEvent.change(childInput, { target: { value: 'Leo' } });
    
    // Toggle checkboxes
    fireEvent.click(screen.getByTestId('check-social')); // Turn on social media
    fireEvent.click(screen.getByTestId('check-gaming')); // Turn off multiplayer
    
    // Check updated preview
    const preview = screen.getByTestId('contract-preview');
    expect(preview).toHaveTextContent('Mom (Parent/Guardian) and Leo (Child)');
    expect(preview).toHaveTextContent('allowed to use approved social media apps'); // Social on
    expect(preview).toHaveTextContent('only play single-player games'); // Multiplayer off
  });

  it('copies to clipboard', () => {
    window.alert = vi.fn(); // Mock alert
    
    render(<FamilyContractGenerator />);
    
    fireEvent.click(screen.getByText('Copy to Clipboard'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Contract copied to clipboard! You can paste it into Word/Google Docs to print.');
  });
});
