import React, { useState, useEffect } from 'react';

interface GlobalProgressProps {
  totalArticles: number;
}

export default function GlobalProgress({ totalArticles }: GlobalProgressProps) {
  const [completedCount, setCompletedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const calculateProgress = () => {
    const completedArticles = JSON.parse(localStorage.getItem('cyber_progress') || '[]');
    setCompletedCount(completedArticles.length);
  };

  useEffect(() => {
    setMounted(true);
    calculateProgress();

    window.addEventListener('cyber_progress_updated', calculateProgress);
    window.addEventListener('storage', calculateProgress);
    
    return () => {
      window.removeEventListener('cyber_progress_updated', calculateProgress);
      window.removeEventListener('storage', calculateProgress);
    };
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch on Astro

  const percentage = totalArticles > 0 ? Math.round((completedCount / totalArticles) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl shadow-lg p-6 md:p-8 mb-12 text-white overflow-hidden relative">
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-extrabold mb-1">Your Cyber Academy Progress</h3>
            <p className="text-blue-200">
              You have completed <span className="font-bold text-white">{completedCount}</span> out of {totalArticles} total guides.
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black">{percentage}%</span>
            <span className="text-blue-300 ml-1 font-medium">Mastery</span>
          </div>
        </div>
        
        <div className="w-full h-4 bg-blue-950/50 rounded-full overflow-hidden border border-blue-800/50">
          <div 
            className="h-full bg-emerald-400 transition-all duration-1000 ease-out rounded-full relative" 
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        {percentage === 0 && (
          <p className="text-sm text-blue-300 mt-4 italic">
            Tip: Scroll to the bottom of any guide and click "Mark Complete" to start earning your progress!
          </p>
        )}
        {percentage > 0 && percentage < 100 && (
          <p className="text-sm text-emerald-300 mt-4 font-medium">
            Great job! Keep going to reach 100% mastery.
          </p>
        )}
      </div>
    </div>
  );
}
