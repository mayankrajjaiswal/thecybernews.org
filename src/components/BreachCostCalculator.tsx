import React, { useState } from 'react';

const INDUSTRIES = [
  { id: 'healthcare', label: 'Healthcare & Medical', costPerRecord: 164 },
  { id: 'financial', label: 'Financial Services', costPerRecord: 145 },
  { id: 'tech', label: 'Technology / Software', costPerRecord: 133 },
  { id: 'retail', label: 'Retail & E-commerce', costPerRecord: 105 },
  { id: 'public', label: 'Public Sector / Govt', costPerRecord: 85 },
  { id: 'other', label: 'Other / General Business', costPerRecord: 115 }
];

export default function BreachCostCalculator() {
  const [industry, setIndustry] = useState(INDUSTRIES[5].id);
  const [records, setRecords] = useState(1000);
  const [downtimeDays, setDowntimeDays] = useState(3);
  const [dailyRevenue, setDailyRevenue] = useState(2000);
  const [hasCyberInsurance, setHasCyberInsurance] = useState(false);

  const selectedIndustry = INDUSTRIES.find(i => i.id === industry) || INDUSTRIES[5];

  // Calculations (Simplified estimates for small businesses)
  const dataLossCost = records * selectedIndustry.costPerRecord;
  const downtimeCost = downtimeDays * dailyRevenue;
  
  // Incident Response (Forensics, Lawyers, PR) - Base fee + scale
  const incidentResponseBase = 15000;
  const incidentResponseCost = incidentResponseBase + (records * 5); 

  // Regulatory Fines (Assume 10% of data loss cost as a rough heuristic for small businesses without extreme compliance)
  let complianceFines = dataLossCost * 0.10;
  if (industry === 'healthcare' || industry === 'financial') {
    complianceFines = dataLossCost * 0.25; // Heavily regulated
  }

  let totalGrossCost = dataLossCost + downtimeCost + incidentResponseCost + complianceFines;
  let insuranceCoverage = 0;

  if (hasCyberInsurance) {
    // Assume a standard small business policy covers up to $1M with a $10k deductible
    const deductible = 10000;
    const maxCoverage = 1000000;
    if (totalGrossCost > deductible) {
      insuranceCoverage = Math.min(totalGrossCost - deductible, maxCoverage);
    }
  }

  const netCost = totalGrossCost - insuranceCoverage;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row" data-testid="breach-calculator">
      
      {/* Controls Sidebar */}
      <div className="w-full lg:w-1/3 bg-slate-50 border-r border-slate-200 p-6 md:p-8 flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Business Profile</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Primary Industry</label>
            <select 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              data-testid="industry-select"
            >
              {INDUSTRIES.map(ind => (
                <option key={ind.id} value={ind.id}>{ind.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
              <span>Customer Records Stored</span>
              <span className="text-indigo-600">{records.toLocaleString()}</span>
            </label>
            <input 
              type="range" 
              min="100" max="50000" step="100"
              value={records}
              onChange={(e) => setRecords(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              data-testid="records-slider"
            />
            <p className="text-xs text-slate-500 mt-1">Emails, passwords, credit cards, or medical data.</p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Ransomware & Downtime</h3>
            
            <div className="mb-4">
              <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span>Days Offline</span>
                <span className="text-indigo-600">{downtimeDays} Days</span>
              </label>
              <input 
                type="range" 
                min="0" max="14" step="1"
                value={downtimeDays}
                onChange={(e) => setDowntimeDays(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Daily Revenue ($)</label>
              <input 
                type="number" 
                min="0" step="100"
                value={dailyRevenue}
                onChange={(e) => setDailyRevenue(parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                data-testid="revenue-input"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
             <label className="flex items-start gap-3 cursor-pointer p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors">
              <input 
                type="checkbox" 
                checked={hasCyberInsurance} 
                onChange={(e) => setHasCyberInsurance(e.target.checked)} 
                className="mt-1 w-5 h-5 text-indigo-600 focus:ring-indigo-500 rounded" 
                data-testid="insurance-toggle"
              />
              <div>
                <span className="text-sm font-bold text-indigo-900 block">I have Cyber Liability Insurance</span>
                <span className="text-xs text-indigo-700">Assuming standard $1M policy w/ $10k deductible.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Results Dashboard */}
      <div className="w-full lg:w-2/3 p-6 md:p-8 flex flex-col bg-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Estimated Breach Impact</h2>
        
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white mb-8 relative overflow-hidden shadow-lg">
          <div className="relative z-10 text-center">
            <span className="text-slate-300 font-bold tracking-wider uppercase text-sm mb-2 block">Total Financial Exposure</span>
            <div className="text-5xl md:text-6xl font-extrabold text-red-400 tracking-tight" data-testid="total-cost">
              {formatCurrency(netCost)}
            </div>
            {hasCyberInsurance && insuranceCoverage > 0 && (
              <p className="mt-3 text-emerald-400 text-sm font-medium">
                Insurance covered {formatCurrency(insuranceCoverage)}. Your out-of-pocket is {formatCurrency(netCost)}.
              </p>
            )}
          </div>
          {/* Abstract background shape */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-slate-800 rounded-full blur-3xl opacity-50 z-0"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-red-900 rounded-full blur-3xl opacity-20 z-0"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <div className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
              <h3 className="font-bold text-slate-900">Data Loss & Notification</h3>
            </div>
            <div className="text-2xl font-extrabold text-slate-700 mb-1">{formatCurrency(dataLossCost)}</div>
            <p className="text-xs text-slate-500">Legal requirement to notify {records.toLocaleString()} users, provide credit monitoring, and manage lost trust.</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
             <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">2</div>
              <h3 className="font-bold text-slate-900">Business Downtime</h3>
            </div>
            <div className="text-2xl font-extrabold text-slate-700 mb-1">{formatCurrency(downtimeCost)}</div>
            <p className="text-xs text-slate-500">{downtimeDays} days of lost revenue at {formatCurrency(dailyRevenue)}/day due to system lockdown or ransomware.</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</div>
              <h3 className="font-bold text-slate-900">Incident Response</h3>
            </div>
            <div className="text-2xl font-extrabold text-slate-700 mb-1">{formatCurrency(incidentResponseCost)}</div>
            <p className="text-xs text-slate-500">Emergency IT forensics, hiring outside breach lawyers, and PR crisis management.</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">4</div>
              <h3 className="font-bold text-slate-900">Regulatory Fines</h3>
            </div>
            <div className="text-2xl font-extrabold text-slate-700 mb-1">{formatCurrency(complianceFines)}</div>
            <p className="text-xs text-slate-500">Penalties for failing to secure PII (Higher for {industry === 'healthcare' || industry === 'financial' ? 'your regulated industry' : 'regulated industries'}).</p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          Estimates are based on aggregated global averages (e.g. IBM Cost of a Data Breach Report) and are intended for educational purposes, not strict financial forecasting.
        </div>
      </div>
    </div>
  );
}
