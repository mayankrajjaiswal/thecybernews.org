# TheCyberNews.org 🛡️
**The world's most practical cybersecurity knowledge platform.**

Unlike traditional cybersecurity news websites that cater to IT professionals, **TheCyberNews.org** is built for everyday people—parents, students, senior citizens, and non-technical employees. Think of it as the "Wikipedia + Consumer Reports + Khan Academy" of cybersecurity.

---

## 🤖 AI Agent Guidelines
**Attention AI Assistants:** If you are reading this file to understand the project context, you MUST adhere to the following mandates:
1. **The Content Model (Astro Content Collections v7):** Do NOT place markdown files in `src/pages/`. All markdown content MUST be placed in their respective folders within `src/content/` (e.g., `src/content/scams/`). 
2. **Type-Safe Frontmatter:** All markdown files are validated at build-time by Zod schemas defined in `src/content.config.ts`. You must provide all required frontmatter fields (like `title`, `description`, `category`) or the build will fail. Do NOT include a `layout:` property in the frontmatter; layouts are handled dynamically by Astro routing.
3. **The Audience:** All text generation must be jargon-free and aimed at laypeople. No "IT speak" unless it is explicitly being defined in the Dictionary.
4. **The Stack:** **React** (`.tsx`) is used *strictly* for interactive client-side islands (like the Toolbox). Do not attempt to use React for standard page layouts; use Astro (`.astro`).
5. **Styling:** Use **Tailwind CSS v4**. Do not write custom CSS unless absolutely necessary. Rely on the `@tailwindcss/typography` plugin (`prose` classes) to style all markdown content.
6. **Testing:** This project maintains a strict **>95% test coverage** requirement using Vitest and React Testing Library. If you modify or add a React component in `src/components/`, you MUST update or create a corresponding `.test.tsx` file and verify coverage by running `npm run test:coverage`.

---

## 🚀 The Core Pillars & Implemented Features

The platform is structured around six main interconnected pillars:

### 1. The Home Hub & Audience Navigation (`/audience`)
* **Feature:** A fully responsive homepage featuring the **Persona Selector** (React Component) which links directly to dedicated **Audience Hubs** (e.g., `/audience/parent`).
* **Purpose:** The Audience Hubs dynamically read the `audience` tag from your markdown files and automatically assemble a customized landing page showing all guides and scam alerts relevant to that specific lifestyle.

### 2. Guided Learning Roadmaps (`/roadmaps`)
* **Feature:** Curated learning paths based on specific profiles (e.g., "Small Business Security" or "Family Internet Safety").
* **Purpose:** Instead of a generic "Zero to Hero" path, these roadmaps dynamically query the content database using the `audience` tag. This allows the system to automatically generate sequential curriculums tailored to specific user needs, expanding Feature 6 of the architectural plan.

### 3. Scam Alerts (`/scams`)
* **Feature:** A directory of active fraud schemes.
* **Purpose:** Tactical teardowns of active scams with real screenshots and immediate mitigation steps.

### 4. Cyber Dictionary (`/dictionary`)
* **Feature:** An A-to-Z index of complex technical jargon translated into simple, everyday English.

### 5. News Explained (`/news`)
* **Feature:** We don't publish "breaking news." We decode complex security events.
* **Purpose:** Every news article follows a strict 4-question template: *What happened? Am I affected? Do I need to worry? What should I do right now?*

### 6. The Cyber Toolbox (`/tools`)
* **Feature:** Free, secure client-side interactive tools.
* **Implemented Tools:** 
  * **Secure Password Generator:** Generate mathematically strong passwords using `window.crypto`.
  * **URL Decoder:** Analyzes malformed links to reveal the "True Destination."
  * **Password Breach Checker:** Uses secure `k-Anonymity` to check for leaked passwords.
  * **Secure Hash Generator:** Computes SHA-256 and SHA-512 cryptographic hashes.
  * **Base64 Encoder/Decoder:** Safely encode and decode strings.
  * **JWT Decoder:** Analyze JSON Web Tokens without transmitting sensitive payload claims.

