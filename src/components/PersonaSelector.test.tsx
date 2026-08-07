import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PersonaSelector from './PersonaSelector';
import React from 'react';

describe('PersonaSelector Component', () => {
  it('renders correctly with default parent persona', () => {
    render(<PersonaSelector />);
    
    // Check if title is present
    expect(screen.getByText('Select your profile to get started:')).toBeInTheDocument();
    
    // Default is parent
    expect(screen.getByText('Guides for Parents')).toBeInTheDocument();
    expect(screen.getByText('Setting up parental controls')).toBeInTheDocument();
  });

  it('changes content when a different persona is clicked', () => {
    render(<PersonaSelector />);
    
    const seniorButton = screen.getByTestId('btn-senior');
    fireEvent.click(seniorButton);
    
    // Content should now reflect Senior Citizen
    expect(screen.getByText('Guides for Senior Citizens')).toBeInTheDocument();
    expect(screen.getByText('Safe online banking practices')).toBeInTheDocument();
    
    // Parent content should no longer be visible
    expect(screen.queryByText('Guides for Parents')).not.toBeInTheDocument();
  });

  it('renders all persona buttons', () => {
    render(<PersonaSelector />);
    
    const expectedButtons = [
      'I am a Parent',
      'I am a Senior Citizen',
      'I am a Student',
      'I am a Employee',
      'I am a Business Owner',
      'I am a IT Pro'
    ];

    expectedButtons.forEach(btnText => {
      expect(screen.getByText(btnText)).toBeInTheDocument();
    });
  });

  it('applies active styling to the selected button', () => {
    render(<PersonaSelector />);
    
    const parentButton = screen.getByTestId('btn-parent');
    const studentButton = screen.getByTestId('btn-student');

    // Default active is parent
    expect(parentButton).toHaveClass('bg-blue-600');
    expect(studentButton).toHaveClass('bg-slate-100');

    // Click student
    fireEvent.click(studentButton);

    // Active state should switch
    expect(studentButton).toHaveClass('bg-blue-600');
    expect(parentButton).toHaveClass('bg-slate-100');
  });
});
