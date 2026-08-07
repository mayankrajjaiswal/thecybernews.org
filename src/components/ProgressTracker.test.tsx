import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ProgressTracker from './ProgressTracker';
import RoadmapProgressBar from './RoadmapProgressBar';
import React from 'react';

describe('Learning Progress Components', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('ProgressTracker', () => {
    it('renders in uncompleted state initially', () => {
      render(<ProgressTracker articleId="test-guide" />);
      expect(screen.getByText('Mark Complete')).toBeInTheDocument();
    });

    it('toggles complete state and updates local storage', () => {
      render(<ProgressTracker articleId="test-guide" />);
      
      const btn = screen.getByTestId('progress-btn');
      fireEvent.click(btn);
      
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(localStorage.getItem('cyber_progress')).toContain('test-guide');
      
      // Toggle off
      fireEvent.click(btn);
      expect(screen.getByText('Mark Complete')).toBeInTheDocument();
      expect(localStorage.getItem('cyber_progress')).not.toContain('test-guide');
    });

    it('reads initial state from local storage', () => {
      localStorage.setItem('cyber_progress', JSON.stringify(['existing-guide']));
      render(<ProgressTracker articleId="existing-guide" />);
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  describe('RoadmapProgressBar', () => {
    it('calculates 0% progress initially', () => {
      render(<RoadmapProgressBar totalModules={2} articleIds={['guide-1', 'guide-2']} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('You have completed 0 of 2 modules.')).toBeInTheDocument();
    });

    it('calculates 50% progress based on local storage', () => {
      localStorage.setItem('cyber_progress', JSON.stringify(['guide-1']));
      render(<RoadmapProgressBar totalModules={2} articleIds={['guide-1', 'guide-2']} />);
      
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('You have completed 1 of 2 modules.')).toBeInTheDocument();
      expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '50%' });
    });

    it('listens for custom update events', () => {
      render(<RoadmapProgressBar totalModules={2} articleIds={['guide-1', 'guide-2']} />);
      expect(screen.getByText('0%')).toBeInTheDocument();

      // Simulate a user clicking "Mark Complete" on an article page
      localStorage.setItem('cyber_progress', JSON.stringify(['guide-1', 'guide-2']));
      act(() => {
        window.dispatchEvent(new Event('cyber_progress_updated'));
      });

      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('You have completed 2 of 2 modules.')).toBeInTheDocument();
    });
  });
});
