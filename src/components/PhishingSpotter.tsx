import React, { useState } from 'react';

const SCENARIOS = [
  {
    id: 1,
    title: 'The "Urgent" Account Suspension',
    instructions: 'Find and click the 3 red flags in this email.',
    totalFlags: 3,
    email: {
      fromName: 'PayPal Security',
      fromEmail: 'alerts@paypal-update-auth.com', // Flag 1
      subject: 'URGENT: Your account will be suspended in 24 hours!', // Flag 2
      greeting: 'Dear Customer,', // Flag 3
      body: 'We have detected unusual activity on your account. To prevent immediate suspension, please verify your identity immediately.',
      linkText: 'Verify My Account Now',
      linkUrl: 'http://bit.ly/verify-account-8821', // Flag 4 (Wait, let's stick to 3 flags for simplicity: fromEmail, greeting, linkUrl)
    },
    flags: {
      'fromEmail': 'Fake Sender Domain: Legitimate companies use their official domain (e.g., @paypal.com), not variations like "paypal-update-auth.com".',
      'greeting': 'Generic Greeting: Phishing emails often use "Dear Customer" instead of your actual name because they send these in bulk.',
      'linkUrl': 'Suspicious Link: Legitimate banks will not use URL shorteners (like bit.ly) for secure account verification.'
    }
  },
  {
    id: 2,
    title: 'The Fake Invoice',
    instructions: 'Find and click the 3 red flags in this email.',
    totalFlags: 3,
    email: {
      fromName: 'Apple Support',
      fromEmail: 'receipts@apple.com', // Actually, let's make the attachment the flag, and the fromEmail normal to trick them. Wait, spoofing is common. Let's make fromEmail bad.
      subject: 'Your receipt from Apple [Order #W882199]',
      greeting: 'Hi John,',
      body: 'Thank you for your purchase of "Clash of Clans - 14,000 Gems" for $99.99. If you did not authorize this purchase, please download and complete the attached cancellation form.',
      linkText: 'Cancellation_Form.pdf.exe', // Flag 1
    },
    flags: {
      'linkText': 'Dangerous Attachment: The file ends in ".exe" (an executable program) hiding behind ".pdf". This is malware!',
      'body': 'Creates False Urgency: Scammers claim you bought something expensive so you panic and click the link to cancel it.',
      'fromEmail': 'Fake Sender: (Let\'s make the from email bad in the code) -> apple-support@icloud-billing.net'
    }
  }
];

// Adjusting Scenario 2 data to match the flags
SCENARIOS[1].email.fromEmail = 'apple-support@icloud-billing.net';
SCENARIOS[1].flags['fromEmail'] = 'Fake Sender Domain: Real Apple receipts come from apple.com, not random icloud-billing domains.';

export default function PhishingSpotter() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [foundFlags, setFoundFlags] = useState<string[]>([]);
  
  const scenario = SCENARIOS[currentScenario];
  const isComplete = foundFlags.length === scenario.totalFlags;

  const handleFlagClick = (flagId: string) => {
    if (scenario.flags[flagId as keyof typeof scenario.flags] && !foundFlags.includes(flagId)) {
      setFoundFlags([...foundFlags, flagId]);
    }
  };

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setFoundFlags([]);
    } else {
      setCurrentScenario(0);
      setFoundFlags([]);
    }
  };

  const getFlagClass = (flagId: string) => {
    if (foundFlags.includes(flagId)) {
      return 'bg-red-200 text-red-900 outline-2 outline-red-500 outline-dashed cursor-default rounded px-1';
    }
    return 'cursor-pointer hover:bg-slate-100 rounded px-1 transition-colors';
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="phishing-spotter">
      <div className="bg-indigo-900 p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">{scenario.title}</h2>
          <span className="bg-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            Scenario {currentScenario + 1} of {SCENARIOS.length}
          </span>
        </div>
        <p className="text-indigo-200">{scenario.instructions}</p>
        
        <div className="mt-4 flex items-center gap-2">
          <div className="text-sm font-bold uppercase tracking-wider text-indigo-300">Flags Found:</div>
          <div className="flex gap-2">
            {[...Array(scenario.totalFlags)].map((_, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i < foundFlags.length ? 'bg-red-500 text-white' : 'bg-indigo-800 text-indigo-400'}`}>
                {i < foundFlags.length ? '!' : i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-slate-50">
        {/* Mock Email UI */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4 bg-slate-50">
            <div className="mb-2">
              <span className="text-slate-500 font-medium mr-2">From:</span>
              <span className="font-bold text-slate-800">{scenario.email.fromName}</span>{' '}
              <button 
                onClick={() => handleFlagClick('fromEmail')}
                className={`text-sm text-slate-600 ${getFlagClass('fromEmail')}`}
                data-testid="flag-fromEmail"
              >
                &lt;{scenario.email.fromEmail}&gt;
              </button>
            </div>
            <div>
              <span className="text-slate-500 font-medium mr-2">Subject:</span>
              <span className="font-bold text-slate-800">{scenario.email.subject}</span>
            </div>
          </div>
          
          <div className="p-6 text-slate-800 whitespace-pre-wrap font-sans">
            <p className="mb-4">
              {scenario.email.greeting === 'Dear Customer,' ? (
                <button onClick={() => handleFlagClick('greeting')} className={getFlagClass('greeting')} data-testid="flag-greeting">
                  {scenario.email.greeting}
                </button>
              ) : (
                scenario.email.greeting
              )}
            </p>
            <p className="mb-6 leading-relaxed">
              {currentScenario === 1 ? (
                 <button onClick={() => handleFlagClick('body')} className={getFlagClass('body')} data-testid="flag-body">
                   {scenario.email.body}
                 </button>
              ) : (
                scenario.email.body
              )}
            </p>
            
            <div className="mb-4">
              <button 
                onClick={() => handleFlagClick('linkUrl')}
                className={`text-blue-600 underline ${currentScenario === 0 ? getFlagClass('linkUrl') : ''}`}
                data-testid="flag-linkUrl"
              >
                {scenario.email.linkText}
              </button>
              {currentScenario === 1 && (
                <div className="mt-2">
                  <button onClick={() => handleFlagClick('linkText')} className={`inline-flex items-center gap-2 border border-slate-300 p-2 rounded ${getFlagClass('linkText')}`} data-testid="flag-linkText">
                    📎 {scenario.email.linkText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Explanations Section */}
      {foundFlags.length > 0 && (
        <div className="p-6 border-t border-slate-200 bg-white">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Red Flags Identified:</h3>
          <ul className="space-y-3">
            {foundFlags.map(flag => (
              <li key={flag} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                <div className="mt-0.5 text-red-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-slate-700 text-sm">
                  <strong>{scenario.flags[flag as keyof typeof scenario.flags].split(':')[0]}:</strong>
                  {scenario.flags[flag as keyof typeof scenario.flags].split(':')[1]}
                </p>
              </li>
            ))}
          </ul>

          {isComplete && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <h4 className="text-green-800 font-bold text-lg mb-2">Great job! You found all the red flags.</h4>
              <button 
                onClick={nextScenario}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                {currentScenario < SCENARIOS.length - 1 ? 'Try Next Scenario' : 'Start Over'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
