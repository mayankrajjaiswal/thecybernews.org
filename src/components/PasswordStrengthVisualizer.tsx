import React, { useState, useEffect } from 'react';

// Calculates password entropy and estimated crack time
const calculateStrength = (password: string) => {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) {
    return { entropy: 0, timeToCrack: 'Instant', strength: 'Very Weak', color: 'bg-slate-200' };
  }

  // Entropy = L * log2(R)
  const entropy = password.length * Math.log2(poolSize);
  
  // Assume a modern cracking rig can try 100 billion hashes per second (10^11)
  const combinations = Math.pow(2, entropy);
  const secondsToCrack = combinations / 100000000000;

  let timeString = '';
  if (secondsToCrack < 1) timeString = 'Instant';
  else if (secondsToCrack < 60) timeString = `${Math.round(secondsToCrack)} seconds`;
  else if (secondsToCrack < 3600) timeString = `${Math.round(secondsToCrack / 60)} minutes`;
  else if (secondsToCrack < 86400) timeString = `${Math.round(secondsToCrack / 3600)} hours`;
  else if (secondsToCrack < 31536000) timeString = `${Math.round(secondsToCrack / 86400)} days`;
  else if (secondsToCrack < 3153600000) timeString = `${Math.round(secondsToCrack / 31536000)} years`;
  else timeString = 'Centuries';

  let strength = 'Very Weak';
  let color = 'bg-red-500';

  if (entropy > 80) {
    strength = 'Excellent';
    color = 'bg-emerald-500';
  } else if (entropy > 60) {
    strength = 'Good';
    color = 'bg-blue-500';
  } else if (entropy > 40) {
    strength = 'Fair';
    color = 'bg-yellow-500';
  } else if (entropy > 25) {
    strength = 'Weak';
    color = 'bg-orange-500';
  }

  return { entropy: Math.round(entropy), timeToCrack: timeString, strength, color };
};

export default function PasswordStrengthVisualizer() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(calculateStrength(''));
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setResult(calculateStrength(password));
  }, [password]);

  const entropyPercentage = Math.min(100, Math.max(0, (result.entropy / 100) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" data-testid="password-visualizer">
      <div className="p-6 md:p-8 bg-slate-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Test Your Password</h2>
        <p className="text-slate-300 mb-6 text-sm">
          Type a password below to see how long it would take a hacker to guess it using a modern computer. 
          <strong> None of this data leaves your browser.</strong>
        </p>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Start typing..."
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-4 text-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            data-testid="password-input"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-slate-50">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Strength Score</span>
          <span className={`text-xl font-bold ${result.color.replace('bg-', 'text-')}`}>
            {result.strength}
          </span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-3 mb-8 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${result.color}`} 
            style={{ width: `${entropyPercentage}%` }}
            data-testid="strength-bar"
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Time to Crack</div>
            <div className="text-3xl font-extrabold text-slate-900" data-testid="crack-time">
              {password.length === 0 ? '-' : result.timeToCrack}
            </div>
            <p className="text-xs text-slate-500 mt-2">Assuming 100 billion guesses per second</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Entropy</div>
            <div className="text-3xl font-extrabold text-slate-900">
              {password.length === 0 ? '0' : result.entropy} <span className="text-lg text-slate-400 font-normal">bits</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Mathematical complexity score</p>
          </div>
        </div>

        {password.length > 0 && result.entropy < 60 && (
          <div className="mt-8 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800 text-sm rounded-r-lg">
            <strong>Pro Tip:</strong> Length beats complexity. Instead of using a complicated password like <code>P@ssw0rd1!</code>, try using a long "passphrase" like <code>CorrectHorseBatteryStaple</code>. It is easier to remember and mathematically much harder to crack.
          </div>
        )}
      </div>
    </div>
  );
}
