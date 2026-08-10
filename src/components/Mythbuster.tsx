import React, { useState } from 'react';

const MYTHS = [
  {
    id: 1,
    question: 'Can I get hacked just by answering a spam phone call?',
    isMyth: true,
    answer: 'No. Simply picking up the phone and saying "Hello" cannot hack your phone or steal your passwords. However, answering does let the scammer know your number is active, which may lead to more spam calls.'
  },
  {
    id: 2,
    question: 'Can I get hacked just by opening a spam email?',
    isMyth: true,
    answer: 'No. Modern email providers (like Gmail and Outlook) block automatic code execution. Just reading the text of an email is safe. The danger only starts if you click a link or download an attachment.'
  },
  {
    id: 3,
    question: 'Can I get hacked if I click a bad link but close the page immediately?',
    isMyth: false,
    answer: 'Yes, it is possible. This is called a "Drive-by Download." Some advanced malware can infect your browser the millisecond the page loads, without you clicking anything else. You should run an antivirus scan.'
  },
  {
    id: 4,
    question: 'Are Macs immune to viruses?',
    isMyth: true,
    answer: 'No. While Windows historically had more viruses because it was more popular, Mac malware is very common today. You still need to use strong passwords, avoid sketchy downloads, and install updates.'
  },
  {
    id: 5,
    question: 'Is it dangerous to charge my phone at a public USB charging station (like an airport)?',
    isMyth: false,
    answer: 'Yes. This is called "Juice Jacking." USB cables transmit both power AND data. A compromised charging station could secretly install malware on your phone. Always use a standard electrical outlet with your own power brick.'
  },
  {
    id: 6,
    question: 'If I have a strong password, do I really need Two-Factor Authentication (MFA)?',
    isMyth: true,
    answer: 'Yes! A strong password only protects you from guessing. If a website you use gets breached, hackers will steal that strong password directly from the server. MFA protects you even if the hacker knows your password.'
  }
];

export default function Mythbuster() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const toggleCard = (id: number) => {
    if (flippedCards.includes(id)) {
      setFlippedCards(flippedCards.filter(cardId => cardId !== id));
    } else {
      setFlippedCards([...flippedCards, id]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-slate-50 p-6 md:p-12 rounded-2xl shadow-sm border border-slate-200" data-testid="mythbuster">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">"Can I get hacked if..."</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MYTHS.map((myth) => {
          const isFlipped = flippedCards.includes(myth.id);
          
          return (
            <div 
              key={myth.id}
              className="relative h-64 w-full perspective-1000"
              onClick={() => toggleCard(myth.id)}
              data-testid={`card-${myth.id}`}
            >
              <div className={`w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer shadow-md rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front of Card */}
                <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-400 transition-colors">
                  <div className="text-4xl mb-4">🤔</div>
                  <h3 className="text-lg font-bold text-slate-800 leading-snug">{myth.question}</h3>
                  <p className="text-sm text-indigo-500 font-bold mt-4 uppercase tracking-widest">Tap to reveal</p>
                </div>

                {/* Back of Card */}
                <div className={`absolute w-full h-full backface-hidden rotate-y-180 border-2 rounded-2xl p-6 flex flex-col ${myth.isMyth ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
                  <div className="flex items-center gap-2 mb-3 border-b pb-2" style={{ borderColor: myth.isMyth ? '#a7f3d0' : '#fecaca' }}>
                    {myth.isMyth ? (
                      <span className="text-emerald-700 font-black text-xl uppercase tracking-wider">It's a Myth!</span>
                    ) : (
                      <span className="text-red-700 font-black text-xl uppercase tracking-wider">Fact! (Danger)</span>
                    )}
                  </div>
                  <p className={`text-sm md:text-base leading-relaxed overflow-y-auto ${myth.isMyth ? 'text-emerald-900' : 'text-red-900'}`}>
                    {myth.answer}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
