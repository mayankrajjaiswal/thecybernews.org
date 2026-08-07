---
title: Understanding VPNs and Proxies
category: Guide
subcategory: Network Security
difficulty: Advanced
readingTime: 6 min read
audience: ['employee', 'business', 'it']
description: When should you actually pay for a VPN, and when are they just a waste of money?
---

## Cutting through the Marketing Hype
If you watch videos on YouTube, you have undoubtedly seen advertisements for VPNs (Virtual Private Networks) claiming they are the ultimate tool to "stop hackers and secure your bank account." 

The truth is much more nuanced. VPNs are incredibly useful tools, but they do not make you immune to hacking, and you do not always need one.

## How a VPN Actually Works
When you connect to the internet normally, your traffic goes from your computer, to your Internet Service Provider (like Comcast or Xfinity), and then to the website you want to visit. The website sees your real IP address (which reveals your general physical location).

When you turn on a VPN, your traffic is placed inside an encrypted "tunnel." It travels past your internet provider in total secrecy, goes to the VPN company's server (which could be in Switzerland or Japan), and *then* goes to the website. The website thinks you are sitting in Switzerland.

## When You MUST Use a VPN
1. **Working remotely:** If you are accessing corporate files or internal company dashboards from your living room, you must use your company's official VPN. This puts your home computer securely inside the corporate office network.
2. **Using Public Wi-Fi:** If you are sitting in a coffee shop, an airport, or a hotel, the Wi-Fi is unencrypted. A hacker sitting two tables away can easily intercept your traffic. Turning on a personal VPN (like Mullvad or ProtonVPN) scrambles your traffic before it leaves your laptop, protecting you from local snoops.
3. **Bypassing Censorship:** If you are traveling to a country with a highly censored internet (where news sites or social media are blocked), a VPN allows you to bypass the national firewall by tunneling your traffic to a free country.

## When a VPN is Useless
* **Stopping Phishing:** A VPN will not stop you from clicking a fake link in an email and typing your password into a scam website. 
* **Stopping Malware:** If you download a malicious file, the VPN simply securely encrypts the virus as it travels to your computer. It does not act as an antivirus.
* **Home Browsing:** If you are sitting at home, on your password-protected Wi-Fi, browsing your bank (which uses HTTPS), a VPN provides very little added security. Your internet provider can see you are visiting the bank, but they cannot see your password.

## Free vs. Paid VPNs
**Never use a free VPN.** Running massive servers around the globe costs millions of dollars. If a company is offering you a VPN for free, they are making their money by analyzing your private browsing traffic and selling it to advertising companies—which completely defeats the purpose of using a VPN in the first place.

If you need a VPN, expect to pay $5 to $10 a month for a reputable, privacy-respecting service like Mullvad, ProtonVPN, or IVPN.
