import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UrlDecoder from './UrlDecoder';
import React from 'react';

describe('UrlDecoder Component', () => {
  it('renders correctly', () => {
    render(<UrlDecoder />);
    expect(screen.getByText('Paste the suspicious link here:')).toBeInTheDocument();
    expect(screen.getByTestId('analyze-btn')).toBeInTheDocument();
  });

  it('handles empty input gracefully', () => {
    render(<UrlDecoder />);
    const btn = screen.getByTestId('analyze-btn');
    fireEvent.click(btn);
    expect(screen.queryByText('Analysis Results')).not.toBeInTheDocument();
  });

  it('decodes URI encoded URLs correctly', () => {
    render(<UrlDecoder />);
    const input = screen.getByTestId('url-input');
    const btn = screen.getByTestId('analyze-btn');

    // Simulate user typing encoded URL
    fireEvent.change(input, { target: { value: 'https%3A%2F%2Fexample.com%2Fpath%3Fname%3Djohn%20doe' } });
    fireEvent.click(btn);

    expect(screen.getByText('Analysis Results')).toBeInTheDocument();
    expect(screen.getByTestId('decoded-output').textContent).toBe('https://example.com/path?name=john doe');
    expect(screen.getByTestId('domain-output').textContent).toBe('example.com');
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('john doe')).toBeInTheDocument();
  });

  it('adds protocol if missing', () => {
    render(<UrlDecoder />);
    const input = screen.getByTestId('url-input');
    const btn = screen.getByTestId('analyze-btn');

    fireEvent.change(input, { target: { value: 'example.org' } });
    fireEvent.click(btn);

    expect(screen.getByTestId('decoded-output').textContent).toBe('example.org');
    expect(screen.getByTestId('domain-output').textContent).toBe('example.org');
    expect(screen.getByText('HTTP (Unencrypted/Insecure)')).toBeInTheDocument();
  });

  it('handles invalid URL structures gracefully', () => {
    render(<UrlDecoder />);
    const input = screen.getByTestId('url-input');
    const btn = screen.getByTestId('analyze-btn');

    // Use a string that cannot possibly have a hostname after prepending http://
    fireEvent.change(input, { target: { value: 'http://' } });
    fireEvent.click(btn);

    expect(screen.getByText(/Could not parse the structure of this URL/)).toBeInTheDocument();
  });

  it('falls back to raw string when URI decoding fails', () => {
    render(<UrlDecoder />);
    const input = screen.getByTestId('url-input');
    const btn = screen.getByTestId('analyze-btn');

    // %AF is an invalid malformed URI sequence, forcing decodeURIComponent to throw
    fireEvent.change(input, { target: { value: 'https://example.com/%AF' } });
    fireEvent.click(btn);

    expect(screen.getByTestId('decoded-output').textContent).toBe('https://example.com/%AF');
  });
});
