import React, { useState } from 'react';

type Persona = 'student' | 'parent' | 'employee' | 'business' | 'senior' | 'it';

const contentMap: Record<Persona, { title: string; desc: string; href: string }> = {
  student: {
    title: 'Resources for Students',
    desc: 'Protect your social media, secure your devices on campus Wi-Fi, and spot fake job offers.',
    href: '/audience/student',
  },
  parent: {
    title: 'Resources for Parents',
    desc: 'Keep kids safe in online games, set up parental controls, and handle cyberbullying.',
    href: '/audience/parent',
  },
  employee: {
    title: 'Resources for Employees',
    desc: 'Work safely from home, identify corporate phishing, and understand company VPNs.',
    href: '/audience/employee',
  },
  business: {
    title: 'Resources for Business Owners',
    desc: 'Protect against Ransomware, train your team, and prevent Business Email Compromise.',
    href: '/audience/business',
  },
  senior: {
    title: 'Resources for Senior Citizens',
    desc: 'Spot tech support phone scams, practice safe online banking, and manage passwords easily.',
    href: '/audience/senior',
  },
  it: {
    title: 'Resources for IT Professionals',
    desc: 'Access the latest CVE explanations, download office training materials, and more.',
    href: '/audience/it',
  },
};

export default function PersonaSelector() {
  const [activePersona, setActivePersona] = useState<Persona>('parent');

  const personas: { id: Persona; label: string }[] = [
    { id: 'parent', label: 'Parent' },
    { id: 'senior', label: 'Senior Citizen' },
    { id: 'student', label: 'Student' },
    { id: 'employee', label: 'Employee' },
    { id: 'business', label: 'Business Owner' },
    { id: 'it', label: 'IT Pro' },
  ];

  const currentContent = contentMap[activePersona];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Select your profile to get started:</h2>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePersona(p.id)}
            data-testid={`btn-${p.id}`}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
              activePersona === p.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            I am a {p.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-center" data-testid="content-area">
        <h3 className="text-xl font-bold text-slate-800 mb-3">{currentContent.title}</h3>
        <p className="text-slate-600 mb-6 max-w-lg mx-auto">{currentContent.desc}</p>
        <a 
          href={currentContent.href} 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          View All {personas.find(p => p.id === activePersona)?.label} Guides &rarr;
        </a>
      </div>
    </div>
  );
}
