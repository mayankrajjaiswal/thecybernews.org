# TheCyberNews.org 🛡️
**The world's most practical cybersecurity knowledge platform.**

Unlike traditional cybersecurity news websites that cater to IT professionals, **TheCyberNews.org** is built for everyday people—parents, students, senior citizens, and non-technical employees. Think of it as the "Wikipedia + Consumer Reports + Khan Academy" of cybersecurity.

---

## 🤖 AI Agent Guidelines
**Attention AI Assistants:** If you are reading this file to understand the project context, you MUST adhere to the following mandates:
1. **The Audience:** All text generation must be jargon-free and aimed at laypeople. No "IT speak" unless it is explicitly being defined in the Dictionary.
2. **The Stack:** This is an **Astro** static site. Markdown (`.md`) is used for all content. **React** (`.tsx`) is used *strictly* for interactive client-side islands (like the Toolbox). Do not attempt to use React for standard page layouts; use Astro (`.astro`).
3. **Styling:** Use **Tailwind CSS v4**. Do not write custom CSS unless absolutely necessary. Rely on the `@tailwindcss/typography` plugin (`prose` classes) to style all markdown content.
4. **Testing:** This project maintains a strict **>95% test coverage** requirement using Vitest and React Testing Library. If you modify or add a React component in `src/components/`, you MUST update or create a corresponding `.test.tsx` file and verify coverage by running `npm run test:coverage`.
5. **No Server-Side Logic:** This site is hosted on GitHub Pages. You cannot use server-side rendering (SSR), databases, or API endpoints. Everything must be purely static or client-side.

---

## 🚀 The Core Pillars & Implemented Features

The platform is structured around six main pillars, all of which are fully implemented and ready for scale:

### 1. The Home Hub (`/`)
* **Feature:** A fully responsive homepage featuring the **Persona Selector** (React Component).
* **Purpose:** Allows users to identify themselves (e.g., Parent, Senior, Business Owner) and instantly displays curated content links relevant to their specific lifestyle.

### 2. Zero to Hero (`/learn`)
* **Feature:** A structured, chronological learning path.
* **Purpose:** Takes users from absolute beginners (Passwords/MFA) to intermediate (Home Wi-Fi) and advanced (VPNs/Footprints). Every single step has a corresponding Markdown template generated to prevent broken links.

### 3. Scam Alerts (`/scams`)
* **Feature:** A directory of active fraud schemes categorized by urgency (High/Medium/Critical). Includes fully routed placeholder pages for modern scams (like WhatsApp hijack, job offers, or package delivery).
* **Purpose:** Tactical teardowns of active scams with real screenshots and immediate mitigation steps.

### 4. Cyber Dictionary (`/dictionary`)
* **Feature:** An A-to-Z index of complex technical jargon translated into simple, everyday English. Includes a client-side search UI, alphabet quick-jump links, and fully populated placeholder pages for core terminology.

### 5. News Explained (`/news`)
* **Feature:** We don't publish "breaking news." We decode complex security events.
* **Purpose:** Every news article follows a strict 4-question template: *What happened? Am I affected? Do I need to worry? What should I do right now?*

### 6. The Cyber Toolbox (`/tools`)
* **Feature:** Free, secure client-side interactive tools.
* **Implemented Tools:**
  * **Secure Password Generator:** A React island using `window.crypto` to generate mathematically strong passwords entirely inside the browser.
  * **URL Decoder:** Analyzes and unscrambles malformed or encoded links to reveal the "True Destination" to prevent phishing.
  * **Password Breach Checker:** Uses the secure `k-Anonymity` model to securely hash (SHA-1) and check if passwords have been compromised in data breaches without ever transmitting the full password.

### 7. Downloads Hub (`/downloads`)
* **Feature:** A centralized, categorized landing page containing printable awareness posters (for schools or offices) and PDF cheat sheets.

### 8. Custom 404 Safety Net (`/404`)
* **Feature:** A beautifully branded custom 404 page that catches any mistyped URLs, helping users find their way back home or directly into the search tools.

