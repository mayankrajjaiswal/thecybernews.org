import React, { useState } from 'react';

export default function PolicyGenerator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    allowPersonalDevices: true,
    requireMFA: true,
    useCloudStorage: true,
    allowPublicWifi: false,
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
    const { companyName, allowPersonalDevices, requireMFA, useCloudStorage, allowPublicWifi, itContact } = formData;
    const date = new Date().toLocaleDateString();
    
    const company = companyName || '[Company Name]';

    return `
# ${company} - Acceptable Use & Security Policy
**Effective Date:** ${date}

## 1. Purpose
The purpose of this policy is to outline the acceptable use of computer equipment, internet access, and data security at ${company}. These rules protect both the employee and the company from cyber threats, data breaches, and legal liability.

## 2. Passwords and Authentication
* All employees must use strong, unique passwords for every company service.
* Passwords must never be written on sticky notes or shared with other employees.
${requireMFA ? '* **Multi-Factor Authentication (MFA) is strictly required** for all company email and software applications.' : '* Multi-Factor Authentication (MFA) is highly recommended for all accounts.'}

## 3. Device Usage
${allowPersonalDevices 
  ? `* **Bring Your Own Device (BYOD):** Employees are permitted to use personal smartphones and laptops for work purposes. However, any personal device accessing company data MUST have a passcode/biometric lock enabled and receive automatic software updates.`
  : `* **Company Devices Only:** Employees must only use company-issued devices for work. Personal devices are strictly prohibited from accessing company data, emails, or internal networks.`}
* Devices must be locked (e.g., Windows Key + L) whenever left unattended.

## 4. Network and Internet Security
${allowPublicWifi 
  ? `* **Public Wi-Fi:** When traveling or working remotely, employees may use public Wi-Fi networks (e.g., coffee shops, airports) **ONLY IF** they are connected to the company VPN.` 
  : `* **Public Wi-Fi:** Employees are **STRICTLY PROHIBITED** from connecting to unsecured public Wi-Fi networks. Please use a cellular hotspot when working remotely.`}

## 5. Data Storage and Handling
${useCloudStorage 
  ? `* All company documents must be stored in the approved cloud storage system (e.g., Google Drive, OneDrive). Do not store official documents locally on your hard drive, personal Dropbox, or USB thumb drives.` 
  : `* Company data must be stored on the internal company server. The use of third-party cloud storage (e.g., Dropbox, Google Drive) is prohibited without explicit authorization.`}
* Customer data and personally identifiable information (PII) must never be sent via unencrypted email.

## 6. Incident Reporting
If you suspect you have clicked a phishing link, lost a device, or believe your password has been compromised, you must report it immediately to **${itContact || 'Management'}**. You will not be punished for reporting an honest mistake. Silence is the only punishable offense.
    `.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePolicy());
    alert('Policy copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" data-testid="policy-generator">
      
      {/* Form Sidebar */}
      <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Policy Details</h2>
        
        <div className="space-y-4 flex-grow">
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
              placeholder="e.g. IT Department or Jane Doe"
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Security Rules</h3>
            
            <label className="flex items-start gap-3 mb-3 cursor-pointer">
              <input type="checkbox" name="requireMFA" checked={formData.requireMFA} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="check-mfa" />
              <span className="text-sm text-slate-700">Require MFA for all accounts</span>
            </label>
            
            <label className="flex items-start gap-3 mb-3 cursor-pointer">
              <input type="checkbox" name="allowPersonalDevices" checked={formData.allowPersonalDevices} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="check-byod" />
              <span className="text-sm text-slate-700">Allow personal devices (BYOD)</span>
            </label>
            
            <label className="flex items-start gap-3 mb-3 cursor-pointer">
              <input type="checkbox" name="useCloudStorage" checked={formData.useCloudStorage} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="check-cloud" />
              <span className="text-sm text-slate-700">Use Cloud Storage (Google Workspace, Office 365)</span>
            </label>
            
            <label className="flex items-start gap-3 mb-3 cursor-pointer">
              <input type="checkbox" name="allowPublicWifi" checked={formData.allowPublicWifi} onChange={handleInputChange} className="mt-1 text-indigo-600 focus:ring-indigo-500" data-testid="check-wifi" />
              <span className="text-sm text-slate-700">Allow VPN use on Public Wi-Fi</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full md:w-2/3 p-6 md:p-8 bg-white flex flex-col h-[600px]">
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
        
        <div className="flex-grow bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto font-mono text-sm text-slate-800 whitespace-pre-wrap" data-testid="policy-preview">
          {generatePolicy()}
        </div>
      </div>

    </div>
  );
}
