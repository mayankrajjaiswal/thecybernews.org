import React, { useState, useEffect } from 'react';

const BUREAUS = [
  {
    id: 'equifax',
    name: 'Equifax',
    url: 'https://www.equifax.com/personal/credit-report-services/credit-freeze/',
    phone: '800-349-9960',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'experian',
    name: 'Experian',
    url: 'https://www.experian.com/freeze/center.html',
    phone: '888-397-3742',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'transunion',
    name: 'TransUnion',
    url: 'https://www.transunion.com/credit-freeze',
    phone: '888-909-8872',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'innovis',
    name: 'Innovis',
    url: 'https://www.innovis.com/securityFreeze/index',
    phone: '800-540-2505',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    note: '(Optional but recommended 4th Bureau)'
  }
];

export default function CreditFreezeTracker() {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cyber_credit_freeze') || '{}');
    setStatuses(saved);
    setIsLoaded(true);
  }, []);

  const toggleStatus = (id: string) => {
    const updated = { ...statuses, [id]: !statuses[id] };
    setStatuses(updated);
    localStorage.setItem('cyber_credit_freeze', JSON.stringify(updated));
  };

  const frozenCount = Object.values(statuses).filter(Boolean).length;
  const isFullyFrozen = frozenCount >= 3; // Innovis is optional

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Loading tracker...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="freeze-tracker">
      
      <div className={`p-6 md:p-8 text-white transition-colors duration-500 ${isFullyFrozen ? 'bg-emerald-600' : 'bg-slate-900'}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullyFrozen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
              )}
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Credit Freeze Dashboard</h2>
            <p className="text-white/80 text-sm">
              {isFullyFrozen ? 'Excellent. Your credit is locked down across the major bureaus.' : 'Your credit file is exposed. Scammers can open accounts in your name.'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-slate-50">
        <p className="text-slate-600 mb-6 text-lg">
          To truly protect yourself from identity theft, you must freeze your credit at <strong>ALL THREE</strong> major bureaus individually. Use this tracker to mark them off as you complete them online or over the phone.
        </p>

        <div className="space-y-4">
          {BUREAUS.map(bureau => {
            const isFrozen = statuses[bureau.id] || false;
            
            return (
              <div key={bureau.id} className={`bg-white border-2 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isFrozen ? 'border-emerald-500 shadow-sm' : 'border-slate-200 hover:border-indigo-300'
              }`}>
                
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => toggleStatus(bureau.id)}
                    className={`flex-shrink-0 w-8 h-8 rounded border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isFrozen ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-300 text-transparent hover:bg-slate-100 hover:text-slate-300'
                    }`}
                    aria-label={`Mark ${bureau.name} as Frozen`}
                    data-testid={`toggle-${bureau.id}`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </button>
                  
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      {bureau.name}
                      {isFrozen && <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">Frozen</span>}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Phone: <a href={`tel:${bureau.phone}`} className="text-indigo-600 hover:underline font-mono font-bold">{bureau.phone}</a></p>
                    {bureau.note && <p className="text-slate-400 text-xs italic mt-1">{bureau.note}</p>}
                  </div>
                </div>

                <div className="flex-shrink-0 ml-12 md:ml-0">
                  <a 
                    href={bureau.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-lg text-sm transition-colors"
                  >
                    Go to official website
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
