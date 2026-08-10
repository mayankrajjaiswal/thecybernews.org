import React, { useState } from 'react';

const SCENARIOS = [
  {
    id: 1,
    appName: 'Super Free Flashlight',
    icon: '🔦',
    category: 'Utilities',
    permissions: [
      { id: 'camera', label: 'Camera & Flash', requested: true, isMalicious: false, reason: 'A flashlight app needs access to your camera hardware to turn on the LED flash.' },
      { id: 'contacts', label: 'Contacts', requested: true, isMalicious: true, reason: 'Why does a flashlight need to know who your friends are? It is harvesting your data to sell it.' },
      { id: 'location', label: 'Location (GPS)', requested: true, isMalicious: true, reason: 'A flashlight does not need to know where you are in the world.' }
    ]
  },
  {
    id: 2,
    appName: 'City Weather Radar',
    icon: '🌤️',
    category: 'Weather',
    permissions: [
      { id: 'location', label: 'Location (GPS)', requested: true, isMalicious: false, reason: 'A weather app needs your location to give you accurate local forecasts.' },
      { id: 'microphone', label: 'Microphone', requested: true, isMalicious: true, reason: 'A weather app has no reason to listen to your microphone. It might be recording you for targeted ads.' },
      { id: 'storage', label: 'Photos & Files', requested: false, isMalicious: false, reason: '' }
    ]
  },
  {
    id: 3,
    appName: 'Fun Photo Filters',
    icon: '📸',
    category: 'Photography',
    permissions: [
      { id: 'camera', label: 'Camera', requested: true, isMalicious: false, reason: 'A photo filter app needs your camera to take pictures.' },
      { id: 'storage', label: 'Photos & Files', requested: true, isMalicious: false, reason: 'It needs access to your photo gallery so you can edit existing pictures and save new ones.' },
      { id: 'sms', label: 'SMS / Text Messages', requested: true, isMalicious: true, reason: 'A photo app should not be able to read your private text messages or intercept your bank\'s 2FA codes.' }
    ]
  }
];

export default function AppPermissionsSandbox() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, 'allow' | 'deny'>>({});
  const [showResults, setShowResults] = useState(false);

  const scenario = SCENARIOS[currentScenario];
  const requestedPermissions = scenario.permissions.filter(p => p.requested);

  const handleDecision = (permId: string, decision: 'allow' | 'deny') => {
    setDecisions({ ...decisions, [permId]: decision });
  };

  const checkResults = () => {
    setShowResults(true);
  };

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setDecisions({});
      setShowResults(false);
    } else {
      setCurrentScenario(0);
      setDecisions({});
      setShowResults(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    requestedPermissions.forEach(p => {
      const decision = decisions[p.id];
      if ((p.isMalicious && decision === 'deny') || (!p.isMalicious && decision === 'allow')) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 rounded-[3rem] p-4 shadow-xl border-[8px] border-slate-800" data-testid="app-sandbox">
      {/* Phone Screen */}
      <div className="bg-white rounded-[2rem] overflow-hidden min-h-[600px] flex flex-col relative">
        
        {/* Phone Header (Fake) */}
        <div className="bg-slate-100 px-6 py-2 flex justify-between items-center text-xs font-bold text-slate-500">
          <span>9:41 AM</span>
          <div className="flex gap-2">
            <span>LTE</span>
            <span>100%</span>
          </div>
        </div>

        {!showResults ? (
          <div className="flex-grow p-6 flex flex-col">
            <div className="text-center mb-8 mt-4">
              <div className="text-6xl mb-2">{scenario.icon}</div>
              <h2 className="text-2xl font-extrabold text-slate-900">{scenario.appName}</h2>
              <p className="text-slate-500 font-medium text-sm">{scenario.category}</p>
            </div>

            <p className="text-center text-slate-700 font-bold mb-6">
              This app is asking for the following permissions. Decide if they are safe or suspicious.
            </p>

            <div className="space-y-4 flex-grow">
              {requestedPermissions.map(perm => (
                <div key={perm.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Allow access to {perm.label}?
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDecision(perm.id, 'deny')}
                      data-testid={`deny-${perm.id}`}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                        decisions[perm.id] === 'deny' 
                          ? 'bg-red-500 text-white shadow-inner' 
                          : 'bg-white border-2 border-red-100 text-red-500 hover:bg-red-50'
                      }`}
                    >
                      Deny
                    </button>
                    <button 
                      onClick={() => handleDecision(perm.id, 'allow')}
                      data-testid={`allow-${perm.id}`}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
                        decisions[perm.id] === 'allow' 
                          ? 'bg-emerald-500 text-white shadow-inner' 
                          : 'bg-white border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      Allow
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={checkResults}
              disabled={Object.keys(decisions).length !== requestedPermissions.length}
              className={`w-full py-4 rounded-xl font-bold text-lg mt-6 transition-colors ${
                Object.keys(decisions).length === requestedPermissions.length
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirm Choices
            </button>
          </div>
        ) : (
          <div className="flex-grow p-6 flex flex-col bg-slate-50 overflow-y-auto" data-testid="sandbox-results">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm border border-slate-200 mb-4">
                <span className="text-2xl font-black text-slate-900">{calculateScore()}/{requestedPermissions.length}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Security Check</h3>
            </div>

            <div className="space-y-4 flex-grow">
              {requestedPermissions.map(perm => {
                const userChoice = decisions[perm.id];
                const isCorrect = (perm.isMalicious && userChoice === 'deny') || (!perm.isMalicious && userChoice === 'allow');
                
                return (
                  <div key={perm.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <span className="text-emerald-600 font-bold flex items-center text-sm uppercase tracking-wide">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          Correct
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold flex items-center text-sm uppercase tracking-wide">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                          Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-slate-800 font-bold mb-1">Access to {perm.label}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{perm.reason}</p>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={nextScenario}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg mt-6 hover:bg-slate-800 transition-colors"
            >
              {currentScenario < SCENARIOS.length - 1 ? 'Next App Scenario' : 'Start Over'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
