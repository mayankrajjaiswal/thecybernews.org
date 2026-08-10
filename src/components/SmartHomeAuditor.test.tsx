import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import SmartHomeAuditor from './SmartHomeAuditor';

describe('SmartHomeAuditor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial state correctly with router selected', () => {
    render(<SmartHomeAuditor />);
    
    expect(screen.getByTestId('smart-home-auditor')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi Router')).toBeInTheDocument();
    
    // Check progress
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    // Check tasks
    expect(screen.getByText('Change the default Admin password.')).toBeInTheDocument();
  });

  it('toggles devices and updates checklist', () => {
    render(<SmartHomeAuditor />);
    
    // Toggle Camera ON
    fireEvent.click(screen.getByTestId('toggle-dev-d_camera'));
    
    // Tasks should now include camera tasks
    expect(screen.getByText('Security Cameras (Ring, Nest, Baby Monitors) Settings')).toBeInTheDocument();
    expect(screen.getByText('Enable Multi-Factor Authentication (MFA).')).toBeInTheDocument();
    
    // Toggle Router OFF
    fireEvent.click(screen.getByTestId('toggle-dev-d_router'));
    expect(screen.queryByText('Wi-Fi Router Settings')).not.toBeInTheDocument();
  });

  it('toggles tasks, updates progress, and saves to localStorage', () => {
    render(<SmartHomeAuditor />);
    
    // Default Router has 3 tasks
    // Click task 1
    fireEvent.click(screen.getByTestId('task-t_router_1'));
    
    // Progress should be 33% (1/3)
    expect(screen.getByText('33%')).toBeInTheDocument();
    
    const savedTasks = JSON.parse(localStorage.getItem('cyber_smarthome_tasks') || '[]');
    expect(savedTasks).toContain('t_router_1');
    
    // Untoggle
    fireEvent.click(screen.getByTestId('task-t_router_1'));
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles empty device state', () => {
    render(<SmartHomeAuditor />);
    
    // Turn off router
    fireEvent.click(screen.getByTestId('toggle-dev-d_router'));
    
    expect(screen.getByText('Select devices on the left to see your checklist.')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument(); // 0 tasks = 0%
  });
});
