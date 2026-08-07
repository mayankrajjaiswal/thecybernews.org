import React, { useState } from 'react';

export default function BreachCheck() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'safe' | 'breached' | 'error';
    count?: number;
    message?: string;
  } | null>(null);

  const checkPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      // 1. Hash the password using SHA-1 (Required by Have I Been Pwned)
      // This happens ENTIRELY inside the browser.
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      
      // Check if crypto is available (might not be in some test envs without polyfill)
      if (!window.crypto || !window.crypto.subtle) {
         throw new Error("Cryptography API not available in this browser.");
      }
      
      const hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
      
      // Convert buffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      // 2. K-Anonymity: Split the hash
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);

      // 3. Send ONLY the first 5 characters to the API
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      if (!response.ok) {
        throw new Error('Failed to connect to the breach database.');
      }

      const responseText = await response.text();
      
      // 4. Check if our specific suffix is in the returned list
      const lines = responseText.split('\n');
      let breachCount = 0;
      
      for (const line of lines) {
        const [returnedSuffix, countStr] = line.split(':');
        if (returnedSuffix.trim() === suffix) {
          breachCount = parseInt(countStr.trim(), 10);
          break;
        }
      }

      if (breachCount > 0) {
        setResult({
          status: 'breached',
          count: breachCount
        });
      } else {
        setResult({ status: 'safe' });
      }

    } catch (err: any) {
      setResult({
        status: 'error',
        message: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Check a Password</h2>
        <p className="text-slate-600">
          Enter a password to see if it has ever been exposed in a data breach. We use <span className="font-semibold">k-Anonymity</span>, meaning your actual password never leaves your browser.
        </p>
      </div>

      <form onSubmit={checkPassword} className="space-y-4">
        <div>
          <label htmlFor="password-input" className="sr-only">Password to check</label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a password to check..."
            className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg shadow-sm"
            data-testid="password-input"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !password.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          data-testid="check-button"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Check Database'}
        </button>
      </form>

      {result && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {result.status === 'safe' && (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">Good News!</h3>
              <p className="text-emerald-800">
                This password has <strong>never</strong> been found in any known data breaches.
              </p>
            </div>
          )}

          {result.status === 'breached' && (
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Oh no — Pwned!</h3>
              <p className="text-red-800 mb-2">
                This password has been seen <strong>{result.count?.toLocaleString()} times</strong> in past data breaches.
              </p>
              <p className="text-sm text-red-700 font-medium">
                This password is no longer safe to use on any website. If you are currently using it, change it immediately.
              </p>
            </div>
          )}

          {result.status === 'error' && (
            <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-slate-700 text-sm font-medium text-center">
              {result.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
