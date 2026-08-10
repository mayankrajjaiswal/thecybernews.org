import React, { useState } from 'react';

const PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    color: 'bg-blue-600',
    steps: [
      {
        title: 'Hide your profile from search engines',
        instruction: 'Go to Settings > Privacy > "Do you want search engines outside of Facebook to link to your profile?" and select NO.',
        why: 'This stops your Facebook profile from showing up when someone Googles your name.'
      },
      {
        title: 'Limit who can see your past posts',
        instruction: 'Go to Settings > Privacy > "Limit the audience for posts you\'ve shared" and click "Limit Past Posts".',
        why: 'This retroactively changes all your old public posts to "Friends Only" so strangers can\'t scroll through your history.'
      },
      {
        title: 'Stop targeted ads using your off-Facebook activity',
        instruction: 'Go to Settings > Your Facebook Information > Off-Facebook Activity > "Manage Your Off-Facebook Activity" and clear history. Then turn off future activity.',
        why: 'Facebook tracks what you do on other websites. This disconnects your browsing history from your profile.'
      },
      {
        title: 'Review connected apps',
        instruction: 'Go to Settings > Apps and Websites. Remove any old apps or games you no longer use.',
        why: 'Old apps you signed into years ago might still be quietly pulling your private data.'
      }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z', // Fake IG icon for now
    color: 'bg-pink-600',
    steps: [
      {
        title: 'Make your account private',
        instruction: 'Go to Settings > Privacy > Account Privacy. Toggle "Private Account" ON.',
        why: 'Only people you explicitly approve can see your photos and videos.'
      },
      {
        title: 'Hide your Activity Status',
        instruction: 'Go to Settings > Privacy > Activity Status. Toggle it OFF.',
        why: 'This stops other people from seeing exactly when you were last online or actively using the app.'
      },
      {
        title: 'Stop sharing your location',
        instruction: 'Go to your phone\'s global Settings > Instagram > Location. Change to "Never" or "While Using".',
        why: 'Instagram doesn\'t need to track your location in the background when the app is closed.'
      }
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'M9 4v12a3 3 0 103-3V7a6 6 0 006 6v-4a2 2 0 01-2-2V4h-3v7.5a1 1 0 11-2-1V4z', // Fake TT icon
    color: 'bg-slate-900',
    steps: [
      {
        title: 'Stop suggesting your account to others',
        instruction: 'Go to Profile > Menu > Settings and privacy > Privacy > "Suggest your account to others". Turn all toggles OFF.',
        why: 'This prevents TikTok from automatically recommending your profile to your phone contacts or Facebook friends.'
      },
      {
        title: 'Disable ad personalization',
        instruction: 'Go to Settings and privacy > Ads. Turn OFF "Targeted Ads".',
        why: 'Stops TikTok from using your in-app behavior to serve highly specific advertising.'
      },
      {
        title: 'Limit who can download your videos',
        instruction: 'Go to Settings and privacy > Privacy > Downloads. Toggle OFF.',
        why: 'Prevents strangers from saving your videos directly to their phone camera roll.'
      }
    ]
  }
];

export default function PrivacyWizard() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const activePlatform = PLATFORMS.find(p => p.id === selectedPlatform);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="privacy-wizard">
      
      {/* Platform Selector */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Which app do you want to lock down?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {PLATFORMS.map(platform => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all ${
                selectedPlatform === platform.id 
                  ? `${platform.color} text-white shadow-md transform scale-105` 
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d={platform.icon} />
              </svg>
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Content */}
      <div className="p-6 md:p-8 min-h-[400px]">
        {!activePlatform ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="font-medium text-lg">Select a platform above to view the lockdown checklist.</p>
          </div>
        ) : (
          <div data-testid="wizard-checklist">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${activePlatform.color}`}></span>
                {activePlatform.name} Privacy Checklist
              </h3>
              <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {activePlatform.steps.length} Steps
              </span>
            </div>

            <div className="space-y-6">
              {activePlatform.steps.map((step, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-indigo-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activePlatform.color} text-white font-bold flex items-center justify-center`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h4>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3 font-mono text-sm text-slate-800">
                        {step.instruction}
                      </div>
                      <p className="text-sm text-slate-600 flex items-start gap-2">
                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {step.why}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm font-medium">
              <strong>Note:</strong> Social media apps update their settings menus frequently. If you cannot find a specific toggle, search for the exact phrase in the app's settings search bar.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
