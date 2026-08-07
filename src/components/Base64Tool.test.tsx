import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Base64Tool from './Base64Tool';
import React from 'react';

// Setup TextEncoder/TextDecoder polyfill for JSDOM
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('Base64Tool Component', () => {
  it('renders correctly', () => {
    render(<Base64Tool />);
    expect(screen.getByText('Encode')).toBeInTheDocument();
    expect(screen.getByText('Decode')).toBeInTheDocument();
  });

  it('encodes text to base64', () => {
    render(<Base64Tool />);
    const input = screen.getByTestId('base64-input');
    fireEvent.change(input, { target: { value: 'hello world' } });
    expect(screen.getByTestId('base64-output').textContent).toBe('aGVsbG8gd29ybGQ=');
  });

  it('decodes base64 to text', () => {
    render(<Base64Tool />);
    fireEvent.click(screen.getByText('Decode'));
    const input = screen.getByTestId('base64-input');
    fireEvent.change(input, { target: { value: 'aGVsbG8gd29ybGQ=' } });
    expect(screen.getByTestId('base64-output').textContent).toBe('hello world');
  });

  it('handles invalid base64 during decode', () => {
    render(<Base64Tool />);
    fireEvent.click(screen.getByText('Decode'));
    const input = screen.getByTestId('base64-input');
    // '%' is invalid in base64
    fireEvent.change(input, { target: { value: 'aGVsbG8gd29ybGQ=%' } });
    expect(screen.getByTestId('base64-output').textContent).toContain('Invalid input');
  });

  it('copies output to clipboard', () => {
    render(<Base64Tool />);
    const input = screen.getByTestId('base64-input');
    fireEvent.change(input, { target: { value: 'test' } });
    const copyBtn = screen.getByTestId('copy-btn');
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('dGVzdA==');
  });
});
