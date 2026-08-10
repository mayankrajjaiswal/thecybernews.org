import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QrCodeScannerSim from './QrCodeScannerSim';

describe('QrCodeScannerSim', () => {
  it('renders initial state correctly', () => {
    render(<QrCodeScannerSim />);
    
    expect(screen.getByTestId('qr-sandbox')).toBeInTheDocument();
    expect(screen.getByText('The Parking Meter')).toBeInTheDocument();
    expect(screen.getByText('Waiting for scan...')).toBeInTheDocument();
    expect(screen.getByTestId('scan-btn')).toBeInTheDocument();
  });

  it('handles scanning and opening a dangerous link', async () => {
    vi.useFakeTimers();
    render(<QrCodeScannerSim />);
    
    // Scan
    fireEvent.click(screen.getByTestId('scan-btn'));
    
    // Fast forward the 1.5s timeout
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    
    expect(screen.getByText('QR Code Detected')).toBeInTheDocument();
    expect(screen.getByText('https://pay.parklng-portal-usa.com/checkout')).toBeInTheDocument();
    
    // Choose to OPEN a dangerous link (Fail)
    fireEvent.click(screen.getByTestId('open-btn'));
    
    expect(screen.getByTestId('scenario-result')).toBeInTheDocument();
    expect(screen.getByText('You got phished!')).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('handles scanning and cancelling a dangerous link', async () => {
    vi.useFakeTimers();
    render(<QrCodeScannerSim />);
    
    // Scan
    fireEvent.click(screen.getByTestId('scan-btn'));
    act(() => { vi.advanceTimersByTime(1500); });
    
    // Choose to CANCEL a dangerous link (Pass)
    fireEvent.click(screen.getByTestId('cancel-btn'));
    
    expect(screen.getByText('Good Catch!')).toBeInTheDocument();
    
    // Go to next scenario
    fireEvent.click(screen.getByText('Next Scenario'));
    expect(screen.getByText('The Restaurant Menu')).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('handles the safe scenario correctly', async () => {
    vi.useFakeTimers();
    render(<QrCodeScannerSim />);
    
    // Skip to scenario 2 (Safe Menu)
    fireEvent.click(screen.getByTestId('scan-btn'));
    act(() => { vi.advanceTimersByTime(1500); });
    fireEvent.click(screen.getByTestId('cancel-btn'));
    fireEvent.click(screen.getByText('Next Scenario'));
    
    // Scan safe menu
    fireEvent.click(screen.getByTestId('scan-btn'));
    act(() => { vi.advanceTimersByTime(1500); });
    
    // Choose to OPEN a safe link (Pass)
    fireEvent.click(screen.getByTestId('open-btn'));
    
    expect(screen.getByText('Good Catch!')).toBeInTheDocument();
    expect(screen.getByText(/This is a safe URL/)).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
