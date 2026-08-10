import React, { useState } from 'react';

// Very basic regex-based parser for educational purposes
const parseHeaders = (rawHeaders: string) => {
  const result = {
    spf: { status: 'Unknown', details: '' },
    dkim: { status: 'Unknown', details: '' },
    dmarc: { status: 'Unknown', details: '' },
    from: 'Unknown',
    returnPath: 'Unknown'
  };

  // Find From
  const fromMatch = rawHeaders.match(/^From:\s*(.+)$/im);
  if (fromMatch) result.from = fromMatch[1].trim();

  // Find Return-Path
  const returnPathMatch = rawHeaders.match(/^Return-Path:\s*<?([^>\s]+)>?$/im);
  if (returnPathMatch) result.returnPath = returnPathMatch[1].trim();

  // Find Authentication-Results
  const authResultsMatch = rawHeaders.match(/Authentication-Results:(.*?)(?=^\w|$)/ims);
  if (authResultsMatch) {
    const authString = authResultsMatch[1];
    
    // SPF
    if (authString.match(/spf=pass/i)) result.spf = { status: 'Pass', details: 'The sending server is authorized to send emails on behalf of this domain.' };
    else if (authString.match(/spf=fail/i)) result.spf = { status: 'Fail', details: 'The sending server is NOT authorized. This is likely a forged email.' };
    else if (authString.match(/spf=(softfail|neutral)/i)) result.spf = { status: 'Warning', details: 'The domain does not have strict SPF rules, or it was forwarded.' };

    // DKIM
    if (authString.match(/dkim=pass/i)) result.dkim = { status: 'Pass', details: 'The email was cryptographically signed and has not been tampered with.' };
    else if (authString.match(/dkim=fail/i)) result.dkim = { status: 'Fail', details: 'The cryptographic signature is invalid. The email may have been altered.' };

    // DMARC
    if (authString.match(/dmarc=pass/i)) result.dmarc = { status: 'Pass', details: 'The email aligns with the domain\'s strict anti-spoofing policies.' };
    else if (authString.match(/dmarc=fail/i)) result.dmarc = { status: 'Fail', details: 'The email failed anti-spoofing checks.' };
  }

  // Fallback checks if Authentication-Results header is missing but individual Received-SPF exists
  if (result.spf.status === 'Unknown') {
    const receivedSpfMatch = rawHeaders.match(/^Received-SPF:\s*(pass|fail|softfail|neutral)/im);
    if (receivedSpfMatch) {
      const s = receivedSpfMatch[1].toLowerCase();
      if (s === 'pass') result.spf = { status: 'Pass', details: 'The sending server is authorized.' };
      else if (s === 'fail') result.spf = { status: 'Fail', details: 'The sending server is NOT authorized.' };
      else result.spf = { status: 'Warning', details: 'SPF check was inconclusive.' };
    }
  }

  return result;
};

