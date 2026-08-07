import React, { useState, useEffect } from 'react';

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [hashOutput, setHashOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function generateHash() {
      if (!input) {
        setHashOutput('');
        setError('');
        return;
      }

      try {
        if (!window.crypto || !window.crypto.subtle) {
          throw new Error('Cryptography API is not supported in this browser environment.');
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        
        const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
        
        // Convert buffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        setHashOutput(hashHex);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Error generating hash');
        setHashOutput('');
      }
    }

    generateHash();
  }, [input, algorithm]);

  const copyToClipboard = () => {
    if (hashOutput) {
      navigator.clipboard.writeText(hashOutput);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">Input String</label>
        <textarea
          rows={4}
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm shadow-sm"
          placeholder="Type the text you want to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          data-testid="hash-input"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)}
          className="w-full md:w-1/2 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
          data-testid="algo-select"
        >
          <option value="SHA-1">SHA-1 (Insecure)</option>
          <option value="SHA-256">SHA-256 (Industry Standard)</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512 (High Security)</option>
        </select>
      </div>

      <div>
        <div className="flex justify-between items-end mb-2">
          <label className="block text-sm font-bold text-slate-700">Hash Output</label>
          {hashOutput && (
            <button onClick={copyToClipboard} className="text-xs font-semibold text-blue-600 hover:text-blue-800" data-testid="copy-hash-btn">
              Copy Hex
            </button>
          )}
        </div>
        <div className={`w-full p-4 border rounded-xl min-h-[5rem] font-mono text-sm break-all ${error ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-800'}`} data-testid="hash-output">
          {error ? error : hashOutput}
        </div>
      </div>
    </div>
  );
}
