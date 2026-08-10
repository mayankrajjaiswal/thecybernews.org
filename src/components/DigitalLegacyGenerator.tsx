import React, { useState } from 'react';

export default function DigitalLegacyGenerator() {
  const [formData, setFormData] = useState({
    userName: '',
    executorName: '',
    phonePasscode: '', // We don't ask for the actual passcode, just the location or a hint
    phonePasscodeLocation: 'Written in my physical safe',
    masterPasswordLocation: 'In the red folder in my filing cabinet',
    mfaDeviceLocation: 'My primary cell phone',
    hasAppleLegacy: false,
    hasGoogleLegacy: false,
    hasCrypto: false,
    cryptoInstructions: 'Seed phrase is in the safety deposit box.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePlan = () => {
    const user = formData.userName || '[Your Name]';
    const executor = formData.executorName || '[Executor/Spouse Name]';

    return `
# Digital Estate & Legacy Plan
**For:** ${user}
**Designated Executor:** ${executor}
**Date Created:** ${new Date().toLocaleDateString()}

**IMPORTANT:** This document contains instructions on how to access my digital life in the event of my death or incapacitation. Please keep this document in a secure, physical location alongside my traditional will.

## 1. Primary Device Access
To access my email, passwords, and 2FA codes, you will first need access to my primary smartphone or computer.
* **Phone/Computer Passcode Location:** ${formData.phonePasscodeLocation}

## 2. Master Password (The Keys to the Kingdom)
I use a Password Manager to securely store all my online accounts (banking, social media, utilities). You only need ONE password to access everything.
* **Master Password Location:** ${formData.masterPasswordLocation}
* **Multi-Factor Authentication (MFA):** My password manager requires a second step to log in. The device or method used for this is located here: ${formData.mfaDeviceLocation}

## 3. Tech Giant Legacy Contacts
${formData.hasAppleLegacy ? '* **Apple ID:** I have officially designated you as my "Legacy Contact" in my Apple settings. You can request access to my photos, notes, and mail via Apple Support by providing my death certificate and the access key I shared with you.' : '* **Apple ID:** I have not set up an official Apple Legacy Contact. You will need my device passcode (Section 1) to access my Apple data.'}
${formData.hasGoogleLegacy ? '* **Google (Gmail/Drive):** I have set up Google\'s "Inactive Account Manager". If I do not log in for a specified period, Google will automatically email you with instructions to download my data.' : '* **Google (Gmail/Drive):** I have not set up Google Inactive Account Manager. You will need to log into my password manager (Section 2) to access my Gmail.'}

${formData.hasCrypto ? `## 4. Cryptocurrency Assets\nI hold digital assets (Bitcoin, Ethereum, etc.) that are secured by cryptographic keys. If these keys are lost, the money is gone forever.\n* **Access Instructions:** ${formData.cryptoInstructions}` : ''}

## 5. Next Steps for the Executor
1. Locate my primary phone and keep it charged. It will be required to intercept SMS verification codes.
2. Locate the Master Password as described in Section 2.
3. Log into my Password Manager to find the credentials for my banking, email, and social media.
4. Contact my financial institutions and social media platforms to begin the formal memorialization or account closure process.
    `.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePlan());
    alert('Plan copied to clipboard! Paste it into Word/Google Docs, print it, and store it securely.');
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" data-testid="legacy-generator">
      
      {/* Form Sidebar */}
      <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col h-[800px] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Digital Plan Details
        </h2>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-6 rounded-r">
          <p className="text-xs text-yellow-800 font-bold">SECURITY WARNING:</p>
          <p className="text-xs text-yellow-800 mt-1">Never type your actual passwords into this tool (or any online tool). Only describe <em>where</em> they can be physically found.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
            <input 
              type="text" 
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Executor / Trusted Person</label>
            <input 
              type="text" 
              name="executorName"
              value={formData.executorName}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Jane Doe (Wife)"
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Where are the keys?</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone/Computer Passcode Hint</label>
              <input 
                type="text" 
                name="phonePasscodeLocation"
                value={formData.phonePasscodeLocation}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Password Manager Master Password</label>
              <input 
                type="text" 
                name="masterPasswordLocation"
                value={formData.masterPasswordLocation}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">MFA / 2FA Device</label>
              <input 
                type="text" 
                name="mfaDeviceLocation"
                value={formData.mfaDeviceLocation}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Official Legacy Features</h3>
            
            <label className="flex items-start gap-3 mb-3 cursor-pointer">
              <input type="checkbox" name="hasAppleLegacy" checked={formData.hasAppleLegacy} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="check-apple" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">Apple Legacy Contact</span>
                <span className="text-xs text-slate-500 block">I have set this up on my iPhone/Mac.</span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 mb-3 cursor-pointer">
              <input type="checkbox" name="hasGoogleLegacy" checked={formData.hasGoogleLegacy} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="check-google" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">Google Inactive Account Manager</span>
                <span className="text-xs text-slate-500 block">I have set this up in my Google Account.</span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200">
             <label className="flex items-start gap-3 mb-3 cursor-pointer">
              <input type="checkbox" name="hasCrypto" checked={formData.hasCrypto} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="check-crypto" />
              <span className="text-sm font-bold text-slate-700 block">I own Cryptocurrency</span>
            </label>
            
            {formData.hasCrypto && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-1">Where is the Seed Phrase / Wallet?</label>
                <input 
                  type="text" 
                  name="cryptoInstructions"
                  value={formData.cryptoInstructions}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full md:w-2/3 p-6 md:p-8 bg-white flex flex-col h-[800px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Digital Will Preview</h2>
          <button 
            onClick={copyToClipboard}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold py-1.5 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Copy to Clipboard
          </button>
        </div>
        
        <div className="flex-grow bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto font-serif text-sm md:text-base text-slate-800 whitespace-pre-wrap leading-relaxed" data-testid="legacy-preview">
          {generatePlan()}
        </div>
      </div>

    </div>
  );
}
