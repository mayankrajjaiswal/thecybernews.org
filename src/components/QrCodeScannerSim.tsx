import React, { useState } from 'react';

const SCENARIOS = [
  {
    id: 1,
    title: 'The Parking Meter',
    imageBg: 'bg-slate-700',
    description: 'You are trying to pay for parking. The meter is broken, but there is a sticker slapped over the screen that says "Pay Here via QR Code."',
    scannedUrl: 'https://pay.parklng-portal-usa.com/checkout', // Typo in parking
    isSafe: false,
    explanation: 'Scammers stick fake QR codes over real ones on parking meters. Look closely at the URL: "parklng" is spelled with an "L" instead of an "i". If you opened this, it would steal your credit card.'
  },
  {
    id: 2,
    title: 'The Restaurant Menu',
    imageBg: 'bg-orange-800',
    description: 'You sit down at a cafe. There is a plastic stand on the table with a QR code engraved into it that says "Scan for Menu".',
    scannedUrl: 'https://menu.local-cafe-demo.com/pdf/spring',
    isSafe: true,
    explanation: 'This is a safe URL. It is engraved into the plastic (not a paper sticker on top), and the URL matches the expected name of the cafe.'
  },
  {
    id: 3,
    title: 'The "Missed Delivery" Note',
    imageBg: 'bg-yellow-600',
    description: 'You find a yellow slip on your front door. "Sorry we missed you! Scan here to reschedule delivery or your package will be returned to sender."',
    scannedUrl: 'https://fedex.com.reschedule-delivery-id881.net/auth',
    isSafe: false,
    explanation: 'Classic phishing. The real root domain is "reschedule-delivery-id881.net", NOT fedex.com. The urgency ("will be returned") is a massive red flag.'
  }
];

export default function QrCodeScannerSim() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'scanned' | 'result'>('idle');
  const [userChoice, setUserChoice] = useState<'open' | 'cancel' | null>(null);

  const scenario = SCENARIOS[currentScenario];

  const handleScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('scanned');
    }, 1500);
  };

  const handleChoice = (choice: 'open' | 'cancel') => {
    setUserChoice(choice);
    setScanState('result');
  };

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setCurrentScenario(0);
    }
    setScanState('idle');
    setUserChoice(null);
  };

  const isCorrect = (scenario.isSafe && userChoice === 'open') || (!scenario.isSafe && userChoice === 'cancel');

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" data-testid="qr-sandbox">
      
      {/* The Physical World (Left Side) */}
      <div className={`w-full md:w-1/2 p-8 ${scenario.imageBg} text-white flex flex-col items-center justify-center relative min-h-[400px] transition-colors duration-500`}>
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
          Scenario {currentScenario + 1} of {SCENARIOS.length}
        </div>
        
        <h3 className="text-3xl font-extrabold mb-4 text-center">{scenario.title}</h3>
        <p className="text-center mb-8 text-white/90 max-w-sm">{scenario.description}</p>
        
        <div className="bg-white p-4 rounded-xl shadow-lg relative">
          {/* Fake QR Code Pattern */}
          <div className="w-32 h-32 bg-white relative">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-4 border-black rounded-sm flex items-center justify-center"><div className="w-4 h-4 bg-black"></div></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-4 border-black rounded-sm flex items-center justify-center"><div className="w-4 h-4 bg-black"></div></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-4 border-black rounded-sm flex items-center justify-center"><div className="w-4 h-4 bg-black"></div></div>
            {/* Random blocks */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-black"></div>
            <div className="absolute top-16 left-4 w-4 h-4 bg-black"></div>
            <div className="absolute top-4 left-16 w-4 h-4 bg-black"></div>
            <div className="absolute bottom-10 right-4 w-4 h-4 bg-black"></div>
            <div className="absolute bottom-4 right-16 w-8 h-4 bg-black"></div>
            <div className="absolute top-12 right-12 w-6 h-6 bg-black rounded-full"></div>
          </div>

          {/* Scanner Overlay */}
          {scanState === 'scanning' && (
            <div className="absolute inset-0 bg-blue-500/20 rounded-xl overflow-hidden pointer-events-none">
              <div className="w-full h-1 bg-blue-400 absolute animate-[scan_1.5s_ease-in-out_infinite] shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]"></div>
            </div>
          )}
        </div>

        {scanState === 'idle' && (
          <button 
            onClick={handleScan}
            className="mt-8 bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
            data-testid="scan-btn"
          >
            Pull out phone & Scan
          </button>
        )}
      </div>

      {/* The Digital World (Right Side) */}
      <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-50 flex flex-col justify-center min-h-[400px]">
        
        {scanState === 'idle' || scanState === 'scanning' ? (
          <div className="text-center text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            <p className="font-medium text-lg">Waiting for scan...</p>
          </div>
        ) : scanState === 'scanned' ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform transition-all animate-fade-in">
            <div className="bg-slate-100 p-4 border-b border-slate-200 text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">QR Code Detected</p>
              <p className="font-mono text-sm md:text-base text-blue-600 font-bold break-all px-2" data-testid="scanned-url">
                {scenario.scannedUrl}
              </p>
            </div>
            <div className="p-6">
              <p className="text-center text-slate-700 font-medium mb-6">Do you want to open this link in your browser?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleChoice('cancel')}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 px-4 rounded-xl transition-colors"
                  data-testid="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleChoice('open')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  data-testid="open-btn"
                >
                  Open Link
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full animate-fade-in" data-testid="scenario-result">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
              {isCorrect ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              )}
              <h3 className={`text-xl font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                {isCorrect ? 'Good Catch!' : 'You got phished!'}
              </h3>
            </div>
            
            <p className="text-slate-700 text-lg leading-relaxed mb-8 flex-grow">
              {scenario.explanation}
            </p>
            
            <button 
              onClick={nextScenario}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-colors mt-auto"
            >
              {currentScenario < SCENARIOS.length - 1 ? 'Next Scenario' : 'Start Over'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
