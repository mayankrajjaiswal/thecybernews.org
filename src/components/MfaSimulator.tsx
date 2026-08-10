import React, { useState, useEffect } from 'react';

export default function MfaSimulator() {
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  const [code, setCode] = useState('123 456');

  // A very simplified hash simulation for educational visual purposes only.
  // Real TOTP uses HMAC-SHA1 which is too heavy to implement from scratch here without an external library.
  // This generates a consistent 6 digit code based on the secret string and current 30s epoch window.
  const generateMockCode = (secretStr: string, epochWindow: number) => {
    let hash = 0;
    // Add a strong multiplier to epochWindow so that small changes produce wildly different hashes
    const input = secretStr + (epochWindow * 99991).toString();
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Ensure positive 6 digits
    const strHash = Math.abs(hash).toString().padEnd(6, '0');
    return `${strHash.slice(0, 3)} ${strHash.slice(3, 6)}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      const epochWindow = Math.floor(now / 30);
      
      setCurrentTime(now);
      setTimeRemaining(remaining);
      setCode(generateMockCode(secret, epochWindow));
    }, 1000);
    
    // Initial run
    const now = Math.floor(Date.now() / 1000);
    setTimeRemaining(30 - (now % 30));
    setCode(generateMockCode(secret, Math.floor(now / 30)));

    return () => clearInterval(timer);
  }, [secret]);

  const progressPercentage = (timeRemaining / 30) * 100;
  
  // Color the progress bar based on time remaining
  let barColor = 'bg-emerald-500';
  if (timeRemaining <= 10) barColor = 'bg-yellow-500';
  if (timeRemaining <= 5) barColor = 'bg-red-500';

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="mfa-simulator">
      
      <div className="bg-slate-900 p-6 md:p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">How does Google Authenticator work?</h2>
        <p className="text-slate-300 text-sm">
          Authenticator apps do not need an internet connection. They use a simple mathematical formula combining a <strong>Secret Key</strong> (that you got when scanning the QR code) with the <strong>Current Time</strong>.
        </p>
      </div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center bg-slate-50 border-b border-slate-200">
        
        {/* The Math Visualizer */}
        <div className="flex-grow flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm w-full md:w-auto">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Secret Key</div>
            <input 
              type="text" 
              value={secret}
              onChange={(e) => setSecret(e.target.value.toUpperCase().replace(/[^A-Z2-7]/g, '').substring(0, 16))}
              className="font-mono text-lg font-bold text-slate-900 focus:outline-none border-b-2 border-indigo-200 focus:border-indigo-600 w-48 text-center md:text-left bg-transparent"
              data-testid="secret-input"
            />
          </div>

          <div className="text-3xl font-black text-slate-300">+</div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm w-full md:w-auto">
             <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Current Time Window</div>
             <div className="font-mono text-lg font-bold text-slate-900" data-testid="time-window">
               {Math.floor(currentTime / 30)}
             </div>
          </div>

          <div className="text-3xl font-black text-slate-300">=</div>

          {/* The Phone App */}
          <div className="w-64 bg-slate-900 rounded-[2rem] border-[6px] border-slate-800 p-4 relative shadow-xl mx-auto flex-shrink-0">
            <div className="w-16 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2"></div>
            
            <div className="bg-slate-100 rounded-xl p-4 mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 text-sm">DemoBank</span>
              </div>
              <div className="text-3xl font-mono font-black text-indigo-600 tracking-widest text-center my-4" data-testid="mfa-code">
                {code}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-grow bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
                    style={{ width: `${progressPercentage}%` }}
                    data-testid="progress-bar"
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-500 font-mono w-4">{timeRemaining}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="p-6 md:p-8 bg-white">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Try it yourself:</h3>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
            <p>Change the <strong>Secret Key</strong> above. Notice how the 6-digit code on the phone changes instantly.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
            <p>Wait for the timer to hit 0. The <strong>Time Window</strong> number will increase by 1, and a brand new 6-digit code will be generated.</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <p>Because your bank knows your Secret Key, they can run the exact same math equation on their servers. If the code you type in matches the code they generate, they know it's you!</p>
          </li>
        </ul>
      </div>

    </div>
  );
}
