import React, { useState, useRef } from 'react';

export default function FileHashVerifier() {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [expectedHash, setExpectedHash] = useState('');
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({ name: file.name, size: formatBytes(file.size) });
    setComputedHash(null);
    setError(null);
    setIsComputing(true);

    try {
      // Use FileReader and crypto.subtle for secure, entirely client-side hashing
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setComputedHash(hashHex);
    } catch (err: any) {
      setError('Failed to compute hash. The file might be too large or your browser does not support local crypto.');
    } finally {
      setIsComputing(false);
    }
  };

  const isMatch = expectedHash.trim() !== '' && computedHash !== null && expectedHash.trim().toLowerCase() === computedHash.toLowerCase();
  const isMismatch = expectedHash.trim() !== '' && computedHash !== null && expectedHash.trim().toLowerCase() !== computedHash.toLowerCase();

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="file-hash-verifier">
      <div className="bg-slate-900 p-6 md:p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Local File Hash Verifier</h2>
        <p className="text-slate-300 text-sm">
          Verify the integrity of a downloaded file (like a software installer) by computing its SHA-256 hash. 
          <strong className="text-emerald-400"> 100% Client-Side. Your file is NEVER uploaded to a server.</strong>
        </p>
      </div>

      <div className="p-6 md:p-8">
        
        {/* Step 1: Expected Hash */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            1. Paste the Expected SHA-256 Hash (Optional)
          </label>
          <input
            type="text"
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            placeholder="e.g., 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            data-testid="expected-hash-input"
          />
          <p className="text-xs text-slate-500 mt-2">You can usually find this on the software developer's download page.</p>
        </div>

        {/* Step 2: File Selector */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            2. Select a Local File
          </label>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              computedHash ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50 cursor-pointer'
            }`}
            onClick={() => fileInputRef.current?.click()}
            data-testid="file-dropzone"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              data-testid="file-input"
            />
            
            {!fileInfo ? (
              <div>
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="text-slate-600 font-medium">Click to select a file from your device</p>
                <p className="text-slate-400 text-xs mt-1">Processed entirely in your browser</p>
              </div>
            ) : (
              <div>
                <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-slate-900 font-bold">{fileInfo.name}</p>
                <p className="text-slate-500 text-sm mt-1">{fileInfo.size}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status / Error */}
        {isComputing && (
          <div className="mt-6 p-4 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center gap-3">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Computing SHA-256 hash locally...
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 font-bold rounded-xl">
            {error}
          </div>
        )}

        {/* Results */}
        {computedHash && !isComputing && (
          <div className="mt-8 border-t border-slate-200 pt-8" data-testid="hash-results">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Computed SHA-256 Hash</h3>
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 font-mono text-sm md:text-base text-slate-900 break-all mb-6 relative">
              {computedHash}
              <button 
                onClick={() => navigator.clipboard.writeText(computedHash)}
                className="absolute top-2 right-2 p-2 bg-white rounded shadow-sm hover:bg-slate-50 text-slate-500"
                title="Copy Hash"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
            </div>

            {expectedHash.trim() !== '' && (
              <div className={`p-6 rounded-xl border-2 ${isMatch ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-red-50 border-red-500 text-red-900'}`}>
                {isMatch ? (
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <div>
                      <h4 className="font-bold text-lg">Hashes Match!</h4>
                      <p className="text-emerald-800 text-sm mt-1">The computed hash exactly matches your expected hash. The file is authentic and has not been tampered with.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    <div>
                      <h4 className="font-bold text-lg">MISMATCH DETECTED</h4>
                      <p className="text-red-800 text-sm mt-1">DANGER: The file's hash does not match your expected hash. It may have been corrupted during download, or tampered with by malware. Do not execute this file.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
