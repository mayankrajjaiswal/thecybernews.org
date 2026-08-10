import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JsonFormatter from './JsonFormatter';

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('JsonFormatter', () => {
  it('renders correctly', () => {
    render(<JsonFormatter />);
    expect(screen.getByTestId('json-formatter')).toBeInTheDocument();
    expect(screen.getByText('Valid JSON will appear here.')).toBeInTheDocument();
  });

  it('formats valid JSON', () => {
    render(<JsonFormatter />);
    const textarea = screen.getByTestId('json-input');
    
    // Input minified json
    fireEvent.change(textarea, { target: { value: '{"test":"value","num":1}' } });
    fireEvent.click(screen.getByText('Format'));
    
    const output = screen.getByTestId('json-output');
    // It should now have line breaks and spaces
    expect(output.textContent).toContain('{\n  "test": "value",\n  "num": 1\n}');
  });

  it('minifies valid JSON', () => {
    render(<JsonFormatter />);
    const textarea = screen.getByTestId('json-input');
    
    // Input formatted json
    fireEvent.change(textarea, { target: { value: '{\n  "test": "value"\n}' } });
    fireEvent.click(screen.getByText('Minify'));
    
    const output = screen.getByTestId('json-output');
    expect(output.textContent).toBe('{"test":"value"}');
  });

  it('shows error for invalid JSON', () => {
    render(<JsonFormatter />);
    const textarea = screen.getByTestId('json-input');
    
    // Missing quote
    fireEvent.change(textarea, { target: { value: '{test: "value"}' } });
    fireEvent.click(screen.getByText('Format'));
    
    expect(screen.getByTestId('json-error')).toBeInTheDocument();
    expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument();
    // Output should be empty
    expect(screen.queryByTestId('json-output')).not.toBeInTheDocument();
  });

  it('clears all inputs', () => {
    render(<JsonFormatter />);
    const textarea = screen.getByTestId('json-input');
    
    fireEvent.change(textarea, { target: { value: '{"a":1}' } });
    fireEvent.click(screen.getByText('Format'));
    
    expect(screen.getByTestId('json-output')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Clear'));
    
    expect((textarea as HTMLTextAreaElement).value).toBe('');
    expect(screen.queryByTestId('json-output')).not.toBeInTheDocument();
  });

  it('copies to clipboard', () => {
    window.alert = vi.fn();
    render(<JsonFormatter />);
    const textarea = screen.getByTestId('json-input');
    
    fireEvent.change(textarea, { target: { value: '{"a":1}' } });
    fireEvent.click(screen.getByText('Format'));
    
    fireEvent.click(screen.getByText('Copy'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Copied to clipboard!');
  });
});
