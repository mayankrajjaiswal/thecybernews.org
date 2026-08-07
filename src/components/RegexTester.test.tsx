import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegexTester from './RegexTester';
import React from 'react';

describe('RegexTester Component', () => {
  it('renders correctly', () => {
    render(<RegexTester />);
    expect(screen.getByText('Regular Expression')).toBeInTheDocument();
    expect(screen.getByText('Test String')).toBeInTheDocument();
  });

  it('handles valid regex matching globally', () => {
    render(<RegexTester />);
    const patternInput = screen.getByTestId('regex-pattern');
    const testInput = screen.getByTestId('regex-test-string');
    
    fireEvent.change(patternInput, { target: { value: '\\d+' } });
    fireEvent.change(testInput, { target: { value: 'There are 3 apples and 14 oranges' } });
    
    expect(screen.getByTestId('match-count').textContent).toBe('2 matches');
    expect(screen.getAllByText('3').length).toBeGreaterThan(0); // The match value
    expect(screen.getAllByText('14').length).toBeGreaterThan(0);
  });

  it('handles invalid regex gracefully', () => {
    render(<RegexTester />);
    const patternInput = screen.getByTestId('regex-pattern');
    
    // Unterminated group
    fireEvent.change(patternInput, { target: { value: '(abc' } });
    
    expect(screen.getByTestId('regex-error')).toBeInTheDocument();
  });

  it('handles invalid flags gracefully', () => {
    render(<RegexTester />);
    const patternInput = screen.getByTestId('regex-pattern');
    const flagInput = screen.getByTestId('regex-flags');
    
    fireEvent.change(patternInput, { target: { value: 'abc' } });
    fireEvent.change(flagInput, { target: { value: 'x' } }); // invalid flag
    
    expect(screen.getByTestId('regex-error')).toBeInTheDocument();
    expect(screen.getByTestId('regex-error').textContent).toBe('Invalid regular expression flags.');
  });
  
  it('handles non-global matching', () => {
    render(<RegexTester />);
    const patternInput = screen.getByTestId('regex-pattern');
    const flagInput = screen.getByTestId('regex-flags');
    const testInput = screen.getByTestId('regex-test-string');
    
    fireEvent.change(patternInput, { target: { value: '\\d+' } });
    fireEvent.change(flagInput, { target: { value: '' } }); // remove global flag
    fireEvent.change(testInput, { target: { value: 'There are 3 apples and 14 oranges' } });
    
    expect(screen.getByTestId('match-count').textContent).toBe('1 matches');
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });
});
