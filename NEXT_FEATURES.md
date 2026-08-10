# NEXT FEATURES ROADMAP
**Project:** TheCyberNews.org  
**Purpose:** Define the next implementation targets after the initial static website foundation is complete.

---

# Current Status

The core foundation of the project is considered complete.

Completed:

- Responsive Homepage
- Persona Selector
- Learn (Zero to Hero)
- Scam Alerts
- Cyber Dictionary
- News Explained
- Cyber Toolbox
- Downloads Hub
- 404 Page
- Astro + Tailwind Architecture
- GitHub Actions
- GitHub Pages Deployment
- Test Coverage
- Markdown-first Content Model

The next phase is **not about adding more pages**.

The next phase is about transforming the website into a true Cyber Security Knowledge Platform.

---

# Primary Goal

The objective is to build a platform that becomes the single destination for Cyber Security knowledge, awareness, learning, and practical guidance.

The website should not feel like a collection of articles.

It should feel like an interconnected knowledge ecosystem.

---

# Phase 2 - Knowledge Platform

This phase focuses on information architecture rather than new UI components.

---

# Feature 1 - Knowledge Architecture

## Objective

Transform isolated markdown articles into interconnected knowledge.

## Goals

- Every page should connect to related topics.
- Every page should belong to a parent category.
- Every page should recommend additional learning.
- Users should naturally navigate deeper into the platform.

Example

```
Passwords
    ↓
Password Manager
    ↓
MFA
    ↓
Passkeys
    ↓
Authentication
    ↓
Identity Theft
    ↓
Phishing
```

---

# Feature 2 - Standard Content Model

Currently markdown pages are simple.

Every content type should follow a standard model.

## Required Metadata

```yaml
title:
slug:
description:
category:
subcategory:
audience:
difficulty:
readingTime:
author:
reviewer:
lastUpdated:
tags:
featured:
seoTitle:
seoDescription:
relatedTopics:
relatedTools:
relatedDownloads:
relatedCourses:
relatedNews:
```

This will allow future automation and AI-generated content.

---

# Feature 3 - Information Architecture

Introduce a proper hierarchy.

```
Cyber Security

├── Awareness
├── Learn
├── News
├── Dictionary
├── Scam Alerts
├── Tools
├── Downloads
├── Resources
├── Research
└── Community (Future)
```

Every page should belong to one primary category.

---

# Feature 4 - Topic Hubs

Instead of isolated articles, build complete topic hubs.

Example

```
Identity Security

Overview

↓

Passwords

↓

Password Managers

↓

MFA

↓

Passkeys

↓

Authentication

↓

Authorization

↓

IAM

↓

OAuth

↓

SSO

↓

OIDC

↓

Zero Trust
```

Each hub becomes a landing page.

---

# Feature 5 - Audience Based Navigation

Existing persona selector should evolve.

Target audiences

- Parents
- Students
- Teachers
- Employees
- Business Owners
- Senior Citizens
- IT Professionals
- Beginners

Each audience should see personalized recommendations.

Example

Parent

- Children's Internet Safety
- Gaming Safety
- Social Media
- Cyberbullying
- YouTube Safety
- Device Controls

Business Owner

- Email Security
- Business Email Compromise
- Ransomware
- Password Policies
- Employee Awareness
- Data Backup

---

# Feature 6 - Learning Roadmaps

Expand "Zero to Hero".

Create multiple guided learning paths.

Examples

- Cyber Security for Beginners
- Home Internet Safety
- Student Roadmap
- Office Employee Roadmap
- Small Business Security
- Cyber Career Roadmap

Each roadmap should have

- Progression
- Recommended reading
- Related dictionary terms
- Quizzes (future)

---

# Feature 7 - Cyber Dictionary Expansion

Current dictionary is a foundation.

Expand to several hundred entries.

Each entry should include

- Definition
- Simple Explanation
- Everyday Analogy
- Why It Matters
- Related Terms
- Related Guides
- Related Tools
- References

Example categories

- Identity
- Network
- Cloud
- Malware
- Privacy
- AI
- Encryption
- Compliance
- Mobile
- Browser

---

# Feature 8 - Scam Intelligence Database

Scam pages should become structured.

Each scam should contain

- Scam Name
- Summary
- Category
- Severity
- Target Audience
- Country
- Platform
- Industries
- Screenshots
- Timeline
- Scam Flow
- Red Flags
- Prevention
- Recovery
- Reporting Links
- Related Articles

Categories

- Banking
- UPI
- WhatsApp
- Telegram
- Investment
- Crypto
- Job
- Romance
- Shopping
- Courier
- KYC
- Customer Care
- AI
- Deepfake

---

# Feature 9 - News Explained Improvements

Every article should answer

- What happened?
- Who is affected?
- Why does it matter?
- Should I worry?
- What should I do?
- Related Topics
- References

Add classifications

- Consumer
- Enterprise
- Government
- Cloud
- Identity
- AI
- Mobile
- Browser
- Banking

---

# Feature 10 - Resources Library

Create a curated resources section.

Examples

- NIST
- CISA
- OWASP
- MITRE
- CERT
- Microsoft Security
- Google Security
- Apple Security
- Cisco
- AWS
- Azure
- GCP
- Cloudflare

