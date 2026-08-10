import React, { useState, useEffect } from 'react';

type DeviceCategory = 'router' | 'camera' | 'voice' | 'tv' | 'appliances';

interface DeviceItem {
  id: string;
  name: string;
  category: DeviceCategory;
  icon: string;
  tasks: { id: string; desc: string; why: string }[];
}

const DEVICES: DeviceItem[] = [
  {
    id: 'd_router',
    name: 'Wi-Fi Router',
    category: 'router',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
    tasks: [
      { id: 't_router_1', desc: 'Change the default Admin password.', why: 'Hackers can google the default password for your router brand and take over your entire network.' },
      { id: 't_router_2', desc: 'Turn off UPnP (Universal Plug and Play).', why: 'UPnP allows devices to open holes in your firewall automatically. It is a massive security risk.' },
      { id: 't_router_3', desc: 'Create a "Guest Network" for IoT devices.', why: 'If a smart lightbulb is hacked, keeping it on a Guest network prevents the hacker from reaching your laptop or phone.' }
    ]
  },
  {
    id: 'd_camera',
    name: 'Security Cameras (Ring, Nest, Baby Monitors)',
    category: 'camera',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    tasks: [
      { id: 't_cam_1', desc: 'Enable Multi-Factor Authentication (MFA).', why: 'Prevents hackers from logging into your camera feed even if they steal your password.' },
      { id: 't_cam_2', desc: 'Disable "Remote Management" if not actively used.', why: 'Closes the door on hackers trying to access the camera directly from outside your home.' }
    ]
  },
  {
    id: 'd_voice',
    name: 'Voice Assistants (Alexa, Google Home)',
    category: 'voice',
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
    tasks: [
      { id: 't_voice_1', desc: 'Mute the microphone when not in use.', why: 'Prevents accidental recordings of sensitive conversations.' },
      { id: 't_voice_2', desc: 'Disable voice purchasing (or add a voice PIN).', why: 'Stops anyone (or kids) from accidentally buying items via voice command.' },
      { id: 't_voice_3', desc: 'Regularly delete your voice recording history.', why: 'Minimizes the amount of personal data stored on Amazon/Google servers in case of a breach.' }
    ]
  },
  {
    id: 'd_tv',
    name: 'Smart TVs & Streaming Devices',
    category: 'tv',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    tasks: [
      { id: 't_tv_1', desc: 'Turn off ACR (Automatic Content Recognition).', why: 'ACR tracks exactly what you are watching on screen to send you targeted ads. Turn it off in privacy settings.' },
      { id: 't_tv_2', desc: 'Cover the built-in webcam (if it has one).', why: 'Just like a laptop, a compromised Smart TV webcam can spy on your living room.' }
    ]
  },
  {
    id: 'd_appliances',
    name: 'Smart Appliances (Plugs, Vacuums, Fridges)',
    category: 'appliances',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    tasks: [
      { id: 't_app_1', desc: 'Connect them ONLY to the Guest Wi-Fi network.', why: 'Cheap smart plugs rarely get security updates. Isolating them on a Guest network limits the damage if they are hacked.' },
      { id: 't_app_2', desc: 'Ensure auto-updates are enabled in their app.', why: 'Appliance manufacturers occasionally patch critical bugs, but you must allow the device to update.' }
    ]
  }
];

export default function SmartHomeAuditor() {
  const [selectedDevices, setSelectedDevices] = useState<string[]>(['d_router']); // Router is default
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedDevices = JSON.parse(localStorage.getItem('cyber_smarthome_devices') || '["d_router"]');
    const savedTasks = JSON.parse(localStorage.getItem('cyber_smarthome_tasks') || '[]');
    setSelectedDevices(savedDevices);
    setCompletedTasks(savedTasks);
    setIsLoaded(true);
  }, []);

  const toggleDevice = (id: string) => {
    let updated;
    if (selectedDevices.includes(id)) {
      updated = selectedDevices.filter(d => d !== id);
    } else {
      updated = [...selectedDevices, id];
    }
    setSelectedDevices(updated);
    localStorage.setItem('cyber_smarthome_devices', JSON.stringify(updated));
  };

  const toggleTask = (id: string) => {
    let updated;
    if (completedTasks.includes(id)) {
      updated = completedTasks.filter(t => t !== id);
    } else {
      updated = [...completedTasks, id];
    }
    setCompletedTasks(updated);
    localStorage.setItem('cyber_smarthome_tasks', JSON.stringify(updated));
  };

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Loading your home setup...</div>;

  // Gather all relevant tasks
  const activeDevices = DEVICES.filter(d => selectedDevices.includes(d.id));
  const totalTasks = activeDevices.reduce((sum, d) => sum + d.tasks.length, 0);
  
  // Only count completed tasks that belong to currently selected devices
  const validCompletedTasks = completedTasks.filter(tId => 
    activeDevices.some(d => d.tasks.some(t => t.id === tId))
  );
  
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((validCompletedTasks.length / totalTasks) * 100);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row" data-testid="smart-home-auditor">
      
      {/* Sidebar: Inventory */}
      <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-slate-900 mb-2">My Devices</h2>
        <p className="text-sm text-slate-500 mb-6">Select the types of smart devices in your home to generate your audit checklist.</p>
        
        <div className="space-y-3 flex-grow overflow-y-auto pr-2">
          {DEVICES.map(device => {
            const isSelected = selectedDevices.includes(device.id);
            return (
              <button
                key={device.id}
                onClick={() => toggleDevice(device.id)}
                data-testid={`toggle-dev-${device.id}`}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm' 
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={device.icon}></path></svg>
                </div>
                <span className="font-bold text-sm leading-tight">{device.name}</span>
                {isSelected && (
                  <svg className="w-5 h-5 text-indigo-500 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Area: Checklist */}
      <div className="w-full md:w-2/3 flex flex-col bg-white">
        
        {/* Header / Progress */}
        <div className="p-6 md:p-8 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Security Audit</h2>
            <p className="text-slate-400 text-sm mt-1">Complete these steps to lock down your home.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex-grow sm:w-32 bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
                data-testid="audit-progress"
              ></div>
            </div>
            <span className="font-bold text-lg text-emerald-400">{progressPercentage}%</span>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-6 md:p-8 flex-grow overflow-y-auto h-[600px] bg-slate-50">
          {activeDevices.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
               <p className="font-medium text-lg">Select devices on the left to see your checklist.</p>
             </div>
          ) : (
            <div className="space-y-8">
              {activeDevices.map(device => (
                <div key={device.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
                  <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={device.icon}></path></svg>
                    <h3 className="font-bold text-slate-800">{device.name} Settings</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {device.tasks.map(task => {
                      const isDone = completedTasks.includes(task.id);
                      return (
                        <div key={task.id} className={`p-6 transition-colors hover:bg-slate-50 flex items-start gap-4 ${isDone ? 'opacity-60' : ''}`}>
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`flex-shrink-0 w-6 h-6 mt-0.5 rounded border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-transparent hover:border-emerald-400'
                            }`}
                            data-testid={`task-${task.id}`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </button>
                          <div>
                            <p className={`font-bold mb-1 ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.desc}</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{task.why}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
