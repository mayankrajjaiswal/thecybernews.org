import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PasswordStrengthVisualizer from './PasswordStrengthVisualizer';

describe('PasswordStrengthVisualizer', () => {
  it('renders initial state correctly', () => {
    render(<PasswordStrengthVisualizer />);
    
    expect(screen.getByTestId('password-visualizer')).toBeInTheDocument();
    expect(screen.getByText('Test Your Password')).toBeInTheDocument();
    
    // Initial empty state values
    expect(screen.getByText('-')).toBeInTheDocument(); // Crack time
    expect(screen.getByText('0')).toBeInTheDocument(); // Entropy
  });

  it('updates strength and crack time when typing a weak password', () => {
    render(<PasswordStrengthVisualizer />);
    const input = screen.getByTestId('password-input');
    
    fireEvent.change(input, { target: { value: 'password' } });
    
    expect(screen.getByText('Weak')).toBeInTheDocument();
    expect(screen.getByText('2 seconds')).toBeInTheDocument();
  });

  it('updates strength and crack time when typing a strong password', () => {
    render(<PasswordStrengthVisualizer />);
    const input = screen.getByTestId('password-input');
    
    fireEvent.change(input, { target: { value: 'CorrectHorseBatteryStaple123!' } });
    
    expect(screen.getByText('Excellent')).toBeInTheDocument();
    expect(screen.getByText('Centuries')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<PasswordStrengthVisualizer />);
    const input = screen.getByTestId('password-input') as HTMLInputElement;
    const toggleBtn = screen.getByText('Show');
    
    expect(input.type).toBe('password');
    
    fireEvent.click(toggleBtn);
    
    expect(input.type).toBe('text');
    expect(screen.getByText('Hide')).toBeInTheDocument();
  });
});
