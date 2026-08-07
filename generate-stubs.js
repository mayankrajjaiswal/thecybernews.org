import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stubs = [
  { path: 'src/pages/learn/passwords.md', title: 'The Power of Password Managers', cat: 'Guide' },
  { path: 'src/pages/learn/mfa.md', title: 'Turning on MFA', cat: 'Guide' },
  { path: 'src/pages/learn/phishing-basics.md', title: 'Spotting Phishing', cat: 'Guide' },
  { path: 'src/pages/learn/home-wifi.md', title: 'Securing Home Wi-Fi', cat: 'Guide' },
  { path: 'src/pages/learn/mobile-security.md', title: 'Mobile Device Hardening', cat: 'Guide' },
  { path: 'src/pages/learn/safe-banking.md', title: 'Safe Online Banking', cat: 'Guide' },
  { path: 'src/pages/learn/digital-footprint.md', title: 'Digital Footprint', cat: 'Guide' },
  { path: 'src/pages/learn/vpns.md', title: 'Understanding VPNs', cat: 'Guide' },
  { path: 'src/pages/learn/ransomware.md', title: 'Ransomware Protection', cat: 'Guide' },
  { path: 'src/pages/learn/social-media.md', title: 'Social Media Privacy', cat: 'Guide' },
  { path: 'src/pages/learn/public-wifi.md', title: 'Public Wi-Fi Safety', cat: 'Guide' },
  { path: 'src/pages/learn/gaming-safety.md', title: 'Gaming Safety for Kids', cat: 'Guide' },
  { path: 'src/pages/learn/parental-controls.md', title: 'Parental Controls', cat: 'Guide' },
  { path: 'src/pages/learn/cyber-bullying.md', title: 'Handling Cyber Bullying', cat: 'Guide' },
  { path: 'src/pages/learn/remote-work.md', title: 'Remote Work Safety', cat: 'Guide' },
  { path: 'src/pages/learn/ransomware-defense.md', title: 'Ransomware Defense for Business', cat: 'Guide' },
  { path: 'src/pages/learn/team-training.md', title: 'Team Cyber Training', cat: 'Guide' },
  
  { path: 'src/pages/scams/package-delivery.md', title: 'Package Delivery Scam', cat: 'Scam Alert' },
  { path: 'src/pages/scams/whatsapp-hijack.md', title: 'WhatsApp Hijacking', cat: 'Scam Alert' },
  { path: 'src/pages/scams/tech-support.md', title: 'Tech Support Pop-up Scam', cat: 'Scam Alert' },
  { path: 'src/pages/scams/job-scams.md', title: 'Fake Job Offers', cat: 'Scam Alert' },
  { path: 'src/pages/scams/phishing.md', title: 'Corporate Phishing Emails', cat: 'Scam Alert' },
  { path: 'src/pages/scams/bec.md', title: 'Business Email Compromise', cat: 'Scam Alert' },
  
  { path: 'src/pages/dictionary/botnet.md', title: 'Botnet', cat: 'Dictionary Term' },
  { path: 'src/pages/dictionary/deepfake.md', title: 'Deepfake', cat: 'Dictionary Term' },
  { path: 'src/pages/dictionary/encryption.md', title: 'Encryption', cat: 'Dictionary Term' },
  { path: 'src/pages/dictionary/zero-day.md', title: 'Zero-Day', cat: 'Dictionary Term' },
  { path: 'src/pages/dictionary/vpn.md', title: 'VPN (Virtual Private Network)', cat: 'Dictionary Term' },
  
  { path: 'src/pages/news/apple-emergency-update.md', title: 'Apple Emergency Update', cat: 'News Explained' },
  { path: 'src/pages/news/smart-home-laws.md', title: 'Smart Home Laws', cat: 'News Explained' },
  { path: 'src/pages/news/cve.md', title: 'Latest CVE Updates', cat: 'News Explained' },
  
  // Download Hub routing pages
  { path: 'src/pages/downloads/posters.md', title: 'Cybersecurity Posters', cat: 'Downloads' },
  { path: 'src/pages/downloads/training.md', title: 'Internal Training Materials', cat: 'Downloads' }
];

stubs.forEach(stub => {
  const fullPath = path.join(__dirname, stub.path);
  
  // Ensure directory exists
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  if (!fs.existsSync(fullPath)) {
    const content = `---
layout: ../../layouts/MarkdownLayout.astro
title: ${stub.title}
category: ${stub.cat}
date: 2026-08-07
description: This is a placeholder article for ${stub.title}.
---

## Coming Soon
This article is currently being written by our editorial team. Check back soon for the full plain-English breakdown.
`;
    fs.writeFileSync(fullPath, content);
    console.log("Created " + stub.path);
  }
});
