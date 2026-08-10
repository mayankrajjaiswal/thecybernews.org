import React, { useState } from 'react';

const MIME_TYPES = [
  { ext: '.exe', type: 'Executable', risk: 'Critical', desc: 'A direct Windows program. Never open this from an email.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { ext: '.scr', type: 'Screensaver', risk: 'Critical', desc: 'Actually a hidden executable file. Heavily used by older malware.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { ext: '.bat', type: 'Batch File', risk: 'Critical', desc: 'A script that runs commands directly on your computer.', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { ext: '.vbs', type: 'VBScript', risk: 'Critical', desc: 'A script that executes code via Windows Script Host.', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { ext: '.js', type: 'JavaScript', risk: 'Critical', desc: 'While normally safe inside a browser, downloading and running a raw .js file will execute it directly on your computer.', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { ext: '.docm', type: 'Macro Document', risk: 'High', desc: 'A Word document that contains embedded code (macros). Often used in spear-phishing.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { ext: '.xlsm', type: 'Macro Spreadsheet', risk: 'High', desc: 'An Excel spreadsheet with embedded macros. Frequently used to distribute ransomware.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { ext: '.zip', type: 'Compressed Archive', risk: 'Medium', desc: 'Safe on its own, but hackers use zip files to bypass email scanners and hide the real malware inside.', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  { ext: '.iso', type: 'Disk Image', risk: 'Medium', desc: 'Acts like a virtual CD-ROM. Recently abused by hackers to bypass Windows security warnings (Mark-of-the-Web).', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { ext: '.pdf', type: 'PDF Document', risk: 'Low', desc: 'Generally safe to view. The main risk is phishing links hidden inside the text.', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { ext: '.txt', type: 'Plain Text', risk: 'Safe', desc: 'Cannot execute code. (However, always ensure the file doesn\'t end in .txt.exe!)', icon: 'M4 6h16M4 12h16M4 18h7' },
  { ext: '.jpg', type: 'Image', risk: 'Safe', desc: 'Standard image file. (Make sure you have file extensions visible in Windows so a hacker can\'t trick you with image.jpg.exe)', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
];

export default function MimeTypeReference() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredTypes = MIME_TYPES.filter(item => {
    const matchesSearch = item.ext.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || item.risk === filter;
    return matchesSearch && matchesFilter;
  });

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-red-200">Critical Risk</span>;
      case 'High': return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-orange-200">High Risk</span>;
      case 'Medium': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-yellow-200">Medium Risk</span>;
      case 'Low': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-blue-200">Low Risk</span>;
      case 'Safe': return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-emerald-200">Generally Safe</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="mime-reference">
      <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input
            type="text"
            placeholder="Search extensions (e.g., .exe)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Critical', 'High', 'Medium', 'Safe'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Extension</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Danger Level</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filteredTypes.length > 0 ? (
              filteredTypes.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-lg text-slate-900">
                    {item.ext}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                      </svg>
                      <span className="text-sm text-slate-800 font-medium">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRiskBadge(item.risk)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 min-w-[300px]">
                    {item.desc}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No extensions found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
