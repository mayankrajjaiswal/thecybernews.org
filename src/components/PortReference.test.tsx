import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PortReference from './PortReference';
import React from 'react';

describe('PortReference Component', () => {
  it('renders correctly with default ports', () => {
    render(<PortReference />);
    expect(screen.getByText('Search Ports')).toBeInTheDocument();
    
    // Check if some default ports are rendered
    expect(screen.getByText('443')).toBeInTheDocument();
    expect(screen.getByText('HTTPS')).toBeInTheDocument();
  });

  it('filters ports by number', () => {
    render(<PortReference />);
    const input = screen.getByTestId('port-search-input');
    
    fireEvent.change(input, { target: { value: '443' } });
    
    // 443 should be there, 80 should be gone
    expect(screen.getByText('HTTPS')).toBeInTheDocument();
    expect(screen.queryByText('HTTP')).not.toBeInTheDocument();
  });

  it('filters ports by service name', () => {
    render(<PortReference />);
    const input = screen.getByTestId('port-search-input');
    
    fireEvent.change(input, { target: { value: 'ssh' } });
    
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.queryByText('21')).not.toBeInTheDocument();
  });

  it('shows no results message when nothing matches', () => {
    render(<PortReference />);
    const input = screen.getByTestId('port-search-input');
    
    fireEvent.change(input, { target: { value: '999999' } });
    
    expect(screen.getByText(/No ports found matching/)).toBeInTheDocument();
  });
});
