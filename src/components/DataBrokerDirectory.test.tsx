import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import DataBrokerDirectory from './DataBrokerDirectory';

describe('DataBrokerDirectory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly', () => {
    render(<DataBrokerDirectory />);
    expect(screen.getByTestId('broker-directory')).toBeInTheDocument();
    
    // Check if brokers are listed
    expect(screen.getByText('Whitepages')).toBeInTheDocument();
    expect(screen.getByText('Spokeo')).toBeInTheDocument();
    expect(screen.getByText('TruePeopleSearch')).toBeInTheDocument();
  });

  it('toggles completion and saves to local storage', () => {
    render(<DataBrokerDirectory />);
    
    // Initial progress is 0%
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    // Click toggle for whitepages
    const whitepagesBtn = screen.getByTestId('toggle-whitepages');
    fireEvent.click(whitepagesBtn);
    
    // Progress should update (1 out of 5 = 20%)
    expect(screen.getByText('20%')).toBeInTheDocument();
    
    // Check local storage
    const saved = JSON.parse(localStorage.getItem('cyber_optout_progress') || '[]');
    expect(saved).toContain('whitepages');
    
    // Un-toggle
    fireEvent.click(whitepagesBtn);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('loads progress from local storage on mount', () => {
    // Pre-seed local storage
    localStorage.setItem('cyber_optout_progress', JSON.stringify(['whitepages', 'spokeo']));
    
    render(<DataBrokerDirectory />);
    
    // Progress should be 2 out of 5 = 40%
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
