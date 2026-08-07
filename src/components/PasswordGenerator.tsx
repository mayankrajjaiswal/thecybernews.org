import React, { useState, useEffect, useCallback } from 'react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      setPassword('Please select at least one option.');
      return;
    }

    let newPassword = '';
    // Use crypto.getRandomValues for cryptographically secure random numbers if available
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const values = new Uint32Array(length);
      window.crypto.getRandomValues(values);
      for (let i = 0; i < length; i++) {
        newPassword += charset[values[i] % charset.length];
      }
    } else {
      // Fallback for testing environments
      for (let i = 0; i < length; i++) {
        newPassword += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    setPassword(newPassword);
    setCopied(false);
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    if (password && password !== 'Please select at least one option.') {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateStrength = () => {
    if (password === 'Please select at least one option.') return { label: 'Invalid', color: 'bg-slate-200' };
    let score = 0;
    if (length > 12) score += 1;
    if (length >= 16) score += 1;
    if (useUpper) score += 1;
    if (useLower) score += 1;
    if (useNumbers) score += 1;
    if (useSymbols) score += 1;

    if (score < 3) return { label: 'Weak', color: 'bg-red-500' };
    if (score < 5) return { label: 'Good', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = calculateStrength();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="relative mb-8">
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 md:p-6 text-center break-all font-mono text-xl md:text-3xl text-slate-800 min-h-[5rem] flex items-center justify-center" data-testid="password-display">
          {password}
        </div>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          title="Copy to clipboard"
          data-testid="copy-button"
        >
          {copied ? (
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Password Strength</span>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-800">{strength.label}</span>
          <div className="w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.label === 'Strong' ? '100%' : strength.label === 'Good' ? '66%' : '33%' }}></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="length-slider" className="font-medium text-slate-700">Length</label>
            <span className="font-bold text-indigo-600 text-lg">{length}</span>
          </div>
          <input
            id="length-slider"
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            data-testid="length-slider"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" data-testid="check-upper" />
            <span className="font-medium text-slate-700">Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" data-testid="check-lower" />
            <span className="font-medium text-slate-700">Lowercase (a-z)</span>
          </label>
          <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" data-testid="check-numbers" />
            <span className="font-medium text-slate-700">Numbers (0-9)</span>
          </label>
          <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" data-testid="check-symbols" />
            <span className="font-medium text-slate-700">Symbols (!@#$)</span>
          </label>
        </div>

        <button
          onClick={generatePassword}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-200"
        >
          Generate New Password
        </button>
      </div>
    </div>
  );
}
