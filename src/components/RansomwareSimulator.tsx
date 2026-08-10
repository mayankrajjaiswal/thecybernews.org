import React, { useState } from 'react';

// Defines the story nodes
const SCENARIOS = {
  start: {
    id: 'start',
    title: 'Monday Morning, 8:00 AM',
    text: 'You walk into your small accounting firm. You sit down with your coffee, wiggle the mouse, and your screen lights up red. A skull logo stares back at you. "ALL YOUR FILES ARE ENCRYPTED. SEND 2 BITCOIN ($100,000) IN 48 HOURS OR YOUR CUSTOMER DATA WILL BE DELETED AND PUBLISHED ONLINE." What is your very first move?',
    choices: [
      { label: 'Unplug the computer from the wall/network immediately.', nextNode: 'unplug' },
      { label: 'Quickly email your IT guy for help from that computer.', nextNode: 'email_it' },
      { label: 'Try to restart the computer to see if it fixes it.', nextNode: 'restart' }
    ]
  },
  email_it: {
    id: 'email_it',
    title: 'The Infection Spreads',
    text: 'By keeping the computer connected to the network to send an email, the ransomware worm uses the time to spread to your firm\'s main shared server. Now everyone\'s computer is locked. You just made the crisis 10x worse.',
    isGameOver: true,
    result: 'Disaster',
    lesson: 'In a ransomware attack, the first step is CONTAINMENT. You must immediately disconnect infected devices from the internet and local network (unplug the ethernet cable or turn off Wi-Fi) to stop the virus from spreading.'
  },
  restart: {
    id: 'restart',
    title: 'A Fatal Mistake',
    text: 'You restart the computer. The ransomware had a "boot-locker" installed. By restarting, you triggered the final encryption phase. The operating system is now completely corrupted and the screen won\'t even turn on.',
    isGameOver: true,
    result: 'Disaster',
    lesson: 'Never reboot an infected computer. It can trigger destructive payloads, and it also destroys the RAM (temporary memory) which cybersecurity forensics experts need to figure out how the hackers got in.'
  },
  unplug: {
    id: 'unplug',
    title: 'Containment Successful',
    text: 'Good job! You ripped the ethernet cable out. The virus is contained to just your machine. The shared server is safe. However, your computer has all the recent client tax returns on it. The hackers still want $100,000.',
    choices: [
      { label: 'Contact a cryptocurrency broker and pay the ransom.', nextNode: 'pay_ransom' },
      { label: 'Call your IT team to wipe the computer and restore from backups.', nextNode: 'restore_backup' },
      { label: 'Call the FBI / Local Police.', nextNode: 'call_police' }
    ]
  },
  pay_ransom: {
    id: 'pay_ransom',
    title: 'A Costly Gamble',
    text: 'You pay the $100,000. After 24 agonizing hours, the hackers send you a decryption key. It works, but it only decrypts about 60% of the files. The rest are corrupted forever. Worse, the hackers kept a copy of the tax returns and sold them on the dark web anyway. You are now facing massive regulatory fines.',
    isGameOver: true,
    result: 'Failure',
    lesson: 'Paying a ransom NEVER guarantees you get your files back. You are dealing with criminals. Furthermore, paying them funds future attacks and makes you a target for repeat attacks, as they know you are willing to pay.'
  },
  call_police: {
    id: 'call_police',
    title: 'The Investigation Begins',
    text: 'You call law enforcement. They take a report and bring in forensics. They identify the ransomware strain, but unfortunately, it\'s a new variant with no known decryption key. The FBI cannot magically unlock your files. You are still stuck.',
    choices: [
      { label: 'Pay the hackers anyway.', nextNode: 'pay_ransom' },
      { label: 'Wipe the computer and restore from backups.', nextNode: 'restore_backup' }
    ]
  },
  restore_backup: {
    id: 'restore_backup',
    title: 'The Backup Test',
    text: 'Your IT team arrives. They confirm the computer must be wiped. They go to pull your files from the external hard drive backup you keep plugged into the server.',
    choices: [
      { label: 'The hard drive was plugged in constantly.', nextNode: 'bad_backup' },
      { label: 'You use an off-site, disconnected cloud backup.', nextNode: 'good_backup' }
    ]
  },
  bad_backup: {
    id: 'bad_backup',
    title: 'The Illusion of Safety',
    text: 'Because the backup hard drive was physically plugged into the network when the ransomware hit, the virus encrypted the backups too. You have absolutely no way to recover the client data.',
    isGameOver: true,
    result: 'Disaster',
    lesson: 'A backup is only a true backup if it is "immutable" or "air-gapped" (disconnected from the main network). Ransomware is designed to specifically seek out and destroy connected backup drives.'
  },
  good_backup: {
    id: 'good_backup',
    title: 'Disaster Averted',
    text: 'Because your IT team set up daily cloud backups that are isolated from the local network, the ransomware couldn\'t reach them. The IT team wipes your infected computer, reinstalls Windows, and downloads the tax returns from the cloud. You lost a few hours of work, but saved your business.',
    isGameOver: true,
    result: 'Success',
    lesson: 'The only reliable defense against ransomware is having isolated, tested, offline backups. If your backups are safe, a ransomware attack goes from a business-ending disaster to a minor IT inconvenience.'
  }
};

export default function RansomwareSimulator() {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  
  const currentNode = SCENARIOS[currentNodeId as keyof typeof SCENARIOS];

  const restartGame = () => {
    setCurrentNodeId('start');
  };

  const getResultBadge = (result: string) => {
    if (result === 'Success') return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-sm border border-emerald-300">Crisis Averted</span>;
    if (result === 'Failure') return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-sm border border-orange-300">Costly Failure</span>;
    return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-sm border border-red-300">Total Disaster</span>;
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" data-testid="ransomware-sim">
      
      {/* Game Header */}
      <div className="bg-slate-900 p-6 border-b-4 border-red-600 flex justify-between items-center">
        <div>
          <span className="text-red-500 font-mono font-bold text-sm tracking-widest uppercase">INCIDENT_RESPONSE.EXE</span>
          <h2 className="text-xl font-bold text-white mt-1">Ransomware Simulator</h2>
        </div>
        {currentNodeId !== 'start' && !currentNode.isGameOver && (
          <button onClick={restartGame} className="text-slate-400 hover:text-white text-sm font-bold transition-colors">
            Reset Sim
          </button>
        )}
      </div>

      {/* Story Area */}
      <div className="p-6 md:p-8 bg-slate-50 min-h-[300px] flex flex-col">
        
        {currentNode.isGameOver && (
          <div className="mb-6 flex justify-center" data-testid="sim-result">
            {getResultBadge(currentNode.result!)}
          </div>
        )}

        <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{currentNode.title}</h3>
        <p className="text-lg text-slate-700 leading-relaxed mb-8 flex-grow">
          {currentNode.text}
        </p>

        {/* Choices / Actions */}
        {!currentNode.isGameOver ? (
          <div className="space-y-3 mt-auto">
            {currentNode.choices?.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentNodeId(choice.nextNode)}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-sm transition-all font-bold text-slate-800 flex items-center justify-between group"
              >
                <span>{choice.label}</span>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-auto border-t border-slate-200 pt-6">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              The Lesson:
            </h4>
            <p className="text-slate-700 bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm leading-relaxed mb-6">
              {currentNode.lesson}
            </p>
            
            <button 
              onClick={restartGame}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-sm"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
