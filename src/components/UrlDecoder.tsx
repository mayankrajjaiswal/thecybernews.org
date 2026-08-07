import React, { useState } from 'react';

export default function UrlDecoder() {
  const [inputUrl, setInputUrl] = useState('');
  const [decodedUrl, setDecodedUrl] = useState('');
  const [parsedData, setParsedData] = useState<{
    protocol?: string;
    hostname?: string;
    pathname?: string;
    searchParams?: [string, string][];
    error?: string;
  } | null>(null);

  const analyzeUrl = () => {
    if (!inputUrl.trim()) {
      setParsedData(null);
      setDecodedUrl('');
      return;
    }

    let decoded = '';
    try {
      // Decode the URI component to remove %20, etc.
      decoded = decodeURIComponent(inputUrl.trim());
      setDecodedUrl(decoded);
    } catch (e) {
      setDecodedUrl(inputUrl.trim());
      decoded = inputUrl.trim(); // fallback if strict decoding fails
    }

    // Attempt to parse to show domain details
    try {
      // If it doesn't start with http, URL parsing will fail, so we prepend it just for analysis
      const urlToParse = /^https?:\/\//i.test(decoded) ? decoded : `http://${decoded}`;
      const urlObj = new URL(urlToParse);
      
      const params: [string, string][] = [];
      urlObj.searchParams.forEach((value, key) => {
        params.push([key, value]);
      });

      setParsedData({
        protocol: urlObj.protocol.replace(':', ''),
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        searchParams: params.length > 0 ? params : undefined,
      });

      if (!urlObj.hostname) {
        throw new Error('No hostname found');
      }
    } catch (e) {
      setParsedData({ error: 'Could not parse the structure of this URL. It may be incomplete or malformed.' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <label htmlFor="url-input" className="block text-sm font-bold text-slate-700 mb-2">
          Paste the suspicious link here:
        </label>
        <textarea
          id="url-input"
          rows={4}
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none shadow-sm"
          placeholder="e.g., https%3A%2F%2Famazon-support.com%2Flogin%3Fuser%3Djohndoe..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          data-testid="url-input"
        />
      </div>

      <button
        onClick={analyzeUrl}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-200 mb-8"
        data-testid="analyze-btn"
      >
        Analyze Link
      </button>

      {decodedUrl && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">Analysis Results</h3>
          
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Decoded URL</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm text-slate-800 break-all" data-testid="decoded-output">
              {decodedUrl}
            </div>
          </div>

          {parsedData && !parsedData.error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
              <div>
                <p className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-1">True Destination (Domain)</p>
                <p className="font-bold text-lg text-indigo-700 break-all" data-testid="domain-output">
                  {parsedData.hostname}
                </p>
                <p className="text-xs text-indigo-600 mt-1">This is the *actual* website you will be sent to.</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-1">Protocol</p>
                <p className="font-medium text-slate-800">
                  {parsedData.protocol === 'https' ? 'HTTPS (Encrypted)' : 'HTTP (Unencrypted/Insecure)'}
                </p>
              </div>

              {parsedData.searchParams && (
                <div className="md:col-span-2 mt-2">
                  <p className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-2">Hidden Parameters Sent to Server</p>
                  <div className="bg-white rounded-lg border border-indigo-100 overflow-hidden">
                    <ul className="divide-y divide-indigo-50 text-sm font-mono">
                      {parsedData.searchParams.map((param, idx) => (
                        <li key={idx} className="p-3 flex flex-col sm:flex-row sm:gap-4">
                          <span className="font-bold text-indigo-600 break-all min-w-[120px]">{param[0]}</span>
                          <span className="text-slate-600 break-all">{param[1]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {parsedData?.error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mt-4 text-sm font-medium">
              {parsedData.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
