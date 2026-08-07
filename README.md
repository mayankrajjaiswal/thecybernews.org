# TheCyberNews.org 🛡️

**The world's most practical cybersecurity knowledge platform.**

Unlike traditional cybersecurity news websites that cater to IT professionals, **TheCyberNews.org** is built for everyday people—parents, students, senior citizens, and non-technical employees. Think of it as the "Wikipedia + Consumer Reports + Khan Academy" of cybersecurity.

## 🚀 The Vision & Core Pillars

The platform is structured around four main pillars, designed to be actionable and jargon-free:

1. **Zero to Hero (`/learn`):** A structured learning path taking users from absolute beginners to cybersecurity confident.
2. **Scam Alerts (`/scams`):** Tactical teardowns of active fraud schemes (like WhatsApp hijacking or UPI fraud) with real screenshots and immediate mitigation steps.
3. **Cyber Dictionary (`/dictionary`):** Complex technical jargon translated into simple, everyday English.
4. **Cyber Toolbox (`/tools`):** Free, secure client-side tools (like a Password Generator) and downloadable PDF cheat sheets.

---

## 🛠️ Tech Stack

This site is built for maximum speed, security, and SEO, utilizing a modern static site architecture:

* **Framework:** [Astro](https://astro.build/) (Static Site Generation)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Tailwind Typography (for automatic Markdown styling)
* **Interactive UI:** [React](https://react.dev/) (Used exclusively for client-side "Islands" like the Persona Selector and Web Tools)
* **Testing:** [Vitest](https://vitest.dev/) + React Testing Library (>95% coverage target)
* **Hosting:** GitHub Pages (Automated via GitHub Actions)

---

## 📂 Project Structure

```text
/
├── .github/workflows/   # CI/CD pipelines (Auto-deploys to GitHub pages)
├── public/              # Static assets (images, PDFs, fonts)
├── src/
│   ├── components/      # React and Astro UI components (e.g., PersonaSelector.tsx)
│   ├── layouts/         # Page wrappers (Layout.astro, MarkdownLayout.astro)
│   ├── styles/          # Global CSS and Tailwind imports
│   └── pages/           # File-based routing
│       ├── index.astro       # The Homepage
│       ├── dictionary/       # Dictionary index & markdown terms
│       ├── learn/            # Zero to Hero curriculum index & modules
│       ├── scams/            # Scam alerts index & markdown teardowns
│       └── tools/            # Toolbox index & interactive utilities
└── package.json
```

---

## ✍️ How to Add Content

You do not need to write code to add new articles! The site uses a **Markdown-First** architecture. 

To publish a new guide, scam alert, or dictionary term, simply create a new `.md` file in the appropriate folder (`src/pages/dictionary/`, `src/pages/scams/`, etc.).

**Required Markdown Template:**
Always paste this at the top of your `.md` file to automatically inherit the site's styling:

```markdown
---
layout: ../../layouts/MarkdownLayout.astro
title: Your Article Title
category: Scam Alert / Dictionary Term / Guide
date: 2026-08-07
description: A short 1-2 sentence summary for Google Search.
---

## Your Heading Here
Start writing your content here in plain text.
* Use bullet points
* **Bold text**
* [Links](https://example.com)
```

---

## 💻 Local Development Commands

All commands are run from the root of the project in your terminal:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies. |
| `npm run dev` | Starts the local development server at `localhost:4321`. |
| `npm run build` | Builds the production static site into the `./dist/` folder. |
| `npm run preview` | Previews your production build locally. |
| `npm run test` | Runs the Vitest unit testing suite. |
| `npm run test:coverage` | Runs tests and generates a test coverage report. |

---

## ☁️ Deployment

This project uses **GitHub Actions** for Continuous Deployment. 

Every time you push or merge a commit into the `main` branch, the `deploy.yml` workflow will automatically:
1. Install dependencies.
2. Run the test suite to ensure nothing is broken.
3. Build the Astro static site.
4. Publish the output directly to **GitHub Pages**.