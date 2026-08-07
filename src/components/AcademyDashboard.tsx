import React, { useState, useEffect } from 'react';

// Define the requirements for each badge
const badges = [
  {
    id: 'badge-beginner',
    name: 'Cyber Defender',
    description: 'Completed the "Cyber Security for Beginners" roadmap.',
    requiredGuides: ['passwords', 'mfa', 'phishing-basics'],
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    color: 'emerald'
  },
  {
    id: 'badge-family',
    name: 'Family Guardian',
    description: 'Completed the "Home & Family Internet Safety" roadmap.',
    requiredGuides: ['parental-controls', 'gaming-safety', 'cyber-bullying', 'home-wifi'],
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    color: 'purple'
  },
  {
    id: 'badge-business',
    name: 'Enterprise Architect',
    description: 'Completed the "Small Business Security" roadmap.',
    requiredGuides: ['ransomware-defense', 'team-training', 'vpns', 'remote-work'],
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: 'blue'
  }
];

export default function AcademyDashboard() {
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const calculateProgress = () => {
    const progress = JSON.parse(localStorage.getItem('cyber_progress') || '[]');
    setCompletedArticles(progress);
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

  if (!mounted) return null;

  return (
    <div className="space-y-12">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-slate-800 mb-2">{completedArticles.length}</span>
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Guides Completed</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-blue-600 mb-2">
            {badges.filter(b => b.requiredGuides.every(req => completedArticles.includes(req))).length}
          </span>
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Badges Earned</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-emerald-600 mb-2">
            {completedArticles.length >= 10 ? '1' : '0'}
          </span>
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Certificates</span>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map(badge => {
            const isEarned = badge.requiredGuides.every(req => completedArticles.includes(req));
            const progressCount = badge.requiredGuides.filter(req => completedArticles.includes(req)).length;
            const percentage = Math.round((progressCount / badge.requiredGuides.length) * 100);

            return (
              <div 
                key={badge.id} 
                className={`relative bg-white rounded-2xl p-6 border-2 transition-all ${isEarned ? `border-${badge.color}-400 shadow-md` : 'border-slate-200 shadow-sm opacity-75'}`}
                data-testid={badge.id}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isEarned ? `bg-${badge.color}-100 text-${badge.color}-600` : 'bg-slate-100 text-slate-400'}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={badge.icon} />
                  </svg>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${isEarned ? 'text-slate-900' : 'text-slate-600'}`}>{badge.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{badge.description}</p>
                
                {!isEarned ? (
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                      <span>Progress</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-300 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className={`inline-flex items-center text-sm font-bold text-${badge.color}-700 bg-${badge.color}-50 px-3 py-1.5 rounded-lg`}>
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Unlocked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Certificate Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl shadow-lg p-8 md:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <svg className="w-16 h-16 mx-auto text-yellow-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h2 className="text-3xl font-extrabold mb-4">Official Certificate of Completion</h2>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-8">
            Complete at least 10 educational guides across any roadmap to unlock your printable certificate of cybersecurity awareness.
          </p>
          
          {completedArticles.length >= 10 ? (
            <button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg">
              Download Certificate (PDF)
            </button>
          ) : (
            <div>
              <p className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">Progress: {completedArticles.length} / 10 Guides</p>
              <div className="w-full max-w-md mx-auto h-2 bg-indigo-950/50 rounded-full overflow-hidden border border-indigo-800/50">
                <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${(completedArticles.length / 10) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
