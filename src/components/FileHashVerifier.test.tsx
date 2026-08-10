import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FileHashVerifier from './FileHashVerifier';

// Mock the crypto.subtle API for the test environment
const mockDigest = vi.fn().mockResolvedValue(new Uint8Array([15, 134, 208, 129, 136, 76, 125, 101, 154, 47, 234, 160, 197, 90, 208, 21, 163, 191, 79, 27, 43, 11, 130, 44, 209, 93, 108, 21, 176, 240, 10, 8]).buffer);

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: mockDigest,
    },
  },
});

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('FileHashVerifier', () => {
  it('renders initial state correctly', () => {
    render(<FileHashVerifier />);
    expect(screen.getByTestId('file-hash-verifier')).toBeInTheDocument();
    expect(screen.getByText('Click to select a file from your device')).toBeInTheDocument();
  });

  it('computes hash when a file is selected', async () => {
    render(<FileHashVerifier />);
    
    const fileInput = screen.getByTestId('file-input');
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    
    expect(screen.getByText('Computing SHA-256 hash locally...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('hash-results')).toBeInTheDocument();
    });
    
    // Check if the mocked hash output is displayed (0f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08)
    expect(screen.getByText('0f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')).toBeInTheDocument();
    expect(screen.getByText('test.txt')).toBeInTheDocument();
    expect(screen.getByText('12 Bytes')).toBeInTheDocument();
  });

  it('shows MATCH when expected hash equals computed hash', async () => {
    render(<FileHashVerifier />);
    
    // Enter expected hash
    const hashInput = screen.getByTestId('expected-hash-input');
    fireEvent.change(hashInput, { target: { value: '0F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08' } }); // Testing case-insensitivity
    
    // Select file
    const fileInput = screen.getByTestId('file-input');
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    
    await waitFor(() => {
      expect(screen.getByText('Hashes Match!')).toBeInTheDocument();
    });
  });

  it('shows MISMATCH when expected hash does not equal computed hash', async () => {
    render(<FileHashVerifier />);
    
    // Enter wrong expected hash
    const hashInput = screen.getByTestId('expected-hash-input');
    fireEvent.change(hashInput, { target: { value: 'badhash123' } });
    
    // Select file
    const fileInput = screen.getByTestId('file-input');
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });
    
    await waitFor(() => {
      expect(screen.getByText('MISMATCH DETECTED')).toBeInTheDocument();
    });
  });

  it('allows clicking the dropzone to trigger file input', () => {
    render(<FileHashVerifier />);
    const dropzone = screen.getByTestId('file-dropzone');
    const fileInput = screen.getByTestId('file-input');
    
    const clickSpy = vi.spyOn(fileInput, 'click');
    fireEvent.click(dropzone);
    
    expect(clickSpy).toHaveBeenCalled();
  });
});
