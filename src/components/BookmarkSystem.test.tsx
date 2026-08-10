import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import BookmarkButton from './BookmarkButton';
import SavedItemsList from './SavedItemsList';

describe('Local Bookmarking System', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles a bookmark and saves to localStorage', () => {
    render(<BookmarkButton id="test-1" title="Test Title" url="/test" category="Guide" />);
    
    const btn = screen.getByTestId('bookmark-button');
    expect(screen.getByText('Save for Later')).toBeInTheDocument();
    
    // Click to save
    fireEvent.click(btn);
    expect(screen.getByText('Saved to My Guides')).toBeInTheDocument();
    
    const saved = JSON.parse(localStorage.getItem('cyber_saved_items') || '[]');
    expect(saved.length).toBe(1);
    expect(saved[0].id).toBe('test-1');
    
    // Click to unsave
    fireEvent.click(btn);
    expect(screen.getByText('Save for Later')).toBeInTheDocument();
    const savedAfter = JSON.parse(localStorage.getItem('cyber_saved_items') || '[]');
    expect(savedAfter.length).toBe(0);
  });

  it('SavedItemsList shows empty state when no items', () => {
    render(<SavedItemsList />);
    expect(screen.getByTestId('empty-saved-list')).toBeInTheDocument();
    expect(screen.getByText("You haven't saved anything yet")).toBeInTheDocument();
  });

  it('SavedItemsList renders items and allows removal', () => {
    const mockData = [
      { id: '1', title: 'Test 1', category: 'Guide', url: '/1' },
      { id: '2', title: 'Test 2', category: 'Scam', url: '/2' }
    ];
    localStorage.setItem('cyber_saved_items', JSON.stringify(mockData));
    
    render(<SavedItemsList />);
    
    expect(screen.getByTestId('saved-items-list')).toBeInTheDocument();
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    
    // Remove one item
    const removeBtns = screen.getAllByText('Remove');
    fireEvent.click(removeBtns[0]);
    
    expect(screen.queryByText('Test 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    
    const savedAfter = JSON.parse(localStorage.getItem('cyber_saved_items') || '[]');
    expect(savedAfter.length).toBe(1);
  });
});