### 7. Curated Resources (`/resources`)
* **Feature:** A directory of trusted external organizations, government agencies, and community databases.
* **Purpose:** Provides a safe, vetted list of external links (like CISA or HaveIBeenPwned) so users don't have to rely on Google search results where scammers buy fake ads.

### 8. Global Search Engine (Pagefind)
* **Feature:** A highly optimized, strictly client-side search engine integrated into the main navigation header.
* **Purpose:** Allows users to perform instant, fuzzy searches across the entire dictionary, scam database, and educational hubs without relying on a slow backend server.

### 9. Internal Linking & SEO Engine
* **Internal Linking:** Every article automatically generates a "Continue Learning" or "Related Links" section at the bottom, ensuring users never hit a dead end.
* **Breadcrumb Navigation:** Every single article and guide automatically generates SEO-friendly breadcrumb navigation at the top of the page.
* **Automated SEO Schemas:** The site automatically generates Canonical URLs, OpenGraph (Facebook) tags, Twitter Cards, and `robots.txt`. Most importantly, it injects structured JSON-LD (`Article` and `BreadcrumbList`) into every Markdown page, ensuring Google indexes the content perfectly for rich search results. An automated XML Sitemap is generated at `sitemap-index.xml`.

---

## 🛠️ Tech Stack

* **Framework:** [Astro](https://astro.build/) (Static Site Generation with Content Collections v7)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Tailwind Typography 
* **Interactive UI:** [React](https://react.dev/) (For client-side "Islands")
* **Testing:** [Vitest](https://vitest.dev/) + React Testing Library (Verified at **99.18% test coverage**)
* **Hosting:** GitHub Pages (Automated via GitHub Actions)

---

## 📂 Project Structure

```text
/
├── .github/workflows/   # CI/CD pipelines
├── public/              # Static assets (images, PDFs)
├── src/
│   ├── components/      # React components (with .test.tsx files)
│   ├── content/         # ⚠️ ALL MARKDOWN CONTENT GOES HERE
│   │   ├── dictionary/
│   │   ├── learn/
│   │   ├── news/
│   │   └── scams/
│   ├── layouts/         # Page wrappers (Layout.astro, MarkdownLayout.astro)
│   └── pages/           # Astro Routing
│       ├── [pillar]/[slug].astro  # Dynamic content renderers
│       └── ...                    # Static index pages
├── src/content.config.ts # Zod schemas for the Content Collections
└── vitest.config.ts     # Strict test coverage configurations
```

---

## ✍️ Content Authoring Guidelines

To publish content, create a new `.md` file inside the appropriate `src/content/` subfolder.

**Mandatory Frontmatter (Metadata):**
Because we use strict Content Collections, your markdown file MUST start with this frontmatter (do NOT include a `layout` tag):

```markdown
---
title: Your Article Title
category: [Scam Alert | Dictionary Term | Guide | News Explained]
description: A short 1-2 sentence summary for Google Search and index cards.
audience: ['parent', 'student', 'business', 'employee', 'senior', 'it'] # Add any relevant personas here
---
```
*(Note: Some collections require extra fields. E.g., `src/content/scams/` requires a `severity: [Low | Medium | High | Critical]` field. Check `src/content.config.ts` for exact schemas).*

### Content Templates by Pillar
To maintain consistency, writers and AI agents MUST follow these structures for the body content:

**For "News Explained" (`src/content/news/`)**
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

**For "Scam Alerts" (`src/content/scams/`)**
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
[Recovery steps]
```

**For "Curated Resources" (`src/content/resources/`)**
*Note: The frontmatter for resources must include `url` and `type: [Government | Framework | Community | Corporate]`.*
```markdown
## Overview
[What is this organization or website?]
## Why It Matters
[Why a layman or business owner should care about this resource]
## Popular Resources
[Bulleted list of their top tools or documents]
```

---

## 💻 Local Development Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Installs dependencies. |
| `npm run dev` | Starts local dev server at `localhost:4321`. |
| `npm run build` | Builds production site to `./dist/`. |
| `npm run test` | Runs the Vitest unit testing suite. |
| `npm run test:coverage` | Runs tests and verifies the >95% code coverage mandate. |
