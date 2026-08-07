import React, { useState, useEffect } from 'react';

interface RoadmapProgressBarProps {
  totalModules: number;
  articleIds: string[];
}

export default function RoadmapProgressBar({ totalModules, articleIds }: RoadmapProgressBarProps) {
  const [completedCount, setCompletedCount] = useState(0);

  const calculateProgress = () => {
    const completedArticles = JSON.parse(localStorage.getItem('cyber_progress') || '[]');
    // Find how many of the completed articles belong to this specific roadmap
    const matches = completedArticles.filter((id: string) => articleIds.includes(id));
    setCompletedCount(matches.length);
  };

  useEffect(() => {
    // Initial calculation on mount
    calculateProgress();

    // Listen for custom events dispatched when a user clicks the "Mark Complete" button on an article page
    window.addEventListener('cyber_progress_updated', calculateProgress);
    
    // Listen for storage changes across tabs
    window.addEventListener('storage', calculateProgress);
    
    return () => {
      window.removeEventListener('cyber_progress_updated', calculateProgress);
      window.removeEventListener('storage', calculateProgress);
    };
  }, [articleIds]);

  const percentage = Math.round((completedCount / totalModules) * 100) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Your Progress</h3>
          <p className="text-slate-500 text-sm">
            You have completed {completedCount} of {totalModules} modules.
          </p>
        </div>
        <span className="text-2xl font-black text-indigo-600">{percentage}%</span>
      </div>
      
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-700 ease-out rounded-full" 
          style={{ width: `${percentage}%` }}
          data-testid="progress-fill"
        ></div>
      </div>
    </div>
  );
}
