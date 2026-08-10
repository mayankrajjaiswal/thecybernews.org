import React, { useState, useEffect } from 'react';

const BROKERS = [
  {
    id: 'whitepages',
    name: 'Whitepages',
    url: 'https://www.whitepages.com/suppression-requests',
    difficulty: 'Easy',
    time: '2 mins',
    steps: [
      'Search for your name on Whitepages.com',
      'Copy the URL of your specific profile page',
      'Paste the URL into their Opt-Out page',
      'Verify via a phone call (automated)'
    ]
  },
  {
    id: 'spokeo',
    name: 'Spokeo',
    url: 'https://www.spokeo.com/optout',
    difficulty: 'Easy',
    time: '3 mins',
    steps: [
      'Search for yourself on Spokeo',
      'Copy your profile URL',
      'Paste it on the Opt-Out page along with your email',
      'Click the confirmation link sent to your email'
    ]
  },
  {
    id: 'truepeoplesearch',
    name: 'TruePeopleSearch',
    url: 'https://www.truepeoplesearch.com/removal',
    difficulty: 'Medium',
    time: '5 mins',
    steps: [
      'Go to the removal page and accept the terms',
      'Search for your record',
      'Click "Remove This Record" at the bottom of the page',
      'They will send an email; click the link to confirm'
    ]
  },
  {
    id: 'beenverified',
    name: 'BeenVerified',
    url: 'https://www.beenverified.com/app/optout/search',
    difficulty: 'Medium',
    time: '5 mins',
    steps: [
      'Search for your information on their Opt-Out page',
      'Select your record from the list',
      'Submit your email address',
      'Click the verification link in the email they send'
    ]
  },
  {
    id: 'mylife',
    name: 'MyLife',
    url: 'mailto:privacy@mylife.com',
    difficulty: 'Hard',
    time: 'Email required',
    steps: [
      'Find your profile URL on MyLife.com',
      'Draft an email to privacy@mylife.com',
      'Include your name, age, address, and the URL of the profile',
      'Explicitly request that they delete your profile under state privacy laws'
    ]
  }
];

export default function DataBrokerDirectory() {
  const [completedBrokers, setCompletedBrokers] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cyber_optout_progress') || '[]');
    setCompletedBrokers(saved);
    setIsLoaded(true);
  }, []);

  const toggleCompletion = (id: string) => {
    let updated;
    if (completedBrokers.includes(id)) {
      updated = completedBrokers.filter(bId => bId !== id);
    } else {
      updated = [...completedBrokers, id];
    }
    setCompletedBrokers(updated);
    localStorage.setItem('cyber_optout_progress', JSON.stringify(updated));
  };

  const progressPercentage = Math.round((completedBrokers.length / BROKERS.length) * 100);

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Loading progress...</div>;

  const getDifficultyBadge = (difficulty: string) => {
    if (difficulty === 'Easy') return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-emerald-200">Easy</span>;
    if (difficulty === 'Medium') return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-yellow-200">Medium</span>;
    if (difficulty === 'Hard') return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-red-200">Hard</span>;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="broker-directory">
      
      <div className="bg-slate-900 p-6 md:p-8 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          Data Broker Opt-Out Checklist
        </h2>
        <p className="text-slate-300 text-sm">
          Track your progress as you remove your personal information from the internet's biggest people-search databases. Your progress is saved locally on your device.
        </p>
        
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-grow bg-slate-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
              data-testid="progress-bar"
            ></div>
          </div>
          <span className="font-bold text-lg">{progressPercentage}%</span>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-slate-50">
        <div className="space-y-6">
          {BROKERS.map(broker => {
            const isDone = completedBrokers.includes(broker.id);
            return (
              <div 
                key={broker.id} 
                className={`bg-white border-2 rounded-xl p-6 transition-all ${
                  isDone ? 'border-emerald-500 shadow-sm opacity-75' : 'border-slate-200 hover:border-indigo-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleCompletion(broker.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-300 hover:bg-slate-100 text-transparent hover:text-slate-300'
                      }`}
                      aria-label={`Mark ${broker.name} as complete`}
                      data-testid={`toggle-${broker.id}`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                    <h3 className={`text-xl font-bold ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {broker.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {broker.time}
                    </span>
                    {getDifficultyBadge(broker.difficulty)}
                  </div>
                </div>

                <div className={`space-y-4 ${isDone ? 'opacity-50' : ''}`}>
                  <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm md:text-base">
                    {broker.steps.map((step, idx) => (
                      <li key={idx} className="pl-2">{step}</li>
                    ))}
                  </ol>
                  
                  <div className="pt-2">
                    <a 
                      href={broker.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                    >
                      Go to Opt-Out Page
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
