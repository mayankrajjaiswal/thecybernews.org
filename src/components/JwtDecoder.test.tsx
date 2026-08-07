import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JwtDecoder from './JwtDecoder';
import React from 'react';

const validHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
const validPayload = btoa(JSON.stringify({ sub: "1234567890", name: "John Doe", iat: 1516239022 }));
const validSignature = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const validToken = `${validHeader}.${validPayload}.${validSignature}`;

describe('JwtDecoder Component', () => {
  it('renders correctly', () => {
    render(<JwtDecoder />);
    expect(screen.getByText('Paste JWT Token Here')).toBeInTheDocument();
  });

  it('decodes a valid JWT successfully', () => {
    render(<JwtDecoder />);
    const input = screen.getByTestId('jwt-input');
    
    fireEvent.change(input, { target: { value: validToken } });
    
    expect(screen.getByTestId('jwt-header').textContent).toContain('"alg": "HS256"');
    expect(screen.getByTestId('jwt-payload').textContent).toContain('"name": "John Doe"');
    expect(screen.getByTestId('jwt-signature').textContent).toContain(validSignature);
  });

  it('shows error for missing dot segments', () => {
    render(<JwtDecoder />);
    const input = screen.getByTestId('jwt-input');
    
    fireEvent.change(input, { target: { value: 'invalid.token' } });
    expect(screen.getByTestId('jwt-error').textContent).toContain('Invalid JWT format');
  });

  it('shows error for malformed base64 JSON', () => {
    render(<JwtDecoder />);
    const input = screen.getByTestId('jwt-input');
    
    fireEvent.change(input, { target: { value: 'invalid.invalid.invalid' } });
    expect(screen.getByTestId('jwt-error').textContent).toContain('Failed to parse token parts');
  });
});
