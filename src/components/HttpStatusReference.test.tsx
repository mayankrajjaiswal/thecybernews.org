import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HttpStatusReference from './HttpStatusReference';
import React from 'react';

describe('HttpStatusReference Component', () => {
  it('renders correctly with default codes', () => {
    render(<HttpStatusReference />);
    expect(screen.getByText('Search Status Codes')).toBeInTheDocument();
    
    // Check if 404 is rendered
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('filters codes by number', () => {
    render(<HttpStatusReference />);
    const input = screen.getByTestId('status-search-input');
    
    fireEvent.change(input, { target: { value: '404' } });
    
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
  });

  it('filters codes by text', () => {
    render(<HttpStatusReference />);
    const input = screen.getByTestId('status-search-input');
    
    fireEvent.change(input, { target: { value: 'forbidden' } });
    
    expect(screen.getByText('403')).toBeInTheDocument();
  });

  it('filters codes by category select', () => {
    render(<HttpStatusReference />);
    const select = screen.getByTestId('status-class-filter');
    
    fireEvent.change(select, { target: { value: '2xx' } });
    
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.queryByText('Not Found')).not.toBeInTheDocument();
  });

  it('shows no results message', () => {
    render(<HttpStatusReference />);
    const input = screen.getByTestId('status-search-input');
    
    fireEvent.change(input, { target: { value: '999' } });
    
    expect(screen.getByText(/No status codes found matching your criteria/)).toBeInTheDocument();
  });
});
