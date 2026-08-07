---
title: Turning on MFA
category: Guide
subcategory: Identity Security
difficulty: Beginner
readingTime: 4 min read
audience: ['student', 'parent', 'employee', 'business', 'senior']
description: Passwords are no longer enough. Learn how Multi-Factor Authentication makes it impossible for hackers to log in.
---

## What is MFA?
Multi-Factor Authentication (MFA), sometimes called Two-Factor Authentication (2FA), is like putting a deadbolt on your door in addition to the regular doorknob lock. 

Even if a hacker figures out your password (the doorknob lock), they still cannot get into your account because they don't have the key to the deadbolt.

## How it works
MFA operates on the principle that to log in, you must prove your identity using two different *types* of evidence:
1. **Something you know:** Your password.
2. **Something you have:** Your physical smartphone.

When you type your password into a website, the website will pause and send a temporary, 6-digit code to your physical smartphone. You must type that code into the website to finish logging in. 

Because the hacker in Russia only has your password, but they do *not* have your physical smartphone in their hand, they are completely locked out.

## The 3 Levels of MFA (From Good to Best)

If a website offers you MFA, turn it on immediately. However, not all MFA is created equal.

### Level 1: SMS Text Messages (Good)
The website texts a 6-digit code to your phone number. 
* **Pros:** Very easy to set up. Every website supports it.
* **Cons:** Hackers can execute a "SIM Swap" attack, tricking your cellular provider (like AT&T or Verizon) into porting your phone number to the hacker's phone, allowing them to steal the text messages.

### Level 2: Authenticator Apps (Better)
You download an app like **Google Authenticator** or **Authy**. The app generates a new 6-digit code every 30 seconds.
* **Pros:** Does not rely on your phone number, making it immune to SIM Swap attacks. The code is generated directly on the device itself.
* **Cons:** Takes about 3 minutes to set up the first time.

### Level 3: Security Keys / Passkeys (Best)
You use a physical USB key (like a YubiKey) that you plug into your computer, or you use your phone's built-in FaceID/TouchID (a Passkey).
* **Pros:** Completely immune to Phishing. Even if a fake website tricks you into using your fingerprint, the technology recognizes the website is fake and refuses to hand over the authentication.
* **Cons:** Still being rolled out across the internet, so not every website supports it yet.

## Your Action Plan
You do not need MFA turned on for a random cooking blog. You **do** need it turned on for the "Keys to the Kingdom."
1. Log into your primary Email account (Gmail, Yahoo, Outlook) right now. Go to the security settings and turn on Two-Factor Authentication. 
2. Do the exact same thing for your Bank Account.
3. If you use a Password Manager, turn MFA on for that immediately.
