import React, { useState } from 'react';

const QUESTIONS = [
  {
    id: 'q1',
    text: 'How do you currently manage your passwords?',
    options: [
      { text: 'I use a dedicated Password Manager (e.g., Bitwarden, 1Password).', score: 10, recommendation: '' },
      { text: 'I let my browser or phone save them (e.g., Chrome, iCloud).', score: 7, recommendation: 'Browser password managers are okay, but a dedicated password manager is much safer if your device is compromised.' },
      { text: 'I use a few variations of the same password for everything.', score: 0, recommendation: 'Reusing passwords means if one site is hacked, all your accounts are at risk. Start using a Password Manager.' },
      { text: 'I write them down in a notebook.', score: 3, recommendation: 'Writing passwords down is better than reusing them, but terrible if you lose the notebook. Switch to a digital Password Manager.' }
    ]
  },
  {
    id: 'q2',
    text: 'Do you have Multi-Factor Authentication (MFA/2FA) enabled?',
    options: [
      { text: 'Yes, on all important accounts using an Authenticator App or Security Key.', score: 10, recommendation: '' },
      { text: 'Yes, but I mostly use SMS/Text messages for the codes.', score: 6, recommendation: 'SMS codes can be intercepted by SIM-swapping. Try switching to an Authenticator App (like Google Authenticator).' },
      { text: 'Only when a website forces me to use it.', score: 3, recommendation: 'You should actively turn on MFA for your bank, email, and social media. It stops 99% of automated hacks.' },
      { text: 'No, it is too annoying.', score: 0, recommendation: 'MFA is the single most important security feature you can use. Please enable it on your primary email immediately.' }
    ]
  },
  {
    id: 'q3',
    text: 'How do you handle software updates on your phone and computer?',
    options: [
      { text: 'They are set to update automatically in the background.', score: 10, recommendation: '' },
      { text: 'I install them manually within a few days of being notified.', score: 8, recommendation: 'Consider turning on Automatic Updates so you never forget.' },
      { text: 'I ignore them for months until I am forced to update.', score: 0, recommendation: 'Updates usually contain critical security patches. Ignoring them leaves you vulnerable to known hacks.' }
    ]
  },
  {
    id: 'q4',
    text: 'When connecting to public Wi-Fi (like at a coffee shop or airport):',
    options: [
      { text: 'I never connect to public Wi-Fi, or I always use a trusted VPN.', score: 10, recommendation: '' },
      { text: 'I connect, but only browse normal sites; I never log into my bank.', score: 5, recommendation: 'Even normal browsing on public Wi-Fi can expose your session data. Consider using a VPN.' },
      { text: 'I connect and use it normally without thinking about it.', score: 0, recommendation: 'Public Wi-Fi is highly insecure. Hackers on the same network can easily snoop on your traffic.' }
    ]
  },
  {
    id: 'q5',
    text: 'Have you changed the default password on your home Wi-Fi router?',
    options: [
      { text: 'Yes, I changed both the Wi-Fi password and the Admin login password.', score: 10, recommendation: '' },
      { text: 'I changed the Wi-Fi password, but the Admin login is still the default.', score: 4, recommendation: 'If your admin password is still "admin", anyone who connects to your Wi-Fi can take over your router.' },
      { text: 'No, I use the password printed on the sticker on the back.', score: 0, recommendation: 'Default passwords can often be looked up online by hackers. You must change your router\'s admin and network passwords.' }
    ]
  }
];

export default function CyberHealthAudit() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ id: string, score: number, recommendation: string }[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (score: number, recommendation: string) => {
    const newAnswers = [...answers, { id: QUESTIONS[currentQuestion].id, score, recommendation }];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetAudit = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
    const maxScore = QUESTIONS.length * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let scoreColor = 'text-green-600';
    let message = 'Great job! Your cyber hygiene is excellent.';
    if (percentage < 50) {
      scoreColor = 'text-red-600';
      message = 'High Risk. You need to make some immediate changes.';
    } else if (percentage < 80) {
      scoreColor = 'text-yellow-600';
      message = 'Not bad, but there are some critical gaps to fill.';
    }

    const improvements = answers.filter(a => a.recommendation !== '');

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8" data-testid="audit-results">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Cyber Health Score</h2>
          <div className={`text-6xl font-extrabold ${scoreColor} mb-4`}>{percentage}%</div>
          <p className="text-lg text-slate-600">{message}</p>
        </div>

        {improvements.length > 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Your Custom Action Plan:</h3>
            <ul className="space-y-4">
              {improvements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-slate-700">{item.recommendation}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center">
            <p className="text-green-800 font-bold">You are doing everything right! Keep up the good work.</p>
          </div>
        )}

        <div className="text-center">
          <button 
            onClick={resetAudit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Take Audit Again
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="health-audit">
      <div className="bg-indigo-50 border-b border-indigo-100 p-6">
        <div className="flex justify-between text-sm font-bold text-indigo-800 mb-2">
          <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-indigo-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{question.text}</h2>
        
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt.score, opt.recommendation)}
              className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-slate-700 font-medium"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
