import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DigitalLegacyGenerator from './DigitalLegacyGenerator';

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('DigitalLegacyGenerator', () => {
  it('renders initial state correctly with defaults', () => {
    render(<DigitalLegacyGenerator />);
    
    expect(screen.getByTestId('legacy-generator')).toBeInTheDocument();
    
    // Check initial preview text
    const preview = screen.getByTestId('legacy-preview');
    expect(preview).toHaveTextContent('[Your Name]');
    expect(preview).toHaveTextContent('[Executor/Spouse Name]');
    expect(preview).toHaveTextContent('Written in my physical safe');
    expect(preview).toHaveTextContent('In the red folder in my filing cabinet');
    expect(preview).toHaveTextContent('My primary cell phone');
    expect(preview).toHaveTextContent('I have not set up an official Apple Legacy Contact');
    expect(preview).toHaveTextContent('I have not set up Google Inactive Account Manager');
    expect(preview).not.toHaveTextContent('Cryptocurrency Assets'); // default false
  });

  it('updates the plan when inputs change', () => {
    render(<DigitalLegacyGenerator />);
    
    // Change Names
    fireEvent.change(screen.getByPlaceholderText('e.g. John Doe'), { target: { value: 'Alice Smith' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Jane Doe (Wife)'), { target: { value: 'Bob Smith' } });
    
    // Toggle checkboxes
    fireEvent.click(screen.getByTestId('check-apple')); 
    fireEvent.click(screen.getByTestId('check-google')); 
    fireEvent.click(screen.getByTestId('check-crypto')); 
    
    // Check updated preview
    const preview = screen.getByTestId('legacy-preview');
    expect(preview).toHaveTextContent('Alice Smith');
    expect(preview).toHaveTextContent('Bob Smith');
    expect(preview).toHaveTextContent('I have officially designated you as my "Legacy Contact"');
    expect(preview).toHaveTextContent('I have set up Google\'s "Inactive Account Manager"');
    expect(preview).toHaveTextContent('Cryptocurrency Assets');
    expect(preview).toHaveTextContent('Seed phrase is in the safety deposit box.');
  });

  it('copies to clipboard', () => {
    window.alert = vi.fn(); 
    
    render(<DigitalLegacyGenerator />);
    
    fireEvent.click(screen.getByText('Copy to Clipboard'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Plan copied to clipboard! Paste it into Word/Google Docs, print it, and store it securely.');
  });
});
