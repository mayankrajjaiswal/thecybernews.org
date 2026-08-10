import React, { useState } from 'react';

// Basic homoglyph check (very simplified for educational purposes)
const HOMOGLYPH_MAP: Record<string, string> = {
  'I': 'l', // uppercase i to lowercase L
  'l': 'I',
  '0': 'O',
  'O': '0',
  'rn': 'm' // r and n looks like m
};

const hasHomoglyphs = (str: string) => {
  if (str.includes('rn')) return true; // manual check for the rn->m trick
  // Just check if there's an uppercase I pretending to be a lowercase l or vice versa in a suspicious context.
  // Actually, for a simple tool, let's just check for 'I' (capital i) which is the most common spoof for 'l'
  // Or '0' (zero) spoofing 'O'
  
  if (str.includes('I') && str.toLowerCase() !== str) return true; // Capital I in a lowercase looking domain
  if (str.includes('0') && /[a-zA-Z]/.test(str)) return true; // Number 0 mixed with letters
  
  return false;
};

export default function LinkAnatomyAnalyzer() {
  const [inputUrl, setInputUrl] = useState('https://login.paypal.com.secure-update.net/auth');
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  const analyzeUrl = () => {
    try {
      // Add protocol if missing so the URL parser doesn't crash on standard inputs
      let urlToParse = inputUrl.trim();
      if (!urlToParse.startsWith('http://') && !urlToParse.startsWith('https://')) {
        urlToParse = 'https://' + urlToParse;
      }

      const parsed = new URL(urlToParse);
      const hostname = parsed.hostname; // e.g. login.paypal.com.secure-update.net
      
      const parts = hostname.split('.');
      if (parts.length < 2) throw new Error("Invalid domain structure");

      // The root domain is usually the last two parts (e.g. secure-update.net)
      const tld = parts[parts.length - 1]; // net
      const rootDomainString = parts[parts.length - 2]; // secure-update
      
      const rootDomain = `${rootDomainString}.${tld}`;
      
      // Everything before the root domain are subdomains
      const subdomains = parts.slice(0, parts.length - 2).join('.');

      const isHomoglyph = hasHomoglyphs(rootDomainString);
      
      let safetyScore = 100;
      let warnings = [];

      if (parsed.protocol === 'http:') {
        safetyScore -= 20;
        warnings.push('The link uses HTTP instead of HTTPS, meaning the connection is not encrypted.');
      }
      
      if (isHomoglyph) {
        safetyScore -= 50;
        warnings.push('The root domain contains look-alike characters (homoglyphs), often used to trick the eye (e.g., "appIe" instead of "apple").');
      }

      if (subdomains.length > 0 && (subdomains.includes('paypal') || subdomains.includes('apple') || subdomains.includes('amazon') || subdomains.includes('google') || subdomains.includes('microsoft'))) {
         safetyScore -= 40;
         warnings.push(`The subdomain contains the name of a famous brand (${subdomains}). Scammers do this to trick you into thinking it's the real website, but the ONLY part that matters is the root domain: ${rootDomain}.`);
      }

      setAnalysis({
        protocol: parsed.protocol.replace(':', ''),
        subdomains: subdomains || 'None',
        rootDomain,
        path: parsed.pathname + parsed.search + parsed.hash,
        safetyScore: Math.max(0, safetyScore),
        warnings,
        isHomoglyph
      });
      setError('');
    } catch (err) {
      setError('Could not parse URL. Please ensure it is a valid format (e.g., google.com/search).');
      setAnalysis(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="link-anatomy">
      <div className="bg-slate-900 p-6 md:p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Analyze a Link</h2>
        <p className="text-slate-300 mb-6">
          Scammers hide their fake websites by adding famous brand names to the <strong>Subdomain</strong>. The only way to know the true destination of a link is to find the <strong>Root Domain</strong>.
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
            className="flex-grow bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
            placeholder="e.g., https://apple.com.billing-update.net/login"
          />
          <button 
            onClick={analyzeUrl}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
          >
            Analyze
          </button>
        </div>
        {error && <p className="text-red-400 mt-2 text-sm font-medium">{error}</p>}
      </div>

      {analysis && (
        <div className="p-6 md:p-8 bg-slate-50" data-testid="analysis-results">
          
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">The True Destination</h3>
            
            {/* Visual Breakdown */}
            <div className="flex flex-wrap gap-2 font-mono text-lg md:text-xl break-all">
              <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded" title="Protocol">
                {analysis.protocol}://
              </span>
              
              {analysis.subdomains !== 'None' && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded border border-red-300 relative group cursor-help" title="Subdomain (Often Fake)">
                  {analysis.subdomains}.
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                    Scammers control this part to trick you.
                  </span>
                </span>
              )}
              
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded border-2 border-emerald-500 font-bold relative group cursor-help shadow-sm" title="Root Domain (The True Destination)">
                {analysis.rootDomain}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                  This is the ONLY part that matters. Who owns this?
                </span>
              </span>
              
              {analysis.path !== '/' && (
                <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded" title="File Path">
                  {analysis.path}
                </span>
              )}
            </div>
            
            <p className="mt-6 text-slate-700 text-lg">
              No matter what the rest of the link says, this link will send you to a server owned by whoever registered <strong className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">{analysis.rootDomain}</strong>.
            </p>
          </div>

          {analysis.warnings.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Security Warnings
              </h4>
              <ul className="space-y-2">
                {analysis.warnings.map((warn: string, idx: number) => (
                  <li key={idx} className="text-red-700 text-sm">
                    • {warn}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.safetyScore === 100 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-800 font-bold flex items-center gap-3">
              <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              No immediate structural red flags found. (However, always verify the Root Domain is what you expect!)
            </div>
          )}

          {/* Quick Examples */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Try analyzing these examples:</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setInputUrl('https://apple.com'); setAnalysis(null); }} className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-3 py-1.5 rounded text-sm transition-colors font-mono">
                apple.com
              </button>
              <button onClick={() => { setInputUrl('http://appIe.com'); setAnalysis(null); }} className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-3 py-1.5 rounded text-sm transition-colors font-mono">
                appIe.com
              </button>
              <button onClick={() => { setInputUrl('https://amazon.support.verification-center.com'); setAnalysis(null); }} className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-3 py-1.5 rounded text-sm transition-colors font-mono">
                amazon.support.verification-center.com
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