export default function EmailHeaderAnalyzer() {
  const [headers, setHeaders] = useState('');
  const [analysis, setAnalysis] = useState<ReturnType<typeof parseHeaders> | null>(null);

  const handleAnalyze = () => {
    if (!headers.trim()) return;
    setAnalysis(parseHeaders(headers));
  };

  const loadExample = (type: 'pass' | 'fail') => {
    if (type === 'pass') {
      setHeaders(`Return-Path: <bounces+1234@legit-bank.com>
Received: from mail-server.legit-bank.com (mail-server.legit-bank.com. [192.168.1.1])
Authentication-Results: mx.google.com;
       dkim=pass header.i=@legit-bank.com header.s=s1 header.b=AbCdEf;
       spf=pass (google.com: domain of bounces+1234@legit-bank.com designates 192.168.1.1 as permitted sender);
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=legit-bank.com
From: "Security Team" <security@legit-bank.com>
To: customer@gmail.com
Subject: Account Alert`);
    } else {
      setHeaders(`Return-Path: <hacker@russian-server.ru>
Received: from bad-server.net (bad-server.net. [10.0.0.1])
Authentication-Results: mx.google.com;
       spf=fail (google.com: domain of hacker@russian-server.ru does not designate 10.0.0.1 as permitted sender);
       dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=paypal.com
From: "PayPal Support" <support@paypal.com>
To: customer@gmail.com
Subject: URGENT: Account Suspended`);
    }
    setAnalysis(null);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'Pass') return <span data-testid="status-pass" className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded border border-emerald-300">PASS</span>;
    if (status === 'Fail') return <span data-testid="status-fail" className="inline-flex items-center justify-center bg-red-100 text-red-700 font-bold px-3 py-1 rounded border border-red-300">FAIL</span>;
    if (status === 'Warning') return <span data-testid="status-warning" className="inline-flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded border border-yellow-300">WARNING</span>;
    return <span data-testid="status-unknown" className="inline-flex items-center justify-center bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded border border-slate-300">UNKNOWN</span>;
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" data-testid="header-analyzer">
      
      {/* Input Area */}
      <div className="w-full md:w-1/2 p-6 bg-slate-900 text-white flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Paste Email Headers</h2>
        <p className="text-slate-300 mb-4 text-sm">
          Paste the raw headers of a suspicious email below. <strong>This tool runs entirely in your browser; your email data is never sent to our servers.</strong>
        </p>
        
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          className="flex-grow w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-xs focus:outline-none focus:border-indigo-500 mb-4 h-64 md:h-auto"
          placeholder="Return-Path: <...>\nReceived: from ...\nAuthentication-Results: ...\nFrom: ..."
          data-testid="header-input"
        ></textarea>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleAnalyze}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Analyze Headers
          </button>
          <div className="flex gap-2">
            <button onClick={() => loadExample('pass')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 px-3 rounded-lg border border-slate-700 transition-colors">
              Load Legit
            </button>
            <button onClick={() => loadExample('fail')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 px-3 rounded-lg border border-slate-700 transition-colors">
              Load Scam
            </button>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-50 flex flex-col" data-testid="header-results">
        {!analysis ? (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <p className="font-medium text-center px-8">Paste email headers and click analyze to see the authentication results.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Analysis Results</h3>
            
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Visual "From" Address</span>
                <span className="font-mono text-slate-900 break-all">{analysis.from}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Hidden "Return-Path"</span>
                <span className={`font-mono break-all ${analysis.returnPath.includes(analysis.from.split('@')[1] || '---') ? 'text-slate-900' : 'text-red-600 font-bold'}`}>
                  {analysis.returnPath}
                </span>
                {!analysis.returnPath.includes(analysis.from.split('@')[1] || '---') && analysis.returnPath !== 'Unknown' && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Mismatch detected! The visible sender does not match the hidden sender.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className="pt-1"><StatusIcon status={analysis.spf.status} /></div>
                <div>
                  <h4 className="font-bold text-slate-900">SPF (Sender Policy Framework)</h4>
                  <p className="text-sm text-slate-600 mt-1">{analysis.spf.details || 'No SPF record found in headers.'}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className="pt-1"><StatusIcon status={analysis.dkim.status} /></div>
                <div>
                  <h4 className="font-bold text-slate-900">DKIM (DomainKeys Identified Mail)</h4>
                  <p className="text-sm text-slate-600 mt-1">{analysis.dkim.details || 'No DKIM signature found in headers.'}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
                <div className="pt-1"><StatusIcon status={analysis.dmarc.status} /></div>
                <div>
                  <h4 className="font-bold text-slate-900">DMARC (Domain-based Message Authentication)</h4>
                  <p className="text-sm text-slate-600 mt-1">{analysis.dmarc.details || 'No DMARC policy evaluated in headers.'}</p>
                </div>
              </div>
            </div>

            {analysis.spf.status === 'Fail' && (
               <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                 <p className="text-red-800 font-bold text-sm">
                   🚨 This email failed authentication checks. It is highly likely that the sender's address was forged (spoofed) by a scammer. Do not click any links or download attachments.
                 </p>
               </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
