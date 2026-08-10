import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RansomwareSimulator from './RansomwareSimulator';

describe('RansomwareSimulator', () => {
  it('renders the initial start state correctly', () => {
    render(<RansomwareSimulator />);
    
    expect(screen.getByTestId('ransomware-sim')).toBeInTheDocument();
    expect(screen.getByText('Monday Morning, 8:00 AM')).toBeInTheDocument();
    
    // Check initial choices
    expect(screen.getByText('Unplug the computer from the wall/network immediately.')).toBeInTheDocument();
    expect(screen.getByText('Try to restart the computer to see if it fixes it.')).toBeInTheDocument();
  });

  it('navigates to a disaster ending if restarted', () => {
    render(<RansomwareSimulator />);
    
    fireEvent.click(screen.getByText('Try to restart the computer to see if it fixes it.'));
    
    expect(screen.getByText('A Fatal Mistake')).toBeInTheDocument();
    expect(screen.getByText('Total Disaster')).toBeInTheDocument();
    expect(screen.getByText(/Never reboot an infected computer/)).toBeInTheDocument();
    
    // Check Play Again button
    expect(screen.getByText('Play Again')).toBeInTheDocument();
  });

  it('navigates the successful golden path', () => {
    render(<RansomwareSimulator />);
    
    // 1. Unplug
    fireEvent.click(screen.getByText('Unplug the computer from the wall/network immediately.'));
    expect(screen.getByText('Containment Successful')).toBeInTheDocument();
    
    // 2. Restore Backup
    fireEvent.click(screen.getByText('Call your IT team to wipe the computer and restore from backups.'));
    expect(screen.getByText('The Backup Test')).toBeInTheDocument();
    
    // 3. Good Backup
    fireEvent.click(screen.getByText('You use an off-site, disconnected cloud backup.'));
    expect(screen.getByText('Disaster Averted')).toBeInTheDocument();
    
    // End State
    expect(screen.getByText('Crisis Averted')).toBeInTheDocument();
    expect(screen.getByText(/isolated, tested, offline backups/)).toBeInTheDocument();
  });

  it('navigates the failure path (paying ransom)', () => {
    render(<RansomwareSimulator />);
    
    // 1. Unplug
    fireEvent.click(screen.getByText('Unplug the computer from the wall/network immediately.'));
    
    // 2. Pay Ransom
    fireEvent.click(screen.getByText('Contact a cryptocurrency broker and pay the ransom.'));
    expect(screen.getByText('A Costly Gamble')).toBeInTheDocument();
    
    // End State
    expect(screen.getByText('Costly Failure')).toBeInTheDocument();
    expect(screen.getByText(/Paying a ransom NEVER guarantees you get your files back/)).toBeInTheDocument();
  });

  it('allows resetting the game mid-way', () => {
    render(<RansomwareSimulator />);
    
    // 1. Unplug
    fireEvent.click(screen.getByText('Unplug the computer from the wall/network immediately.'));
    expect(screen.getByText('Containment Successful')).toBeInTheDocument();
    
    // Reset
    fireEvent.click(screen.getByText('Reset Sim'));
    expect(screen.getByText('Monday Morning, 8:00 AM')).toBeInTheDocument();
  });

  it('allows playing again after game over', () => {
    render(<RansomwareSimulator />);
    
    fireEvent.click(screen.getByText('Quickly email your IT guy for help from that computer.'));
    expect(screen.getByText('The Infection Spreads')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Play Again'));
    expect(screen.getByText('Monday Morning, 8:00 AM')).toBeInTheDocument();
  });
});
