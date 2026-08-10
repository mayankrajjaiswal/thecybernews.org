import React, { useState, useEffect } from 'react';

interface BookmarkButtonProps {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: string;
}

export default function BookmarkButton({ id, title, description, url, category }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('cyber_saved_items') || '[]');
    setIsSaved(savedItems.some((item: any) => item.id === id));
  }, [id]);

  const toggleBookmark = () => {
    let savedItems = JSON.parse(localStorage.getItem('cyber_saved_items') || '[]');
    
    if (isSaved) {
      savedItems = savedItems.filter((item: any) => item.id !== id);
    } else {
      savedItems.push({ id, title, description, url, category, dateAdded: new Date().toISOString() });
    }
    
    localStorage.setItem('cyber_saved_items', JSON.stringify(savedItems));
    setIsSaved(!isSaved);
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${
        isSaved 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
      aria-label={isSaved ? "Remove bookmark" : "Save this page"}
      data-testid="bookmark-button"
    >
      <svg 
        className={`w-5 h-5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : 'fill-none text-slate-400'}`} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {isSaved ? 'Saved to My Guides' : 'Save for Later'}
    </button>
  );
}
