---
title: Business Email Compromise
category: Scam Alert
audience: ['business', 'employee', 'it']
severity: Critical
description: A highly sophisticated scam where criminals impersonate an executive or vendor to steal millions from businesses.
---

## What is it?
Business Email Compromise (BEC) is a corporate scam where a cybercriminal hacks into, or successfully spoofs, a legitimate business email account. They then use that trusted email address to send a highly convincing message to an employee (usually in the finance or HR department) requesting an urgent wire transfer or a change in payroll direct deposit info.

Because the email appears to come from the actual CEO or a trusted vendor, the employee often complies, sending company funds directly into the scammer's bank account.

## How it works (The Teardown)
1. **The Reconnaissance:** The scammer stalks the company on LinkedIn and company websites to figure out who the CEO is and who works in the accounting department.
2. **The Infiltration:** They either hack into the CEO's actual email account (using a phished password) or they buy a domain name that looks almost identical (e.g., `ceo@acme-corp.com` vs the real `ceo@acmecorp.com`).
3. **The Urgent Request:** The scammer emails the accountant: *"I am locked in a board meeting and need to close an acquisition immediately. Please wire $50,000 to this vendor account by 2:00 PM today. Do not call me, I cannot speak right now."*
4. **The Transfer:** Believing they are helping their boss, the employee wires the money. 
5. **The Disappearance:** The money lands in an offshore account, is immediately withdrawn, and the scammer vanishes.

## How to identify this scam
* **Urgency & Secrecy:** The email almost always demands immediate action and explicitly tells you *not* to verify it via a phone call.
* **Sudden Changes:** A trusted vendor suddenly emails you to say their bank account routing numbers have changed just before a major invoice is due.
* **Subtle Typos:** If the email wasn't hacked, the "From" address will have a tiny typo (like an extra letter or a `.net` instead of a `.com`).

## How to avoid it
* **Implement a "Two-Step" Verification Rule:** Create a strict, non-negotiable company policy: *Any* request to change wire transfer details, payroll routing numbers, or to send sudden funds MUST be verified via a live phone call to a known number, regardless of how angry the "CEO" seems in the email.
* **Enforce MFA:** Turn on Multi-Factor Authentication for every single company email account to prevent hackers from logging into the CEO's inbox in the first place.

## What to do if you are affected
1. **Call your bank immediately:** If you catch it within the first 24 hours, the bank's fraud department *might* be able to freeze the wire transfer before it clears internationally.
2. **Lock down the email:** If an internal email account was hacked, force a password reset and turn on MFA immediately to stop the scammer from sending more emails.
3. **Report it:** File a detailed report with the FBI's Internet Crime Complaint Center (IC3) at `ic3.gov`, as they have specialized teams that track and occasionally recover BEC funds.
