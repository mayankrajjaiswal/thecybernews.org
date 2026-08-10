import React, { useState } from 'react';

const SCENARIOS = [
  {
    id: 'link',
    label: 'I clicked a suspicious link in an email/text',
    steps: [
      'Disconnect from the Internet: Turn off Wi-Fi and unplug any network cables immediately to prevent malware from communicating with the hacker.',
      'Do NOT enter any passwords: If the link opened a webpage asking for a login, close it immediately.',
      'Run a full Antivirus Scan: Use Windows Defender, Malwarebytes, or another trusted scanner to check your system.',
      'Monitor your accounts: If you are worried, keep a close eye on your bank statements and email login history for the next few days.'
    ]
  },
  {
    id: 'password',
    label: 'I typed my password into a fake website',
    steps: [
      'Change the password immediately: Go directly to the REAL website (type the address manually into your browser) and change your password.',
      'Change reused passwords: If you use that exact same password on any other website, you must change it there too.',
      'Enable Multi-Factor Authentication (MFA): Turn on 2FA for the affected account to stop the hacker from logging in, even if they have your password.',
      'Check account recovery settings: Hackers often change your backup email or phone number. Verify they still belong to you.'
    ]
  },
  {
    id: 'social',
    label: 'My social media (Facebook/Insta) was hacked',
    steps: [
      'Use the platform\'s recovery tool: Go to the login page and click "Forgot Password" or search for "Facebook hacked account recovery" to use their official automated tools.',
      'Warn your friends and family: Hackers will use your account to send scam links to your contacts. Have a friend post that you were hacked.',
      'Check for connected apps: Once you regain access, go to Settings > Apps and revoke access to any third-party apps you don\'t recognize.',
      'Enable 2FA immediately: Once recovered, turn on Multi-Factor Authentication so it doesn\'t happen again.'
    ]
  },
  {
    id: 'virus',
    label: 'I think my computer has a virus (Pop-ups, slow, frozen)',
    steps: [
      'Disconnect from the Internet: This stops the virus from sending your data to the hacker or downloading more malware.',
      'Enter Safe Mode: Restart your computer and boot into "Safe Mode" (which prevents most viruses from running).',
      'Run an Offline Antivirus Scan: Run a full system scan using Windows Defender Offline or a similar trusted tool.',
      'Back up important files: If you can, copy your essential documents to an external USB drive (but do not copy programs/apps, as they might be infected).'
    ]
  },
  {
    id: 'money',
    label: 'I sent money or gift cards to a scammer',
    steps: [
      'Contact your bank immediately: Call the fraud department at your bank using the phone number on the back of your debit/credit card. They might be able to freeze the transaction.',
      'Report Gift Cards: If you paid via Apple, Google, or Amazon gift cards, call their official support lines immediately. If the scammer hasn\'t spent it yet, they can freeze the card.',
      'Freeze your credit: Contact Equifax, Experian, and TransUnion to freeze your credit so scammers cannot open new accounts in your name.',
      'File a police report: File a report with local law enforcement and the FBI\'s IC3 (ic3.gov). You will need this report to dispute charges with your bank.'
    ]
  }
];

export default function EmergencyWizard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedScenario = SCENARIOS.find(s => s.id === selectedId);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="emergency-wizard">
      <div className="bg-red-600 p-6 md:p-8 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-2 uppercase tracking-wide">Emergency Action Plan</h2>
        <p className="text-red-100 text-lg">Don't panic. Select what happened below to get immediate, step-by-step instructions.</p>
      </div>

      <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCENARIOS.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => setSelectedId(scenario.id)}
              className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${
                selectedId === scenario.id 
                  ? 'border-red-500 bg-red-50 text-red-900 shadow-md' 
                  : 'border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:bg-slate-50'
              }`}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {selectedScenario ? (
        <div className="p-6 md:p-8 bg-white" data-testid="wizard-results">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-red-100 text-red-600 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            Steps to take right now:
          </h3>
          
          <div className="space-y-6">
            {selectedScenario.steps.map((step, idx) => {
              const [boldPart, rest] = step.split(': ');
              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-900 text-white font-bold rounded-full flex items-center justify-center text-lg">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-slate-800 text-lg leading-relaxed">
                      <strong>{boldPart}:</strong> {rest}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            <strong>Important:</strong> If you use a computer provided by your employer or school, stop and call your IT Helpdesk immediately. Do not attempt to fix it yourself, as they have specific procedures to follow.
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <p className="text-lg font-medium">Select a situation above to view your action plan.</p>
        </div>
      )}
    </div>
  );
}
