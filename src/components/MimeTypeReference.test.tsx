import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MimeTypeReference from './MimeTypeReference';

describe('MimeTypeReference', () => {
  it('renders correctly with all items initially', () => {
    render(<MimeTypeReference />);
    
    expect(screen.getByTestId('mime-reference')).toBeInTheDocument();
    
    // Check if some key extensions are rendered
    expect(screen.getByText('.exe')).toBeInTheDocument();
    expect(screen.getByText('.pdf')).toBeInTheDocument();
    expect(screen.getByText('.zip')).toBeInTheDocument();
  });

  it('filters by search term', () => {
    render(<MimeTypeReference />);
    
    const searchInput = screen.getByPlaceholderText('Search extensions (e.g., .exe)');
    fireEvent.change(searchInput, { target: { value: 'script' } });
    
    // VBScript and JavaScript should be there
    expect(screen.getByText('.vbs')).toBeInTheDocument();
    expect(screen.getByText('.js')).toBeInTheDocument();
    
    // .exe should NOT be there
    expect(screen.queryByText('.exe')).not.toBeInTheDocument();
  });

  it('filters by risk category button', () => {
    render(<MimeTypeReference />);
    
    const safeBtn = screen.getByText('Safe');
    fireEvent.click(safeBtn);
    
    expect(screen.getByText('.txt')).toBeInTheDocument();
    expect(screen.getByText('.jpg')).toBeInTheDocument();
    
    expect(screen.queryByText('.exe')).not.toBeInTheDocument();
  });

  it('shows empty state when no matches found', () => {
    render(<MimeTypeReference />);
    
    const searchInput = screen.getByPlaceholderText('Search extensions (e.g., .exe)');
    fireEvent.change(searchInput, { target: { value: 'nonexistentext' } });
    
    expect(screen.getByText('No extensions found matching your search.')).toBeInTheDocument();
  });
});
