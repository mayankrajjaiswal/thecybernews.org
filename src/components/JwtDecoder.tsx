import React, { useState } from 'react';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const decodeJWT = (inputToken: string) => {
    setToken(inputToken);
    setError('');
    setHeader('');
    setPayload('');
    setSignature('');

    if (!inputToken.trim()) return;

    const parts = inputToken.trim().split('.');
    
    if (parts.length !== 3) {
      setError('Invalid JWT format. A token must consist of three parts separated by dots.');
      return;
    }

    try {
      // Decode Header (Base64Url)
      const headerRaw = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      setHeader(JSON.stringify(JSON.parse(headerRaw), null, 2));
      
      // Decode Payload (Base64Url)
      const payloadRaw = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      setPayload(JSON.stringify(JSON.parse(payloadRaw), null, 2));

      // Show Signature
      setSignature(parts[2]);
    } catch (e) {
      setError('Failed to parse token parts. The token may be malformed or corrupted.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 mb-2">Paste JWT Token Here</label>
        <textarea
          rows={4}
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm shadow-sm break-all"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          value={token}
          onChange={(e) => decodeJWT(e.target.value)}
          data-testid="jwt-input"
        />
        {error && <p className="mt-2 text-red-600 font-medium text-sm" data-testid="jwt-error">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-red-600 mb-2">Header (Algorithm & Type)</label>
          <pre className="w-full p-4 border border-red-200 rounded-xl bg-red-50 text-red-900 min-h-[8rem] font-mono text-xs overflow-auto" data-testid="jwt-header">
            {header}
          </pre>
        </div>

        <div>
          <label className="block text-sm font-bold text-purple-600 mb-2">Payload (Data & Claims)</label>
          <pre className="w-full p-4 border border-purple-200 rounded-xl bg-purple-50 text-purple-900 min-h-[8rem] font-mono text-xs overflow-auto" data-testid="jwt-payload">
            {payload}
          </pre>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-blue-600 mb-2">Signature (Verify Token)</label>
          <div className="w-full p-4 border border-blue-200 rounded-xl bg-blue-50 text-blue-900 min-h-[4rem] font-mono text-xs break-all" data-testid="jwt-signature">
            {signature}
          </div>
        </div>
      </div>
    </div>
  );
}
