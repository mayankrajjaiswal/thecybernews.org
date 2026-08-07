import React, { useState, useEffect } from 'react';

interface ProgressTrackerProps {
  articleId: string;
}

export default function ProgressTracker({ articleId }: ProgressTrackerProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if this article is in the completed array in local storage
    const completedArticles = JSON.parse(localStorage.getItem('cyber_progress') || '[]');
    if (completedArticles.includes(articleId)) {
      setIsCompleted(true);
    }
  }, [articleId]);

  const toggleProgress = () => {
    const completedArticles = JSON.parse(localStorage.getItem('cyber_progress') || '[]');
    
    if (isCompleted) {
      // Remove from completed
      const updated = completedArticles.filter((id: string) => id !== articleId);
      localStorage.setItem('cyber_progress', JSON.stringify(updated));
      setIsCompleted(false);
    } else {
      // Add to completed
      completedArticles.push(articleId);
      localStorage.setItem('cyber_progress', JSON.stringify(completedArticles));
      setIsCompleted(true);
    }

    // Dispatch a custom event so other components (like global progress bars) can update in real-time
    window.dispatchEvent(new Event('cyber_progress_updated'));
  };

  return (
    <div className="mt-12 py-8 border-t border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 not-prose">
      <div>
        <h4 className="font-bold text-slate-900 text-lg">Track your progress</h4>
        <p className="text-slate-500 text-sm">Mark this guide as complete to update your learning roadmap.</p>
      </div>
      <button
        onClick={toggleProgress}
        className={`flex items-center px-6 py-3 rounded-full font-bold transition-all duration-300 ${
          isCompleted 
            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500 shadow-sm'
            : 'bg-white text-slate-600 border-2 border-slate-300 hover:border-slate-400'
        }`}
        data-testid="progress-btn"
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Completed
          </>
        ) : (
          <>
            <div className="w-5 h-5 mr-2 border-2 border-slate-400 rounded-full"></div>
            Mark Complete
          </>
        )}
      </button>
    </div>
  );
}
