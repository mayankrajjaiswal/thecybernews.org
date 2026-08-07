import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import AcademyDashboard from './AcademyDashboard';
import React from 'react';

describe('AcademyDashboard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly with 0 progress', () => {
    render(<AcademyDashboard />);
    expect(screen.getByText('Your Achievements')).toBeInTheDocument();
    
    // 0 Guides Completed, 0 Badges, 0 Certificates
    const zeroes = screen.getAllByText('0');
    expect(zeroes.length).toBeGreaterThanOrEqual(3);
    
    // Check for the Cyber Defender badge in an unearned state
    expect(screen.getByText('Cyber Defender')).toBeInTheDocument();
    const percents = screen.getAllByText('0%');
    expect(percents.length).toBeGreaterThanOrEqual(1);
  });

  it('calculates progress and awards badges based on local storage', () => {
    // These 3 guides unlock the 'Cyber Defender' badge
    localStorage.setItem('cyber_progress', JSON.stringify(['passwords', 'mfa', 'phishing-basics']));
    
    render(<AcademyDashboard />);
    
    // 3 Guides Completed
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // 1 Badge Earned
    expect(screen.getByText('1')).toBeInTheDocument();

    // The Cyber Defender badge should be marked as Unlocked
    expect(screen.getByText('Unlocked')).toBeInTheDocument();
  });

  it('updates instantly when the custom event is fired', () => {
    render(<AcademyDashboard />);
    
    expect(screen.queryByText('Unlocked')).not.toBeInTheDocument();

    act(() => {
      localStorage.setItem('cyber_progress', JSON.stringify(['passwords', 'mfa', 'phishing-basics']));
      window.dispatchEvent(new Event('cyber_progress_updated'));
    });

    expect(screen.getByText('Unlocked')).toBeInTheDocument();
  });

  it('shows certificate download when 10 guides are completed', () => {
    const tenGuides = ['1','2','3','4','5','6','7','8','9','10'];
    localStorage.setItem('cyber_progress', JSON.stringify(tenGuides));
    
    render(<AcademyDashboard />);
    
    expect(screen.getByText('Download Certificate (PDF)')).toBeInTheDocument();
  });
});
