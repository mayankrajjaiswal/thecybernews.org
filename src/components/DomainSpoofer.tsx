import React, { useState } from 'react';

// Common visual lookalikes
const HOMOGLYPHS: Record<string, string[]> = {
  'a': ['e', 'o', 'c'],
  'b': ['d', 'p'],
  'c': ['e', 'o', 'a'],
  'd': ['b', 'p'],
  'e': ['c', 'o', 'a'],
  'g': ['q'],
  'i': ['l', '1', 'j'],
  'l': ['i', '1'],
  'm': ['rn', 'nn'],
  'n': ['m', 'h'],
  'o': ['0', 'c', 'e'],
  'p': ['q'],
  'r': ['n'],
  's': ['5'],
  't': ['l', 'f'],
  'u': ['v', 'y'],
  'v': ['u'],
  'w': ['vv'],
  'x': ['y'],
  'y': ['v', 'u'],
  'z': ['2']
};

const COMMON_TLDS = ['.com', '.net', '.org', '.co', '.biz', '.info', '.us'];

const COMMON_PREFIXES = ['login-', 'secure-', 'support-', 'admin-', 'auth-', 'update-', 'portal-'];
const COMMON_SUFFIXES = ['-login', '-secure', '-support', '-admin', '-auth', '-update', '-portal'];

export default function DomainSpoofer() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<{ type: string, url: string, description: string }[]>([]);

  const generateSpoofs = () => {
    let cleanDomain = domain.trim().toLowerCase();
    
    // Strip http/www
    cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    if (!cleanDomain || !cleanDomain.includes('.')) {
      setResults([]);
      return;
    }

    const parts = cleanDomain.split('.');
    const tld = '.' + parts.pop();
    const root = parts.join('.');

    let spoofs: { type: string, url: string, description: string }[] = [];

    // 1. TLD Swapping (e.g. google.com -> google.co)
    COMMON_TLDS.forEach(altTld => {
      if (altTld !== tld) {
        spoofs.push({
          type: 'TLD Swap',
          url: `${root}${altTld}`,
          description: `Hackers register your exact name on a cheaper or less common Top Level Domain.`
        });
      }
    });

    // 2. Homoglyph Replacement (Visual Tricks)
    let homoglyphsGenerated = 0;
    for (let i = 0; i < root.length; i++) {
      const char = root[i];
      if (HOMOGLYPHS[char]) {
        HOMOGLYPHS[char].forEach(substitution => {
          if (homoglyphsGenerated < 5) { // Cap at 5 to not overwhelm
            const newRoot = root.substring(0, i) + substitution + root.substring(i + 1);
            spoofs.push({
              type: 'Homoglyph (Visual Trick)',
              url: `${newRoot}${tld}`,
              description: `Replaced '${char}' with '${substitution}', which looks almost identical at a quick glance.`
            });
            homoglyphsGenerated++;
          }
        });
      }
    }

    // 3. Typo-squatting (Missing letters)
    if (root.length > 4) {
      spoofs.push({
        type: 'Typo (Omission)',
        url: `${root.slice(0, 2)}${root.slice(3)}${tld}`,
        description: `Removed the 3rd letter. Many users type fast and miss a keystroke.`
      });
      spoofs.push({
        type: 'Typo (Double Letter)',
        url: `${root.slice(0, 2)}${root[2]}${root.slice(2)}${tld}`,
        description: `Doubled the 3rd letter. A common typing mistake.`
      });
    }

    // 4. Social Engineering Additions
    spoofs.push({
      type: 'Social Engineering',
      url: `${COMMON_PREFIXES[0]}${root}${tld}`,
      description: `Added a prefix to make the link look like an official IT or login portal.`
    });
    spoofs.push({
      type: 'Social Engineering',
      url: `${root}${COMMON_SUFFIXES[1]}${tld}`,
      description: `Added a suffix implying security to build false trust.`
    });
    
    // 5. Subdomain Spoofing
    spoofs.push({
      type: 'Subdomain Trick',
      url: `${root}.secure-auth-gateway.com`,
      description: `Your brand is put on the left side (the subdomain), but the hacker actually owns 'secure-auth-gateway.com'.`
    });

    setResults(spoofs);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" data-testid="domain-spoofer">
      
      {/* Input Side */}
      <div className="w-full md:w-1/3 p-6 md:p-8 bg-slate-900 text-white flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Domain Spoofing Generator</h2>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          Enter your company's website address below. We will generate the most common variations that hackers might register to impersonate your brand in a phishing attack.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Your Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateSpoofs()}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            placeholder="e.g. acme-corp.com"
          />
        </div>
        
        <button 
          onClick={generateSpoofs}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg"
        >
          Generate Spoofs
        </button>

        {results.length > 0 && (
          <div className="mt-8 p-4 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="font-bold text-indigo-400 mb-2 text-sm uppercase">Why does this matter?</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              If a hacker registers one of these domains, they can set up a fake Microsoft 365 login page. When they email your employees from <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded">IT@{results[0]?.url}</code>, your staff might trust the email and give away their passwords.
            </p>
          </div>
        )}
      </div>

      {/* Results Side */}
      <div className="w-full md:w-2/3 p-6 md:p-8 bg-slate-50 flex flex-col h-[700px]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Potential Threats</h2>
          {results.length > 0 && (
            <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {results.length} Variations Found
            </span>
          )}
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2">
          {results.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              <p className="font-medium text-lg">Enter a valid domain name (e.g. google.com) and click Generate.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{result.type}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(result.url);
                        alert(`Copied ${result.url} to clipboard`);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      title="Copy URL"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                  </div>
                  <h3 className="font-mono text-xl font-extrabold text-red-600 break-all mb-2 leading-none">
                    {result.url}
                  </h3>
                  <p className="text-sm text-slate-600">{result.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
