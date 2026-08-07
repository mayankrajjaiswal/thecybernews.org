import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import GlobalProgress from './GlobalProgress';
import React from 'react';

describe('GlobalProgress Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly with 0 progress', () => {
    render(<GlobalProgress totalArticles={10} />);
    expect(screen.getByText('Your Cyber Academy Progress')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('calculates initial progress from local storage', () => {
    localStorage.setItem('cyber_progress', JSON.stringify(['guide-1', 'guide-2']));
    render(<GlobalProgress totalArticles={4} />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 out of 4 guides
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('updates instantly when the custom event is fired', () => {
    render(<GlobalProgress totalArticles={4} />);
    expect(screen.getByText('0%')).toBeInTheDocument();

    act(() => {
      localStorage.setItem('cyber_progress', JSON.stringify(['guide-1', 'guide-2', 'guide-3', 'guide-4']));
      window.dispatchEvent(new Event('cyber_progress_updated'));
    });

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('safely handles 0 total articles', () => {
    render(<GlobalProgress totalArticles={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
