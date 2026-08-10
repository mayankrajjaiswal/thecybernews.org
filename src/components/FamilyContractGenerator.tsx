import React, { useState } from 'react';

export default function FamilyContractGenerator() {
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    bedtime: '21:00',
    allowSocialMedia: false,
    allowMultiplayer: true,
    screenTimeLimit: '2',
    consequence: 'loss of device privileges for 24 hours'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateContract = () => {
    const parent = formData.parentName || '[Parent Name]';
    const child = formData.childName || '[Child Name]';

    return `
# Family Internet & Device Safety Contract
**Between:** ${parent} (Parent/Guardian) and ${child} (Child)
**Date:** ${new Date().toLocaleDateString()}

## 1. Trust and Honesty
I, **${child}**, understand that having a device and access to the internet is a privilege, not a right. I agree to be open and honest with my parents about what I do online. If I see something that makes me uncomfortable, scared, or confused, I will tell **${parent}** immediately. I know I will not get in trouble for asking for help.

## 2. Screen Time and Sleep
* I will hand over my devices to my parents or put them in the agreed charging station by **${formData.bedtime}** every night.
* I will limit my recreational screen time (gaming, videos, browsing) to **${formData.screenTimeLimit} hours** per day. (Schoolwork does not count towards this limit).

## 3. Privacy and Protection
* I will NEVER share my real full name, home address, school name, phone number, or passwords with anyone online.
* I will not send pictures of myself to strangers or post photos that show exactly where I am.
* I understand that my parents may occasionally check my device to ensure my safety, but they will respect my growing independence as long as I follow these rules.

## 4. Apps and Gaming
${formData.allowSocialMedia ? '* I am allowed to use approved social media apps, but my account must be set to PRIVATE. I will only accept friend requests from people I know in real life.' : '* I am NOT allowed to create social media accounts (TikTok, Instagram, Snapchat, etc.) until my parents decide I am old enough.'}
${formData.allowMultiplayer ? '* I am allowed to play multiplayer games, but if another player is bullying or being inappropriate, I will mute/block them and tell my parents.' : '* I will only play single-player games or games with local friends. I will not chat with strangers online.'}
* I will not download new apps or make in-app purchases without asking permission first.

## 5. Kindness and Respect (Cyberbullying)
* I will be a good digital citizen. I will not use my device to bully, tease, or gossip about anyone.
* If someone else is being cyberbullied, I will not join in, and I will report it to an adult.

## 6. Consequences
I understand that if I break the rules in this contract, the consequence will be **${formData.consequence}**.

---

**Signatures:**

Child: ____________________________________

Parent: ___________________________________
    `.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateContract());
    alert('Contract copied to clipboard! You can paste it into Word/Google Docs to print.');
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" data-testid="contract-generator">
      
      {/* Form Sidebar */}
      <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col h-[700px] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Family Rules
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Parent's Name</label>
            <input 
              type="text" 
              name="parentName"
              value={formData.parentName}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Mom & Dad"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Child's Name</label>
            <input 
              type="text" 
              name="childName"
              value={formData.childName}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Alex"
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Device Bedtime</label>
              <input 
                type="time" 
                name="bedtime"
                value={formData.bedtime}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Daily Screen Time (Hours)</label>
              <select 
                name="screenTimeLimit"
                value={formData.screenTimeLimit}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
              >
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="3">3 Hours</option>
                <option value="4">4 Hours</option>
                <option value="Unlimited">Unlimited</option>
              </select>
            </div>
            
            <label className="flex items-start gap-3 mb-4 cursor-pointer">
              <input type="checkbox" name="allowSocialMedia" checked={formData.allowSocialMedia} onChange={handleInputChange} className="mt-1 text-indigo-600" data-testid="check-social" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">Allow Social Media</span>
                <span className="text-xs text-slate-500 block">TikTok, Instagram, Snapchat, etc.</span>
              </div>
            </label>
            
            <label className="flex items-start gap-3 mb-4 cursor-pointer">
              <input type="checkbox" name="allowMultiplayer" checked={formData.allowMultiplayer} onChange={handleInputChange} className="mt-1 text-indigo-600" data-testid="check-gaming" />
              <div>
                <span className="text-sm font-bold text-slate-700 block">Allow Online Multiplayer</span>
                <span className="text-xs text-slate-500 block">Roblox, Fortnite, Minecraft, etc.</span>
              </div>
            </label>

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Consequence for breaking rules</label>
              <input 
                type="text" 
                name="consequence"
                value={formData.consequence}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full md:w-2/3 p-6 md:p-8 bg-white flex flex-col h-[700px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Contract Preview</h2>
          <button 
            onClick={copyToClipboard}
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold py-1.5 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            Copy to Clipboard
          </button>
        </div>
        
        <div className="flex-grow bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto font-serif text-sm text-slate-800 whitespace-pre-wrap leading-relaxed" data-testid="contract-preview">
          {generateContract()}
        </div>
      </div>

    </div>
  );
}
