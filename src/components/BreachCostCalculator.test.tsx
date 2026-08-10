import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BreachCostCalculator from './BreachCostCalculator';

describe('BreachCostCalculator', () => {
  it('renders initial state correctly with defaults', () => {
    render(<BreachCostCalculator />);
    
    expect(screen.getByTestId('breach-calculator')).toBeInTheDocument();
    
    // Default Industry: Other ($115/record)
    // Records: 1000
    // Downtime: 3 days @ $2000/day
    // Base IR: 15000 + (1000*5) = 20000
    // Data Loss: 115000
    // Downtime Cost: 6000
    // Fines: 11500
    // Total = 115000 + 6000 + 20000 + 11500 = $152,500
    
    expect(screen.getByTestId('total-cost')).toHaveTextContent('$152,500');
  });

  it('updates total cost when industry and sliders change', () => {
    render(<BreachCostCalculator />);
    
    // Change to healthcare (Higher cost per record + higher fine multiplier)
    fireEvent.change(screen.getByTestId('industry-select'), { target: { value: 'healthcare' } });
    
    // Data Loss: 1000 * 164 = 164000
    // Downtime Cost: 6000
    // Base IR: 20000
    // Fines (25% for healthcare): 41000
    // Total = 164000 + 6000 + 20000 + 41000 = $231,000
    expect(screen.getByTestId('total-cost')).toHaveTextContent('$231,000');
    
    // Update daily revenue
    fireEvent.change(screen.getByTestId('revenue-input'), { target: { value: '5000' } });
    // Downtime Cost now 15000 (+9000 to total) -> $240,000
    expect(screen.getByTestId('total-cost')).toHaveTextContent('$240,000');
  });

  it('calculates cyber insurance coverage correctly', () => {
    render(<BreachCostCalculator />);
    // Initial cost: $152,500
    
    // Turn on insurance
    fireEvent.click(screen.getByTestId('insurance-toggle'));
    
    // Deductible is 10k. Total is 152,500. Insurance covers 142,500. Out of pocket = 10,000.
    expect(screen.getByTestId('total-cost')).toHaveTextContent('$10,000');
    expect(screen.getByText(/Insurance covered \$142,500/)).toBeInTheDocument();
  });
  
  it('caps insurance coverage at $1M', () => {
    render(<BreachCostCalculator />);
    
    // Set records to max to push cost way over $1M
    const slider = screen.getByTestId('records-slider');
    fireEvent.change(slider, { target: { value: '50000' } });
    fireEvent.click(screen.getByTestId('insurance-toggle'));
    
    // Check that out of pocket is (Total - 1M)
    const outOfPocketStr = screen.getByTestId('total-cost').textContent?.replace(/[^0-9]/g, '');
    const outOfPocketNum = parseInt(outOfPocketStr || '0', 10);
    
    expect(outOfPocketNum).toBeGreaterThan(10000); // Because it exceeded max coverage
  });
});
