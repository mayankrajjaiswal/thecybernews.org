import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CreditFreezeTracker from './CreditFreezeTracker';

describe('CreditFreezeTracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial state correctly with defaults', () => {
    render(<CreditFreezeTracker />);
    
    expect(screen.getByTestId('freeze-tracker')).toBeInTheDocument();
    expect(screen.getByText('Credit Freeze Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Your credit file is exposed. Scammers can open accounts in your name.')).toBeInTheDocument();
  });

  it('toggles freeze status and saves to local storage', () => {
    render(<CreditFreezeTracker />);
    
    const equifaxToggle = screen.getByTestId('toggle-equifax');
    fireEvent.click(equifaxToggle);
    
    expect(screen.getByText('Frozen')).toBeInTheDocument();
    
    const saved = JSON.parse(localStorage.getItem('cyber_credit_freeze') || '{}');
    expect(saved['equifax']).toBe(true);
    
    fireEvent.click(equifaxToggle);
    expect(screen.queryByText('Frozen')).not.toBeInTheDocument();
  });

  it('changes dashboard state when 3 main bureaus are frozen', () => {
    render(<CreditFreezeTracker />);
    
    fireEvent.click(screen.getByTestId('toggle-equifax'));
    fireEvent.click(screen.getByTestId('toggle-experian'));
    fireEvent.click(screen.getByTestId('toggle-transunion'));
    
    expect(screen.getByText('Excellent. Your credit is locked down across the major bureaus.')).toBeInTheDocument();
  });

  it('loads progress from local storage on mount', () => {
    localStorage.setItem('cyber_credit_freeze', JSON.stringify({ equifax: true, experian: true, transunion: true }));
    
    render(<CreditFreezeTracker />);
    
    expect(screen.getByText('Excellent. Your credit is locked down across the major bureaus.')).toBeInTheDocument();
    expect(screen.getAllByText('Frozen').length).toBe(3);
  });
});
