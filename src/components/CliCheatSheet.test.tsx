import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CliCheatSheet from './CliCheatSheet';

describe('CliCheatSheet', () => {
  it('renders the component and displays default category', () => {
    render(<CliCheatSheet />);
    
    // Check if main container is rendered
    expect(screen.getByTestId('cli-cheat-sheet')).toBeInTheDocument();
    
    // Check default category commands
    expect(screen.getByText('ping <target>')).toBeInTheDocument();
    expect(screen.getByText('tracert <target>')).toBeInTheDocument();
  });

  it('changes categories when buttons are clicked', () => {
    render(<CliCheatSheet />);
    
    // Click Traffic Analysis
    fireEvent.click(screen.getByText('Traffic Analysis'));
    
    // Check if new commands appeared
    expect(screen.getByText('wireshark')).toBeInTheDocument();
    expect(screen.getByText('tcpdump -i any')).toBeInTheDocument();
    
    // Old commands should be gone
    expect(screen.queryByText('ping <target>')).not.toBeInTheDocument();

    // Click OS & Scripting
    fireEvent.click(screen.getByText('OS & Scripting'));
    
    // Check if new commands appeared
    expect(screen.getByText('grep "pattern" <file>')).toBeInTheDocument();
    expect(screen.getByText('curl -I <url>')).toBeInTheDocument();
  });
});
