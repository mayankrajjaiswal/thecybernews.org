import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Mythbuster from './Mythbuster';

describe('Mythbuster', () => {
  it('renders initial state correctly', () => {
    render(<Mythbuster />);
    
    expect(screen.getByTestId('mythbuster')).toBeInTheDocument();
    
    // Check if questions are rendered
    expect(screen.getByText('Can I get hacked just by answering a spam phone call?')).toBeInTheDocument();
    expect(screen.getByText('Can I get hacked just by opening a spam email?')).toBeInTheDocument();
  });

  it('flips a card when clicked to reveal a myth', () => {
    render(<Mythbuster />);
    
    const card = screen.getByTestId('card-1');
    fireEvent.click(card);
    
    expect(screen.getAllByText("It's a Myth!")[0]).toBeInTheDocument();
    expect(screen.getByText(/Simply picking up the phone and saying "Hello" cannot hack your phone/)).toBeInTheDocument();
  });

  it('flips a card when clicked to reveal a fact', () => {
    render(<Mythbuster />);
    
    const card = screen.getByTestId('card-3');
    fireEvent.click(card);
    
    expect(screen.getAllByText('Fact! (Danger)')[0]).toBeInTheDocument();
    expect(screen.getByText(/This is called a "Drive-by Download."/)).toBeInTheDocument();
  });

  it('un-flips a card when clicked twice', () => {
    render(<Mythbuster />);
    
    const card = screen.getByTestId('card-1');
    const innerContainer = card.firstElementChild;
    
    // Initially not flipped
    expect(innerContainer).not.toHaveClass('rotate-y-180');
    
    // Click to flip
    fireEvent.click(card);
    expect(innerContainer).toHaveClass('rotate-y-180');
    
    // Click again to un-flip
    fireEvent.click(card);
    expect(innerContainer).not.toHaveClass('rotate-y-180');
  });
});
