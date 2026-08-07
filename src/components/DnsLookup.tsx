import React, { useState } from 'react';

type DnsRecord = {
  name: string;
  type: number;
  TTL: number;
  data: string;
};

// DNS Record Types mapping for display
const dnsTypes: Record<number, string> = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
};

export default function DnsLookup() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('1'); // Default to A record
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [error, setError] = useState('');

  const lookupDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    // Clean up domain (remove http, www, etc.)
    let cleanDomain = domain.toLowerCase().trim();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    cleanDomain = cleanDomain.replace(/^www\./, '');
    cleanDomain = cleanDomain.split('/')[0]; // remove paths

    setLoading(true);
    setError('');
    setRecords([]);

    try {
      // Use Google's public DNS-over-HTTPS API
      const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${recordType}`);
      
      if (!response.ok) {
        throw new Error('Failed to communicate with DNS resolver.');
      }

      const data = await response.json();

      if (data.Status !== 0) {
        // Handle common DNS errors
        if (data.Status === 3) throw new Error('Domain not found (NXDOMAIN).');
        throw new Error(`DNS lookup failed with status code ${data.Status}.`);
      }

      if (!data.Answer || data.Answer.length === 0) {
        setError(`No ${dnsTypes[Number(recordType)] || 'requested'} records found for ${cleanDomain}.`);
      } else {
        setRecords(data.Answer);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during DNS lookup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">DNS Lookup</h2>
        <p className="text-slate-600">
          Query global Domain Name System records directly from your browser.
        </p>
      </div>

      <form onSubmit={lookupDomain} className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            data-testid="dns-input"
            required
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold text-sm text-slate-700 h-full"
            data-testid="dns-type"
          >
            <option value="1">A (IPv4)</option>
            <option value="28">AAAA (IPv6)</option>
            <option value="15">MX (Mail)</option>
            <option value="16">TXT (Text)</option>
            <option value="5">CNAME (Alias)</option>
            <option value="2">NS (Nameserver)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !domain.trim()}
          className="w-full md:w-32 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          data-testid="dns-submit"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Lookup'}
        </button>
      </form>

      {/* Results Area */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mt-4 text-sm font-medium animate-in fade-in" data-testid="dns-error">
          {error}
        </div>
      )}

      {records.length > 0 && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase">
                <tr>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">TTL</th>
                  <th className="px-6 py-4 font-bold">Data (IP / Target)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {records.map((record, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-700">
                      {dnsTypes[record.type] || `Type ${record.type}`}
                    </td>
                    <td className="px-6 py-4 font-mono">{record.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{record.TTL}s</td>
                    <td className="px-6 py-4 font-mono text-slate-900 break-all">{record.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
