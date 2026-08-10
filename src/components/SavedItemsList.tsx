import React, { useState, useEffect } from 'react';

export default function SavedItemsList() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cyber_saved_items') || '[]');
    setItems(saved);
    setIsLoaded(true);
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('cyber_saved_items', JSON.stringify(updated));
  };

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Loading saved items...</div>;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center" data-testid="empty-saved-list">
        <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">You haven't saved anything yet</h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          As you read guides, dictionary terms, and scam alerts across the site, click the "Save for Later" button to build your personal reading list right here.
        </p>
        <a href="/learn" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Browse Learning Guides
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="saved-items-list">
      <ul className="divide-y divide-slate-100">
        {items.map(item => (
          <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
            <div className="flex-grow">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block">
                {item.category}
              </span>
              <a href={item.url} className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                {item.title}
              </a>
              {item.description && (
                <p className="text-slate-600 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
            <div className="flex-shrink-0 flex items-center gap-3 sm:flex-col sm:items-end">
              <a href={item.url} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors text-sm">
                Read Now
              </a>
              <button 
                onClick={() => removeItem(item.id)}
                className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors"
                aria-label={`Remove ${item.title} from saved`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
