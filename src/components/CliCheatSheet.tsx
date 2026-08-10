import React, { useState } from 'react';

export default function CliCheatSheet() {
  const [activeCategory, setActiveCategory] = useState('Network Diagnostics');

  const cheatSheetData = {
    'Network Diagnostics': [
      { cmd: 'ping <target>', desc: 'Tests connectivity to a target by sending ICMP echo requests.' },
      { cmd: 'tracert <target>', desc: 'Shows the path a packet takes to reach a destination (Windows). Use "traceroute" on Linux/Mac.' },
      { cmd: 'nslookup <domain>', desc: 'Queries DNS servers to find the IP address of a domain name.' },
      { cmd: 'dig <domain>', desc: 'A more flexible DNS lookup tool, mostly used on Linux/Mac.' },
      { cmd: 'netstat -ano', desc: 'Displays all active network connections and listening ports.' },
      { cmd: 'ipconfig /all', desc: 'Displays detailed network configuration for Windows. Use "ifconfig" or "ip a" on Linux.' }
    ],
    'Traffic Analysis': [
      { cmd: 'wireshark', desc: 'A GUI-based packet sniffer. It captures and displays network traffic in real time.' },
      { cmd: 'tcpdump -i any', desc: 'A command-line packet analyzer. Captures traffic on all interfaces.' },
      { cmd: 'nmap -sV <target>', desc: 'A network mapper. Probes open ports and attempts to determine the service versions running on them.' }
    ],
    'OS & Scripting': [
      { cmd: 'grep "pattern" <file>', desc: 'Searches for a specific pattern or string of text within a file.' },
      { cmd: 'curl -I <url>', desc: 'Fetches the HTTP headers from a URL without downloading the body.' },
      { cmd: 'ls -la', desc: 'Lists all files in a directory, including hidden files (Linux/Mac). Use "dir" on Windows.' },
      { cmd: 'chmod 755 <file>', desc: 'Changes file permissions. (Linux/Mac)' },
      { cmd: 'Get-Process', desc: 'Lists all running processes (PowerShell).' }
    ]
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8" data-testid="cli-cheat-sheet">
      <div className="flex flex-wrap gap-2 mb-8">
        {Object.keys(cheatSheetData).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeCategory === category 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider rounded-tl-lg">Command</th>
              <th className="px-4 py-3 bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider rounded-tr-lg">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {cheatSheetData[activeCategory].map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-mono font-bold text-indigo-700">
                  {item.cmd}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {item.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
