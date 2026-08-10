import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PrivacyWizard from './PrivacyWizard';

describe('PrivacyWizard', () => {
  it('renders initial state correctly', () => {
    render(<PrivacyWizard />);
    
    expect(screen.getByTestId('privacy-wizard')).toBeInTheDocument();
    expect(screen.getByText('Which app do you want to lock down?')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('TikTok')).toBeInTheDocument();
    expect(screen.getByText('Select a platform above to view the lockdown checklist.')).toBeInTheDocument();
  });

  it('displays the correct checklist when a platform is clicked', () => {
    render(<PrivacyWizard />);
    
    // Click Facebook
    fireEvent.click(screen.getByText('Facebook'));
    
    expect(screen.getByTestId('wizard-checklist')).toBeInTheDocument();
    expect(screen.getByText('Facebook Privacy Checklist')).toBeInTheDocument();
    expect(screen.getByText('Hide your profile from search engines')).toBeInTheDocument();
    
    // Click TikTok
    fireEvent.click(screen.getByText('TikTok'));
    
    expect(screen.getByText('TikTok Privacy Checklist')).toBeInTheDocument();
    expect(screen.getByText('Stop suggesting your account to others')).toBeInTheDocument();
    
    // Verify Facebook is gone
    expect(screen.queryByText('Hide your profile from search engines')).not.toBeInTheDocument();
  });
});
