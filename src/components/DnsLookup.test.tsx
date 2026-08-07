import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DnsLookup from './DnsLookup';
import React from 'react';

// Mock the global fetch API
global.fetch = vi.fn();

describe('DnsLookup Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders correctly', () => {
    render(<DnsLookup />);
    expect(screen.getByText('DNS Lookup')).toBeInTheDocument();
  });

  it('performs a successful lookup', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        Status: 0,
        Answer: [
          { name: "example.com.", type: 1, TTL: 300, data: "93.184.216.34" }
        ]
      })
    });

    render(<DnsLookup />);
    const input = screen.getByTestId('dns-input');
    const button = screen.getByTestId('dns-submit');

    fireEvent.change(input, { target: { value: 'example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('93.184.216.34')).toBeInTheDocument();
      expect(screen.getByText('example.com.')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });

  it('cleans up URLs before searching', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Status: 0, Answer: [{ name: "example.com.", type: 1, TTL: 300, data: "1.2.3.4" }] })
    });

    render(<DnsLookup />);
    const input = screen.getByTestId('dns-input');
    const button = screen.getByTestId('dns-submit');

    fireEvent.change(input, { target: { value: 'https://www.example.com/path' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('name=example.com'));
    });
  });

  it('handles NXDOMAIN gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Status: 3 })
    });

    render(<DnsLookup />);
    const input = screen.getByTestId('dns-input');
    const button = screen.getByTestId('dns-submit');

    fireEvent.change(input, { target: { value: 'doesnotexist12345.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Domain not found (NXDOMAIN).')).toBeInTheDocument();
    });
  });

  it('handles empty answers gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ Status: 0, Answer: [] })
    });

    render(<DnsLookup />);
    const input = screen.getByTestId('dns-input');
    const button = screen.getByTestId('dns-submit');

    fireEvent.change(input, { target: { value: 'example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('dns-error').textContent).toContain('No A records found for example.com');
    });
  });

  it('handles network errors gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false
    });

    render(<DnsLookup />);
    const input = screen.getByTestId('dns-input');
    const button = screen.getByTestId('dns-submit');

    fireEvent.change(input, { target: { value: 'example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to communicate with DNS resolver.')).toBeInTheDocument();
    });
  });
});
