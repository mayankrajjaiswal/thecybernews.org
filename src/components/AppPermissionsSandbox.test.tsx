import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AppPermissionsSandbox from './AppPermissionsSandbox';

describe('AppPermissionsSandbox', () => {
  it('renders the initial state correctly', () => {
    render(<AppPermissionsSandbox />);
    
    expect(screen.getByTestId('app-sandbox')).toBeInTheDocument();
    expect(screen.getByText('Super Free Flashlight')).toBeInTheDocument();
    
    // Check if permissions are listed
    expect(screen.getByText('Allow access to Camera & Flash?')).toBeInTheDocument();
    expect(screen.getByText('Allow access to Contacts?')).toBeInTheDocument();
    expect(screen.getByText('Allow access to Location (GPS)?')).toBeInTheDocument();
  });

  it('handles user decisions and calculates correct score', () => {
    render(<AppPermissionsSandbox />);
    
    // Scenario 1: Super Free Flashlight
    // Allow Camera (Correct)
    fireEvent.click(screen.getByTestId('allow-camera'));
    // Deny Contacts (Correct)
    fireEvent.click(screen.getByTestId('deny-contacts'));
    // Deny Location (Correct)
    fireEvent.click(screen.getByTestId('deny-location'));
    
    // Confirm
    fireEvent.click(screen.getByText('Confirm Choices'));
    
    expect(screen.getByTestId('sandbox-results')).toBeInTheDocument();
    // 3/3 Correct
    expect(screen.getByText('3/3')).toBeInTheDocument();
    expect(screen.getByText(/A flashlight app needs access to your camera/)).toBeInTheDocument();
  });

  it('progresses to next scenario and resets state', () => {
    render(<AppPermissionsSandbox />);
    
    // Quick complete Scenario 1
    fireEvent.click(screen.getByTestId('allow-camera'));
    fireEvent.click(screen.getByTestId('deny-contacts'));
    fireEvent.click(screen.getByTestId('allow-location')); // Incorrect
    fireEvent.click(screen.getByText('Confirm Choices'));
    
    // Score should be 2/3
    expect(screen.getByText('2/3')).toBeInTheDocument();
    
    // Next
    fireEvent.click(screen.getByText('Next App Scenario'));
    
    // Scenario 2: Weather
    expect(screen.getByText('City Weather Radar')).toBeInTheDocument();
    expect(screen.getByText('Allow access to Location (GPS)?')).toBeInTheDocument();
  });
});
