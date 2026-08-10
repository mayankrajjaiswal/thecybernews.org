import React, { useState } from 'react';

type NodeId = string;

interface DecisionNode {
  id: NodeId;
  question: string;
  options: {
    label: string;
    nextNode: NodeId;
    color?: 'blue' | 'red' | 'green';
  }[];
  isTerminal?: boolean;
  resultTitle?: string;
  resultType?: 'safe' | 'scam' | 'warning';
  resultDesc?: string;
}

const TREE: Record<NodeId, DecisionNode> = {
  start: {
    id: 'start',
    question: 'How did this person or message contact you?',
    options: [
      { label: 'They called me on the phone', nextNode: 'phone_1' },
      { label: 'I got a Text Message (SMS)', nextNode: 'text_1' },
      { label: 'I got an Email', nextNode: 'email_1' },
      { label: 'A pop-up appeared on my computer screen', nextNode: 'popup_1' }
    ]
  },
  
  // POP-UP PATH
  popup_1: {
    id: 'popup_1',
    question: 'Does the pop-up say your computer is infected with a virus and provide a phone number to call for tech support?',
    options: [
      { label: 'Yes, it says I need to call Microsoft / Apple immediately.', nextNode: 'scam_tech_support', color: 'red' },
      { label: 'No, it is just an advertisement.', nextNode: 'safe_ad', color: 'green' }
    ]
  },

  // TEXT MESSAGE PATH
  text_1: {
    id: 'text_1',
    question: 'What is the text message about?',
    options: [
      { label: 'A package delivery issue (USPS/FedEx/UPS)', nextNode: 'scam_delivery' },
      { label: 'My bank account is locked or has a fraudulent charge', nextNode: 'bank_1' },
      { label: 'A random "Hi, is this John?" or wrong number text', nextNode: 'scam_pig_butchering' }
    ]
  },

  // PHONE PATH
  phone_1: {
    id: 'phone_1',
    question: 'Who are they claiming to be?',
    options: [
      { label: 'The Government (IRS, Social Security, Police)', nextNode: 'gov_1' },
      { label: 'My Bank or Credit Card Company', nextNode: 'bank_1' },
      { label: 'Amazon, Apple, or Microsoft Tech Support', nextNode: 'tech_1' },
      { label: 'A family member in trouble (Grandchild)', nextNode: 'family_1' }
    ]
  },

  gov_1: {
    id: 'gov_1',
    question: 'Are they threatening to arrest you, suspend your Social Security number, or demanding immediate payment?',
    options: [
      { label: 'Yes', nextNode: 'scam_gov', color: 'red' },
      { label: 'No, but they want my Social Security Number', nextNode: 'scam_gov', color: 'red' }
    ]
  },

  bank_1: {
    id: 'bank_1',
    question: 'Are they asking you to read them a 6-digit code sent to your phone, or asking for your password?',
    options: [
      { label: 'Yes, they need the code to "verify my identity" or "cancel a charge".', nextNode: 'scam_bank_code', color: 'red' },
      { label: 'No, they just told me to log into my app normally to check my balance.', nextNode: 'safe_bank', color: 'green' }
    ]
  },

  tech_1: {
    id: 'tech_1',
    question: 'Are they asking to remotely control your computer (using AnyDesk, TeamViewer) or asking you to buy Gift Cards?',
    options: [
      { label: 'Yes, they want remote access or Gift Cards.', nextNode: 'scam_tech_support', color: 'red' },
      { label: 'No.', nextNode: 'warning_verify' }
    ]
  },

  family_1: {
    id: 'family_1',
    question: 'Are they saying they are in jail or the hospital, and begging you NOT to tell their parents, and demanding you send money via Zelle, CashApp, or Wire Transfer?',
    options: [
      { label: 'Yes, it sounds exactly like that.', nextNode: 'scam_grandparent', color: 'red' },
      { label: 'No.', nextNode: 'warning_verify' }
    ]
  },

  // TERMINAL NODES
  scam_tech_support: {
    id: 'scam_tech_support',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'scam',
    resultTitle: 'THIS IS A TECH SUPPORT SCAM. HANG UP IMMEDIATELY.',
    resultDesc: 'Microsoft, Apple, and Amazon will NEVER call you unprompted. They will NEVER put a phone number on your screen. They will NEVER ask you to buy Gift Cards. Hang up the phone. If your screen is locked by a pop-up, forcefully restart your computer.'
  },
  scam_delivery: {
    id: 'scam_delivery',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'scam',
    resultTitle: 'THIS IS A SMISHING (TEXT) SCAM. DO NOT CLICK THE LINK.',
    resultDesc: 'Scammers send millions of fake USPS/FedEx texts a day. The link will take you to a fake website that asks for a $3 "redelivery fee" to steal your credit card number. Delete the text.'
  },
  scam_pig_butchering: {
    id: 'scam_pig_butchering',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'scam',
    resultTitle: 'THIS IS A "WRONG NUMBER" SCAM. DO NOT REPLY.',
    resultDesc: 'This is the start of a "Pig Butchering" scam. They text a "wrong number" hoping you politely reply. They will then strike up a friendly conversation, eventually trying to trick you into a fake crypto investment weeks later. Ignore and block the number.'
  },
  scam_gov: {
    id: 'scam_gov',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'scam',
    resultTitle: 'THIS IS A GOVERNMENT IMPOSTER SCAM. HANG UP.',
    resultDesc: 'The IRS and Social Security Administration do not call people to threaten arrest. They do not accept payment in Gift Cards, Bitcoin, or Wire Transfers. Hang up the phone.'
  },
  scam_bank_code: {
    id: 'scam_bank_code',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'scam',
    resultTitle: 'THIS IS A BANK FRAUD SCAM. HANG UP.',
    resultDesc: 'The caller is a hacker. They already have your password, but they need the 2-Factor Authentication code texted to your phone to log in. Your real bank will NEVER call you and ask you to read a code back to them. Hang up.'
  },
  scam_grandparent: {
    id: 'scam_grandparent',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'scam',
    resultTitle: 'THIS IS THE "GRANDPARENT" SCAM. HANG UP.',
    resultDesc: 'Scammers clone voices using AI or just guess names. They create a fake emergency to induce panic so you send money before thinking. Hang up, and dial your family member\'s actual phone number directly to verify.'
  },
  safe_ad: {
    id: 'safe_ad',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'safe',
    resultTitle: 'Probably just an annoying advertisement.',
    resultDesc: 'Pop-ups are annoying, but if it is not claiming your computer is infected or demanding money, it is likely just a standard web ad. Close the window.'
  },
  safe_bank: {
    id: 'safe_bank',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'safe',
    resultTitle: 'This sounds like standard banking procedure.',
    resultDesc: 'If they are NOT asking for your password, and NOT asking for a text-message code, and simply told you to check your app, you are likely safe. However, always be cautious.'
  },
  warning_verify: {
    id: 'warning_verify',
    question: '',
    options: [],
    isTerminal: true,
    resultType: 'warning',
    resultTitle: 'PROCEED WITH CAUTION. VERIFY INDEPENDENTLY.',
    resultDesc: 'This does not match a typical scam script, but you should still be careful. Hang up the phone, find the official phone number for the company on their real website (do not trust Google Ads), and call them yourself to verify.'
  }
};

