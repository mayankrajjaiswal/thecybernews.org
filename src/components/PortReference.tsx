import React, { useState, useMemo } from 'react';

// Common Ports Database
const commonPorts = [
  { port: 20, protocol: 'TCP', service: 'FTP', desc: 'File Transfer Protocol (Data)' },
  { port: 21, protocol: 'TCP', service: 'FTP', desc: 'File Transfer Protocol (Command)' },
  { port: 22, protocol: 'TCP', service: 'SSH', desc: 'Secure Shell (Encrypted remote login)' },
  { port: 23, protocol: 'TCP', service: 'Telnet', desc: 'Unencrypted text communications (Insecure)' },
  { port: 25, protocol: 'TCP', service: 'SMTP', desc: 'Simple Mail Transfer Protocol (Email routing)' },
  { port: 53, protocol: 'UDP/TCP', service: 'DNS', desc: 'Domain Name System (Resolves names to IPs)' },
  { port: 80, protocol: 'TCP', service: 'HTTP', desc: 'Hypertext Transfer Protocol (Unencrypted web)' },
  { port: 110, protocol: 'TCP', service: 'POP3', desc: 'Post Office Protocol (Email retrieval)' },
  { port: 143, protocol: 'TCP', service: 'IMAP', desc: 'Internet Message Access Protocol (Email retrieval)' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', desc: 'HTTP Secure (Encrypted web traffic)' },
  { port: 3389, protocol: 'TCP', service: 'RDP', desc: 'Remote Desktop Protocol (Windows)' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', desc: 'PostgreSQL Database' },
  { port: 8080, protocol: 'TCP', service: 'HTTP-Alt', desc: 'Alternative HTTP port (Often used for web servers/proxies)' }
];

export default function PortReference() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPorts = useMemo(() => {
    if (!searchTerm.trim()) return commonPorts;
    const term = searchTerm.toLowerCase();
    return commonPorts.filter(p => 
      p.port.toString().includes(term) || 
      p.service.toLowerCase().includes(term) ||
      p.desc.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <label htmlFor="port-search" className="block text-sm font-bold text-slate-700 mb-2">
          Search Ports
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <input
            id="port-search"
            type="text"
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
            placeholder="Search by port number (e.g. 443), service (e.g. SSH), or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="port-search-input"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase sticky top-0">
            <tr>
              <th className="px-6 py-4 font-bold w-24">Port</th>
              <th className="px-6 py-4 font-bold w-24">Protocol</th>
              <th className="px-6 py-4 font-bold w-32">Service</th>
              <th className="px-6 py-4 font-bold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredPorts.length > 0 ? (
              filteredPorts.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors" data-testid="port-row">
                  <td className="px-6 py-4 font-bold text-indigo-700">{item.port}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.protocol}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{item.service}</td>
                  <td className="px-6 py-4 text-slate-600">{item.desc}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                  No ports found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
