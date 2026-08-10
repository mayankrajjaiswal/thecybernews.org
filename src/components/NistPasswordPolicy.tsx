import React, { useState } from 'react';

export default function NistPasswordPolicy() {
  const [formData, setFormData] = useState({
    companyName: '',
    minLen: 12,
    allowPasswordManagers: true,
    requireMFA: true,
    enforceDictionaryCheck: true,
    itContact: 'IT Support'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generatePolicy = () => {
    const { companyName, minLen, allowPasswordManagers, requireMFA, enforceDictionaryCheck, itContact } = formData;
    const date = new Date().toLocaleDateString();
    const company = companyName || '[Company Name]';

    return `
# ${company} - NIST-Compliant Password Policy
**Effective Date:** ${date}

## 1. Purpose
The purpose of this policy is to establish a secure, modern, and user-friendly standard for creating and managing passwords at ${company}, in accordance with the latest guidelines from the National Institute of Standards and Technology (NIST SP 800-63B).

## 2. Password Requirements (The "Passphrase" Rule)
We emphasize length over complexity. Employees must use "passphrases" (multiple words strung together) rather than short, complex passwords that are hard to remember.
* **Minimum Length:** Passwords must be at least ${minLen} characters long.
* **Maximum Length:** Passwords can be up to 64 characters long to support passphrases.
* **Complexity:** We DO NOT force arbitrary complexity rules (e.g., you do not *have* to include a special character or a number, though you may if you wish).

## 3. Password Expiration (No 90-Day Rotations)
* **No Forced Expiration:** In alignment with NIST guidelines, ${company} no longer requires employees to arbitrarily change their passwords every 30, 60, or 90 days. 
* **Exception:** Passwords will only be forcibly reset if there is evidence or suspicion of a compromise (e.g., if a data breach occurs or a laptop is stolen).

## 4. Multi-Factor Authentication (MFA)
${requireMFA ? '* **Strictly Required:** Multi-Factor Authentication (MFA) is mandatory for all accounts accessing company data. An authenticator app or hardware security key is highly preferred over SMS-based codes.' : '* **Recommended:** Multi-Factor Authentication (MFA) is highly recommended for all accounts.'}

## 5. Banned Passwords
${enforceDictionaryCheck ? '* **Dictionary Checks:** The IT department will actively screen new passwords against a "breached password dictionary." If you attempt to use a password that has been previously compromised on the internet (e.g., "password123"), the system will reject it.' : '* **Common Sense:** Do not use easily guessable passwords like "password123", your pet\'s name, or the name of the company.'}

## 6. Password Managers
${allowPasswordManagers ? `* **Approved Use:** We recognize that humans cannot memorize dozens of unique ${minLen}-character passphrases. Employees are highly encouraged to use the company-approved Password Manager to generate and store their credentials.` : '* **Not Approved:** The use of third-party password managers is currently not supported. Please memorize your passphrases.'}
* **Never** store passwords in unencrypted Word documents, Excel spreadsheets, or on sticky notes attached to monitors.

## 7. Reporting Compromise
If you believe your password has been phished, guessed, or stolen, you must reset it immediately and contact **${itContact || 'IT Support'}**.
    `.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePolicy());
    alert('Policy copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" data-testid="nist-policy-generator">
      
      {/* Form Sidebar */}
      <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col h-[700px] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Policy Settings
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
            <input 
              type="text" 
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">IT Contact Person</label>
            <input 
              type="text" 
              name="itContact"
              value={formData.itContact}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. IT Department"
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">NIST Configuration</h3>
            
            <div className="mb-4">
              <label className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                <span>Minimum Length</span>
                <span className="text-indigo-600">{formData.minLen} chars</span>
              </label>
              <input 
                type="range" 
                name="minLen"
                min="8" max="24" step="1"
                value={formData.minLen}
                onChange={handleInputChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-slate-500 mt-1">NIST recommends at least 8, but 12-15 is preferred for passphrases.</p>
            </div>
            
            <label className="flex items-start gap-3 mb-4 cursor-pointer">
              <input type="checkbox" name="requireMFA" checked={formData.requireMFA} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="nist-mfa" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">Require MFA</span>
                <span className="text-xs text-slate-500 block">Makes MFA mandatory for all internal apps.</span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 mb-4 cursor-pointer">
              <input type="checkbox" name="allowPasswordManagers" checked={formData.allowPasswordManagers} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="nist-pwm" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">Approve Password Managers</span>
                <span className="text-xs text-slate-500 block">Encourages staff to use tools like Bitwarden or 1Password.</span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 mb-4 cursor-pointer">
              <input type="checkbox" name="enforceDictionaryCheck" checked={formData.enforceDictionaryCheck} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="nist-dict" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">Block Breached Passwords</span>
                <span className="text-xs text-slate-500 block">Requires your IT system to screen new passwords against a breached list.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full md:w-2/3 p-6 md:p-8 bg-white flex flex-col h-[700px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Generated Policy Preview</h2>
          <button 
            onClick={copyToClipboard}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold py-1.5 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Copy to Clipboard
          </button>
        </div>
        
        <div className="flex-grow bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto font-mono text-sm text-slate-800 whitespace-pre-wrap" data-testid="nist-policy-preview">
          {generatePolicy()}
        </div>
      </div>

    </div>
  );
}