Each resource page should contain

- Overview
- Why It Matters
- Popular Documents
- External Links
- Related Articles

---

# Feature 11 - Cyber Downloads

Expand downloads.

Categories

- Posters
- Awareness Flyers
- Cheat Sheets
- Checklists
- Templates
- Presentations
- School Material
- Office Material
- PDF Guides

---

# Feature 12 - Cyber Toolbox Expansion

Current tools are excellent.

Add

- Password Strength Checker
- Hash Generator
- Hash Verifier
- Base64 Encoder
- Base64 Decoder
- JWT Decoder
- JWT Encoder
- JSON Formatter
- Regex Tester
- DNS Lookup
- WHOIS Lookup
- IP Lookup
- Port Reference
- HTTP Status Codes
- MIME Type Reference
- Security Headers Checker
- Email Header Analyzer
- URL Analyzer
- QR Code Inspector
- Password Policy Generator

All tools should remain client-side whenever possible.

---

# Feature 13 - Internal Linking Engine

Every page should automatically display

- Related Guides
- Related Dictionary Terms
- Related Scam Alerts
- Related Downloads
- Related News
- Related Tools
- Next Lesson
- Previous Lesson

No page should become an isolated dead end.

---

# Feature 14 - Breadcrumb Navigation

Every page should include

```
Home

↓

Learn

↓

Identity

↓

Passwords
```

Improve navigation and SEO.

---

# Feature 15 - Search Improvements

Search should support

- Articles
- Dictionary
- Scam Alerts
- Downloads
- Learn
- Tools

Future

- Fuzzy Search
- Synonyms
- Category Filters

---

# Feature 16 - URL Standardization

Maintain a predictable URL structure.

Examples

```
/learn/passwords

/learn/mfa

/dictionary/passkey

/scams/upi-fraud

/news/apple-security-update

/tools/password-generator

/downloads/posters

/resources/owasp
```

---

# Feature 17 - SEO Improvements

Add

- FAQ Schema
- HowTo Schema
- Breadcrumb Schema
- Article Schema
- News Schema
- Organization Schema
- Open Graph
- Twitter Cards
- Canonical URLs
- XML Sitemap Improvements

---

# Feature 18 - Related Content Blocks

Every page should recommend

```
Continue Learning

Related Articles

Related Tools

Related Downloads

Recommended Reading
```

Increase engagement.

---

# Feature 19 - Content Review System

Each article should contain

- Published Date
- Last Updated
- Reviewed By
- Version
- Reading Time
- Difficulty
- References

---

# Feature 20 - Content Categories

Expand coverage.

Major categories

- Identity Security
- Cloud Security
- Network Security
- Application Security
- Mobile Security
- Email Security
- Browser Security
- AI Security
- Digital Privacy
- Online Banking
- Malware
- Ransomware
- Social Engineering
- Cyber Laws
- Governance
- Compliance
- Home Security
- Small Business
- Students
- Parents

---

# Future Phases (Not Current Priority)

The following are intentionally deferred until the knowledge platform is mature.

## Phase 3

- Interactive Quizzes
- Learning Progress
- Badges
- Certificates
- Cyber Academy

## Phase 4

- User Accounts
- Bookmarks
- Personal Dashboard
- Contributor Program

## Phase 5

- AI Assistant
- AI Search
- AI Recommendations
- AI Summaries
- AI Learning Guide

## Phase 6

- Community Forum
- Expert Discussions
- Events
- Webinars
- Meetups

---

# Current Development Priority

The development team should prioritize work in the following order:

- [x] 1. Standardize the content model.
- [x] 2. Build the knowledge architecture.
- [x] 3. Create topic hub pages.
- [x] 4. Expand the Cyber Dictionary (Added Phase 1).
- [x] 5. Expand Learn (Added Zero to Hero Modules).
- [ ] 6. Build the structured Scam Database.
- [ ] 7. Expand the Resources Library.
- [x] 8. Expand the Cyber Toolbox (Added Cheat Sheets, Phishing Spotter, Health Audit, Emergency Wizard, Password Strength, App Sandbox, Policy Gen, Link Anatomy).
- [ ] 9. Improve internal linking.
- [ ] 10. Improve search.
- [ ] 11. Improve SEO.
- [x] 12. Expand evergreen educational content (Added Bookmarking system, JSON Formatter, Breach Calculator, Privacy Wizard, Email Analyzer).

---

# Success Criteria

This phase is considered complete when:

- Every page belongs to a defined knowledge hierarchy.
- Every article contains standardized metadata.
- Every article links to related content.
- Major cybersecurity domains have dedicated hub pages.
- Dictionary contains substantial foundational coverage.
- Scam Alerts follow a structured format.
- Learning paths are interconnected.
- Search covers all content types.
- Internal navigation encourages continuous learning.
- The platform behaves like a connected knowledge ecosystem rather than a traditional blog.

---

# Guiding Principle

**Do not build another cybersecurity news website.**

Build the world's most practical, beginner-friendly, interconnected Cyber Security Knowledge Platform where every article, tool, guide, scam alert, and learning path contributes to a single mission:

> **Making Cyber Security understandable, actionable, and accessible for everyone.**