export default function ScamDecisionTree() {
  const [history, setHistory] = useState<NodeId[]>(['start']);

  const currentNodeId = history[history.length - 1];
  const currentNode = TREE[currentNodeId];

  const handleOption = (nextNode: NodeId) => {
    setHistory([...history, nextNode]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
    }
  };

  const handleReset = () => {
    setHistory(['start']);
  };

  const getResultColors = (type: string) => {
    if (type === 'scam') return 'bg-red-50 border-red-500 text-red-900 icon-red';
    if (type === 'safe') return 'bg-emerald-50 border-emerald-500 text-emerald-900 icon-emerald';
    return 'bg-yellow-50 border-yellow-500 text-yellow-900 icon-yellow';
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="scam-tree">
      
      <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
        <h2 className="text-xl font-bold">"Is It a Scam?" Flowchart</h2>
        {history.length > 1 && (
          <button onClick={handleReset} className="text-slate-400 hover:text-white text-sm font-bold transition-colors">
            Start Over
          </button>
        )}
      </div>

      <div className="p-6 md:p-10 min-h-[400px] flex flex-col relative">
        
        {history.length > 1 && !currentNode.isTerminal && (
          <button 
            onClick={handleBack}
            className="absolute top-6 left-6 text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-bold text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back
          </button>
        )}

        <div className="flex-grow flex flex-col justify-center max-w-2xl mx-auto w-full pt-8">
          
          {!currentNode.isTerminal ? (
            <div className="animate-fade-in">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 text-center leading-tight">
                {currentNode.question}
              </h3>
              
              <div className="space-y-3">
                {currentNode.options.map((opt, idx) => {
                  let colorClass = 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700';
                  if (opt.color === 'red') colorClass = 'bg-red-50 border-red-200 hover:border-red-500 hover:bg-red-100 text-red-900';
                  if (opt.color === 'green') colorClass = 'bg-emerald-50 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100 text-emerald-900';

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOption(opt.nextNode)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all font-bold text-lg flex items-center justify-between group shadow-sm ${colorClass}`}
                    >
                      <span>{opt.label}</span>
                      <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`animate-fade-in p-8 rounded-2xl border-4 text-center ${getResultColors(currentNode.resultType!).replace(/icon-\w+/, '')}`} data-testid="tree-result">
              
              <div className="flex justify-center mb-6">
                {currentNode.resultType === 'scam' && (
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                )}
                {currentNode.resultType === 'safe' && (
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                )}
                {currentNode.resultType === 'warning' && (
                  <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-black mb-4 uppercase tracking-wide">
                {currentNode.resultTitle}
              </h3>
              <p className="text-lg opacity-90 leading-relaxed font-medium">
                {currentNode.resultDesc}
              </p>

              <button 
                onClick={handleReset}
                className="mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md"
              >
                Check another scenario
              </button>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