---

## 🛠️ Tech Stack

This site is built for maximum speed, security, and SEO:
* **Framework:** [Astro](https://astro.build/) (Static Site Generation)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Tailwind Typography 
* **Interactive UI:** [React](https://react.dev/) (For client-side "Islands")
* **Testing:** [Vitest](https://vitest.dev/) + React Testing Library (Verified at **99.18% test coverage**)
* **Hosting:** GitHub Pages (Automated via GitHub Actions)

---

## 📂 Project Structure

```text
/
├── .github/workflows/   # CI/CD pipelines (Auto-deploys to GitHub pages)
├── public/              # Static assets (images, PDFs, fonts)
├── src/
│   ├── components/      # React components (Must have accompanying .test.tsx files)
│   ├── layouts/         # Page wrappers (Layout.astro, MarkdownLayout.astro)
│   ├── styles/          # Global CSS and Tailwind imports
│   └── pages/           # File-based routing
│       ├── index.astro       # The Homepage
│       ├── 404.astro         # Branded Error Page
│       ├── dictionary/       # Dictionary index & markdown terms
│       ├── downloads/        # Downloads hub index & printable items
│       ├── learn/            # Zero to Hero curriculum index & modules
│       ├── news/             # News index & decoded news articles
│       ├── scams/            # Scam alerts index & markdown teardowns
│       └── tools/            # Toolbox index & interactive utilities
├── generate-stubs.js    # Developer utility for scaffolding missing links
└── vitest.config.ts     # Strict test coverage configurations
```

---

## ✍️ Content Authoring Guidelines

The site uses a **Markdown-First** architecture. To publish content, create a new `.md` file in the appropriate folder. 

**Mandatory Markdown Layout Template:**
Paste this `frontmatter` at the top of every new `.md` file:
```markdown
---
layout: ../../layouts/MarkdownLayout.astro
title: Your Article Title
category: [Scam Alert | Dictionary Term | Guide | News Explained | Downloads]
date: 2026-08-07
description: A short 1-2 sentence summary for Google Search.
---
```

### Content Templates by Pillar
To maintain consistency, writers and AI agents MUST follow these structures for the body content:

**For "News Explained" (`/src/pages/news/`)**
```markdown
## 1. What happened?
[Brief 3-sentence summary of the event]
## 2. Am I affected?
[Clear yes/no/maybe criteria]
## 3. Do I need to worry?
[Context on the actual risk to a normal consumer]
## 4. What should I do right now?
[Bulleted list of immediate, actionable steps]
```

**For "Scam Alerts" (`/src/pages/scams/`)**
```markdown
## What is it?
[Brief definition of the scam]
## How it works (The Teardown)
[Numbered list showing the scammer's exact steps]
## How to identify this scam
[Red flags to look out for]
## How to avoid it
[Preventative measures]
## What to do if you are affected
[Recovery steps, e.g., freeze card, report to FTC]
```

**For "Cyber Dictionary" (`/src/pages/dictionary/`)**
```markdown
## The Short Version
[A 1-2 sentence plain-English definition]
## The Everyday Analogy
[Compare the tech concept to a real-world physical concept, e.g., a firewall is like a bouncer at a club]
## Why it matters
[Why the average person should care about this term]
```

---

## 💻 Local Development & Testing Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies. |
| `npm run dev` | Starts the local development server at `localhost:4321`. |
| `npm run build` | Builds the production static site into the `./dist/` folder. |
| `npm run preview` | Previews your production build locally. |
| `npm run test` | Runs the Vitest unit testing suite. |
| `npm run test:coverage` | Runs tests and verifies the >95% code coverage mandate. |

---

## ☁️ Deployment

This project uses **GitHub Actions** for Continuous Deployment. Every time you push to the `main` branch, the `deploy.yml` workflow automatically:
1. Installs dependencies.
2. Runs the Vitest suite (the build will **fail and block deployment** if tests fail).
3. Builds the Astro static site.
4. Publishes to **GitHub Pages**.
