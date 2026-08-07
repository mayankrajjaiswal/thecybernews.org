import React, { useState } from 'react';

type Persona = 'student' | 'parent' | 'employee' | 'business' | 'senior' | 'it';

const contentMap: Record<Persona, { title: string; links: { label: string; href: string }[] }> = {
  student: {
    title: 'Guides for Students',
    links: [
      { label: 'Protecting your social media privacy', href: '/learn/social-media' },
      { label: 'How to spot fake job offers', href: '/scams/job-scams' },
      { label: 'Securing your devices on campus Wi-Fi', href: '/learn/public-wifi' },
    ],
  },
  parent: {
    title: 'Guides for Parents',
    links: [
      { label: 'Keeping kids safe in online games', href: '/learn/gaming-safety' },
      { label: 'Setting up parental controls', href: '/learn/parental-controls' },
      { label: 'Talking to teens about cyber bullying', href: '/learn/cyber-bullying' },
    ],
  },
  employee: {
    title: 'Guides for Employees',
    links: [
      { label: 'Working safely from home', href: '/learn/remote-work' },
      { label: 'Identifying phishing emails at work', href: '/scams/phishing' },
      { label: 'Understanding your company VPN', href: '/dictionary/vpn' },
    ],
  },
  business: {
    title: 'Guides for Business Owners',
    links: [
      { label: 'Protecting against Ransomware', href: '/learn/ransomware-defense' },
      { label: 'Training your team on cyber hygiene', href: '/learn/team-training' },
      { label: 'What is Business Email Compromise (BEC)?', href: '/scams/bec' },
    ],
  },
  senior: {
    title: 'Guides for Senior Citizens',
    links: [
      { label: 'How to spot tech support phone scams', href: '/scams/tech-support' },
      { label: 'Safe online banking practices', href: '/learn/safe-banking' },
      { label: 'Creating passwords you can remember', href: '/learn/passwords' },
    ],
  },
  it: {
    title: 'Resources for IT Professionals',
    links: [
      { label: 'Latest CVE updates explained', href: '/news/cve' },
      { label: 'Cybersecurity posters for the office', href: '/downloads/posters' },
      { label: 'Free internal training materials', href: '/downloads/training' },
    ],
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

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 min-h-[200px]" data-testid="content-area">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{currentContent.title}</h3>
        <ul className="space-y-3">
          {currentContent.links.map((link, idx) => (
            <li key={idx} className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <a href={link.href} className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
