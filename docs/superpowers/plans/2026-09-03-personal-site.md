# Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Samuel Chen's dark-first, stripe.dev-inspired personal site (homepage, three project pages, HTML résumé, 404) in Astro, deployed to GitHub Pages.

**Architecture:** Static Astro 7 site with no UI framework. Résumé facts live in `src/data/profile.ts` (consumed by the homepage and `/resume/`); project pages are MDX entries in a schema-validated content collection. Styling is CSS custom-property tokens plus scoped component CSS; the only client JS is an inline theme script and a reveal-on-scroll observer. Verification is build-output tests (`node:test` over `dist/`) plus a link checker, Lighthouse, and screenshots.

**Tech Stack:** Astro 7.3, `@astrojs/mdx` 8, `@astrojs/sitemap` 3.7, `@fontsource-variable/inter` 5.3, `@fontsource-variable/jetbrains-mono` 5.3, Node 24 (built-in TypeScript type-stripping and `node:test`), Playwright (via `npx`, using installed Chrome) and Lighthouse (via `npx`) for verification only.

**Spec:** `docs/superpowers/specs/2026-09-03-personal-site-design.md`

## Global Constraints

- Node `>=22.12.0` (`package.json` engines); developer machine runs v24.20.0.
- `astro.config.mjs`: `site: 'https://samueljchen08.github.io'`, **no `base`** (user-site repo serves from root).
- Dark is the design target; light mode is a full token swap and must be legible. Theme toggle stores `theme` in `localStorage`; initial state follows `prefers-color-scheme`.
- Fonts: Inter Variable (reading), JetBrains Mono Variable (labels, dates, tags, numbers, nav). Self-hosted only — nothing loaded from Google at runtime.
- No Tailwind, no React/Vue/Svelte, no gradients, no glassmorphism, no shadows beyond a 1px border.
- Motion ≤ 200 ms; everything motion-related disabled under `prefers-reduced-motion: reduce`.
- Hero: name → mono meta line, exact text `MIT CS-AI '27 · Cambridge, MA / Bellevue, WA` → three actions `résumé (pdf) · github · email`. **No tagline.**
- Content rule: every figure is transcribed from a repository README, the tracking notebook's stored outputs (`docs/superpowers/reference/multi-object-tracking-figures.md`), or the résumé PDF. Nothing rounded, embellished, or inferred.
- No writing/blog/notes section. No forms, analytics, or backend.
- Spacing scale: 8 / 16 / 24 / 40 / 64 / 96 px. Max content width 1100px; single column below 768px; body 17px / 1.6; measure ≤ 68ch.
- All internal links use trailing slashes (`/resume/`, `/projects/opsgym/`); `trailingSlash: 'always'` in `astro.config.mjs` enforces it.
- Commit after every task with the trailer:
  ```
  Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud
  ```
- Dev server: `npx astro dev --background` (see `AGENTS.md`); stop with `npx astro dev stop`.

---

## File structure

```
astro.config.mjs                  site URL, mdx + sitemap integrations, rehype table-wrap
package.json                      scripts: dev / build / preview / check / test / check-links
tsconfig.json                     strict; excludes dist and tests
public/
  samuel-chen-resume.pdf          (kept) the downloadable résumé
  favicon.svg                     mono "sc" mark
  robots.txt                      allow all + sitemap pointer
src/
  data/profile.ts                 single source for every résumé fact
  content.config.ts               `projects` collection schema
  content/projects/
    opsgym.mdx
    agentic-commerce-lab.mdx
    multi-object-tracking.mdx
  styles/tokens.css               palette (light + dark), fonts, spacing, measure
  styles/global.css               reset, typography, links, tables, tags, reveal, print
  layouts/Base.astro              <head> (meta/OG/canonical), theme script, Nav, Footer, reveal script
  components/
    Nav.astro                     sticky bar: brand, links, ThemeToggle
    ThemeToggle.astro             button + toggle script
    Footer.astro                  contact links + colophon
    Section.astro                 `// label` + slot, with reveal
    Tags.astro                    mono tag list
    ProjectEntry.astro            homepage row for one project
    Timeline.astro                dated rows (experience + activities)
    ResultStrip.astro             headline numbers under a project header
    Callout.astro                 bordered block (Limits)
    Toc.astro                     sticky mini-TOC from MDX headings
  pages/
    index.astro                   homepage
    resume.astro                  HTML résumé + print stylesheet
    404.astro
    projects/[slug].astro         project page
tests/
  profile.test.ts                 data-shape tests for profile.ts
  dist.test.mjs                   build-output tests (runs after `astro build`)
scripts/
  check-links.mjs                 walks dist/, verifies internal + external hrefs
  screenshots.mjs                 Playwright screenshots, 3 widths × 2 themes × every route
docs/superpowers/reference/
  multi-object-tracking-figures.md (exists) notebook-derived figures for W-3
```

---

### Task 1: Fresh-start baseline

Delete the old build, adjust dependencies and scripts, and commit a clean baseline that builds.

**Files:**
- Delete: `src/`, `public/favicon.ico`, `public/favicon.svg`, `.impeccable/`, `README.md`, `PRODUCT.md`, `DESIGN.md` (if present), `dist/`, `.astro/`
- Modify: `package.json`, `tsconfig.json`, `astro.config.mjs`, `.gitignore`
- Create: `src/pages/index.astro` (temporary placeholder so the build has a page)

**Interfaces:**
- Produces: `npm run build`, `npm run check`, `npm test`, `npm run check-links` scripts that later tasks call.

- [ ] **Step 1: Delete the old build**

```bash
cd "/Users/sam/personal website"
git rm -r -q src public/favicon.ico public/favicon.svg README.md PRODUCT.md
git rm -r -q --cached .impeccable 2>/dev/null; rm -rf .impeccable
rm -f DESIGN.md; git rm -q --cached DESIGN.md 2>/dev/null
rm -rf dist .astro
ls  # expect: AGENTS.md CLAUDE.md astro.config.mjs docs node_modules package.json package-lock.json public tsconfig.json
ls public  # expect: samuel-chen-resume.pdf
```

- [ ] **Step 2: Swap fonts and add scripts**

```bash
npm uninstall @fontsource-variable/libre-franklin @fontsource/sometype-mono @astrojs/markdown-remark @astrojs/markdown-satteri
npm install @fontsource-variable/inter@5.3.0 @fontsource-variable/jetbrains-mono@5.3.0
```

Then edit `package.json` so `scripts` reads exactly:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "test": "astro build && node --test 'tests/*.test.ts' 'tests/*.test.mjs'",
  "check-links": "node scripts/check-links.mjs",
  "astro": "astro"
}
```

(`@astrojs/check` and `typescript` are needed for `astro check`; install them as dev deps: `npm install -D @astrojs/check typescript`.)

- [ ] **Step 3: tsconfig excludes tests**

Write `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "tests", "scripts"]
}
```

- [ ] **Step 4: astro.config.mjs**

Write `astro.config.mjs` (keeps the table-wrap plugin, which mobile tables need):

```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/** Wrap every markdown table in a scroll container so wide tables scroll inside themselves. */
function rehypeWrapTables() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        walk(child);
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-wrap'] },
            children: [child],
          };
        }
        return child;
      });
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://samueljchen08.github.io',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  markdown: { rehypePlugins: [rehypeWrapTables] },
});
```

- [ ] **Step 5: .gitignore — drop the impeccable lines, add screenshots dir**

Replace the trailing `# Impeccable working files` block (three lines) with:

```
# verification output
screenshots/
```

- [ ] **Step 6: Placeholder page so the build is green**

Create `src/pages/index.astro`:

```astro
---
---
<html lang="en"><head><meta charset="utf-8" /><title>Samuel Chen</title></head><body><main id="main">Samuel Chen</main></body></html>
```

- [ ] **Step 7: Verify the build**

Run: `npm run build`
Expected: `[build] Complete!` and `dist/index.html` exists. Run `npm run check` — expected `0 errors`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Reset to a clean Astro baseline for the new site

Removes the working-papers build (kept in history at 13ac5cb), swaps fonts to
Inter + JetBrains Mono, adds check/test/check-links scripts.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 2: Résumé data — `profile.ts`

**Files:**
- Create: `src/data/profile.ts`
- Test: `tests/profile.test.ts`

**Interfaces:**
- Produces (imported by Nav, Footer, index, resume):
  ```ts
  export interface Role { company: string; title: string; location: string; start: string; end: string; track: 'engineering' | 'finance'; bullets: string[] }
  export interface Activity { name: string; role?: string; start?: string; end?: string; bullets?: string[] }
  export const person: { name; email; phone; locations: string[]; github; linkedin; resumePdf }
  export const education: { school; degree; minor; gpa; expected; location; coursework: string[] }
  export const roles: Role[]            // site order: Nexus, Goldman, Barings, Cercano, Sloan
  export const activities: Activity[]   // basketball first
  export const skills: string[]
  export const interests: string[]
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/profile.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { person, education, roles, activities, skills, interests } from '../src/data/profile.ts';

test('person has every public contact channel', () => {
  assert.equal(person.name, 'Samuel Chen');
  assert.equal(person.email, 'samchen@mit.edu');
  assert.equal(person.github, 'https://github.com/samueljchen08');
  assert.equal(person.linkedin, 'https://www.linkedin.com/in/samuelj-chen');
  assert.equal(person.resumePdf, '/samuel-chen-resume.pdf');
  assert.deepEqual(person.locations, ['Cambridge, MA', 'Bellevue, WA']);
});

test('education matches the résumé PDF', () => {
  assert.equal(education.gpa, '4.95/5.0');
  assert.equal(education.expected, 'May 2027');
  assert.ok(education.coursework.includes('Natural Language Processing'));
});

test('roles are in site order with a track on each', () => {
  assert.deepEqual(
    roles.map((r) => r.company),
    ['Nexus AI (Courtex)', 'Goldman Sachs', 'Barings', 'Cercano Management (Vulcan Capital)', 'MIT Sloan School of Management'],
  );
  for (const r of roles) {
    assert.ok(['engineering', 'finance'].includes(r.track), `${r.company} has a track`);
    assert.ok(r.bullets.length >= 1, `${r.company} has bullets`);
  }
});

test('activities start with basketball and carry the user-supplied titles', () => {
  assert.equal(activities[0].name, 'MIT Varsity Basketball');
  const byName = Object.fromEntries(activities.map((a) => [a.name, a]));
  assert.equal(byName['Sloan Business Club'].role, 'Managing Director of Finance');
  assert.equal(byName['StartLabs'].role, 'VP of External Relations');
});

test('skills and interests are non-empty', () => {
  assert.ok(skills.length >= 4);
  assert.ok(interests.includes('Basketball'));
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/profile.test.ts`
Expected: FAIL — `Cannot find module '.../src/data/profile.ts'`.

- [ ] **Step 3: Write `src/data/profile.ts`**

Every string below is transcribed from `public/samuel-chen-resume.pdf` except the two titles marked USER-SUPPLIED.

```ts
/**
 * Single source of truth for everything the résumé PDF also states.
 * The homepage and /resume/ both read from here, so they cannot drift.
 * Keep in sync with public/samuel-chen-resume.pdf.
 */

export interface Role {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  /** Engineering roles lead on the homepage; finance roles support. */
  track: 'engineering' | 'finance';
  /** Ordered so the first two are the most engineering-relevant — the homepage shows only those. */
  bullets: string[];
}

export interface Activity {
  name: string;
  role?: string;
  start?: string;
  end?: string;
  bullets?: string[];
}

export const person = {
  name: 'Samuel Chen',
  email: 'samchen@mit.edu',
  phone: '(206) 475-8031',
  locations: ['Cambridge, MA', 'Bellevue, WA'],
  github: 'https://github.com/samueljchen08',
  linkedin: 'https://www.linkedin.com/in/samuelj-chen',
  resumePdf: '/samuel-chen-resume.pdf',
} as const;

export const education = {
  school: 'Massachusetts Institute of Technology',
  location: 'Cambridge, MA',
  degree: 'BS in Computer Science — Artificial Intelligence',
  minor: 'Minor in Finance',
  gpa: '4.95/5.0',
  expected: 'May 2027',
  coursework: [
    'Representation, Inference, and Reasoning in AI',
    'Natural Language Processing',
    'Computer Vision',
    'Machine Learning',
    'Algorithms',
    'Dynamic System Modeling and Control Design',
    'Discrete Math',
    'Probability & Statistics',
    'Linear Algebra',
    'Differential Equations',
    'Probability and Random Variables',
    'Fundamentals of Programming',
  ],
} as const;

export const roles: Role[] = [
  {
    company: 'Nexus AI (Courtex)',
    title: 'Co-Founder',
    location: 'Cambridge, MA',
    start: 'Apr 2025',
    end: 'Present',
    track: 'engineering',
    bullets: [
      'Built end-to-end machine learning pipelines on multi-season NCAA basketball datasets to forecast player performance, transfer fit, and outcomes, including data ingestion, feature engineering, model training, backtesting, and error analysis',
      'Built a retrieval-augmented LLM scouting platform that grounds natural-language analysis in structured player and team data, enabling coaches to query players, evaluate roster needs, and generate automated scouting insights',
      'Trained and evaluated predictive models for player performance and transfer fit using temporally separated train/test sets; performed feature engineering, hyperparameter tuning, and error analysis to study out-of-sample generalization',
      'Established partnerships with 20+ Division 1 basketball programs, including national runner-up Houston University',
    ],
  },
  {
    company: 'Goldman Sachs',
    title: 'FIG Investment Banking Intern',
    location: 'New York, NY',
    start: 'Jun 2026',
    end: 'Aug 2026',
    track: 'finance',
    bullets: [
      'Supported 8 M&A and coverage teams across Financial Institutions, performing company and industry research, valuation and transaction analysis, and preparation of materials for senior bankers and client discussions',
      'Contributed to the buy-side advisory for KKR, Dragoneer, and Amwins on the ~$5.5B acquisition of Steadfast Group, analyzing transaction dynamics, valuation, strategic rationale, and insurance brokerage industry considerations',
    ],
  },
  {
    company: 'Barings',
    title: 'Capital Solutions (Private Equity and Special Situations) Intern',
    location: 'Charlotte, NC',
    start: 'Jun 2025',
    end: 'Aug 2025',
    track: 'finance',
    bullets: [
      'Screened and led investment memo drafting for 4 potential debt and equity investments using cash flow models and returns analysis in combination with market research, investor presentations and management calls',
    ],
  },
  {
    company: 'Cercano Management (Vulcan Capital)',
    title: 'Public Equities Intern',
    location: 'Bellevue, WA',
    start: 'Jun 2024',
    end: 'Aug 2024',
    track: 'finance',
    bullets: [
      'Engineered 7 financial tools in Python to automate trading research and backtesting, including portfolio tracking against benchmarks, industry margins/growth, momentum/moving averages, volatility in levered indices, and rolling correlations',
      'Screened over 3,000 companies to find top-quartile performers in FCF margin, EPS growth, ROIC, YTD performance, and more to complement fundamental approach for portfolio manager’s investment decisions for $10+ billion-dollar fund',
    ],
  },
  {
    company: 'MIT Sloan School of Management',
    title: 'Researcher',
    location: 'Cambridge, MA',
    start: 'May 2024',
    end: 'Sep 2024',
    track: 'engineering',
    bullets: [
      'Built probabilistic Monte Carlo season simulators in Python that model team skill distributions, derive matchup win probabilities, and fit simulation parameters to historical NBA, NFL, NHL, MLB, and European soccer outcomes',
      'Conducted cross-sport empirical analysis across 15+ leagues and competitions, engineering quantitative measures of competitive balance and durable dominance and using regression analysis to study relationships between parity, performance dispersion, and sustained team success',
    ],
  },
];

export const activities: Activity[] = [
  {
    name: 'MIT Varsity Basketball',
    role: 'Recruited Collegiate Athlete (Point Guard)',
    start: 'Sep 2023',
    end: 'May 2026',
    bullets: [
      'Appeared in all 24 games as a freshman and played 6th most minutes on team, averaging 15.4 minutes per game',
      'Scored 10 points, grabbed 4 rebounds, and distributed 4 assists against the #4 D3 team in the country, Keene State',
      '6th in points and 8th in assists in Washington State High School Basketball, 4-year varsity starter in largest division (4A)',
    ],
  },
  // USER-SUPPLIED title (2026-09-03); the résumé PDF lists the club without a title.
  { name: 'Sloan Business Club', role: 'Managing Director of Finance' },
  // USER-SUPPLIED title (2026-09-03); the résumé PDF lists the club without a title.
  { name: 'StartLabs', role: 'VP of External Relations' },
  { name: 'Brass Rat Investments' },
  { name: 'Splash' },
];

export const skills = ['Python', 'HTML', 'CSS', 'JavaScript', 'Data Analysis', 'Modeling'];

export const interests = [
  'Basketball',
  'Personal Investing',
  'Podcasts',
  'Biking',
  'Skiing',
  'Hiking',
  'Working out',
  'Fantasy Football',
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/profile.test.ts`
Expected: `# pass 5`, `# fail 0`.

- [ ] **Step 5: Commit**

```bash
git add src/data/profile.ts tests/profile.test.ts
git commit -m "Add profile.ts as the single source for résumé facts

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 3: Design foundation — tokens, global CSS, Base layout, Nav, ThemeToggle, Footer

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/ThemeToggle.astro`, `src/components/Footer.astro`, `public/favicon.svg`, `public/robots.txt`
- Modify: `src/pages/index.astro` (use Base)
- Test: `tests/dist.test.mjs`

**Interfaces:**
- Consumes: `person` from `src/data/profile.ts`.
- Produces: `<Base title description>` layout with a default slot; CSS classes `.container`, `.label`, `.mono`, `.tags`, `.table-wrap`, `.reveal`, `.btn`; tokens listed in `tokens.css`.

- [ ] **Step 1: Write the failing build-output tests**

Create `tests/dist.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const html = (p) => readFileSync(join(dist, p), 'utf8');

test('homepage builds with nav, theme script, and meta', () => {
  const page = html('index.html');
  assert.match(page, /<title>Samuel Chen<\/title>/);
  assert.match(page, /<meta property="og:title"/);
  assert.match(page, /<link rel="canonical" href="https:\/\/samueljchen08\.github\.io\/"/);
  assert.match(page, /localStorage\.getItem\('theme'\)/);
  for (const href of ['/#work', '/#experience', '/resume/', 'https://github.com/samueljchen08']) {
    assert.ok(page.includes(`href="${href}"`), `nav links to ${href}`);
  }
  assert.match(page, /aria-label="Toggle theme"/);
});

test('fonts are self-hosted, nothing from Google', () => {
  const page = html('index.html');
  assert.doesNotMatch(page, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});

test('robots and favicon ship', () => {
  assert.ok(existsSync(join(dist, 'robots.txt')));
  assert.ok(existsSync(join(dist, 'favicon.svg')));
  assert.match(html('robots.txt'), /Sitemap: https:\/\/samueljchen08\.github\.io\/sitemap-index\.xml/);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: build succeeds (placeholder page), then FAIL on `og:title` / nav links.

- [ ] **Step 3: `src/styles/tokens.css`**

```css
/* Design tokens. Light is the base; dark overrides under [data-theme="dark"].
   The inline script in Base.astro always sets data-theme before first paint. */
:root {
  color-scheme: light;
  --bg: #f6f7f9;
  --bg-raised: #ffffff;
  --border: #e2e5ea;
  --fg: #14171c;
  --fg-muted: #5c636e;
  --accent: #6b5cff;
  --accent-contrast: #ffffff;
  --ok: #1f8a4c;
  --bad: #c0392b;
  --grid-dot: rgba(20, 23, 28, 0.08);

  --font-sans: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, monospace;

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 40px;
  --space-5: 64px;
  --space-6: 96px;

  --max: 1100px;
  --measure: 68ch;
  --radius: 4px;
  --dur: 160ms;
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --bg: #0b0d10;
  --bg-raised: #12151a;
  --border: #1f242b;
  --fg: #e6e8eb;
  --fg-muted: #8b929c;
  --accent: #8b7cff;
  --accent-contrast: #0b0d10;
  --ok: #4cc38a;
  --bad: #f16a6a;
  --grid-dot: rgba(230, 232, 235, 0.08);
}

@media (prefers-reduced-motion: reduce) {
  :root { --dur: 0ms; }
}
```

- [ ] **Step 4: `src/styles/global.css`**

```css
*,
*::before,
*::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { margin: 0; line-height: 1.15; letter-spacing: -0.02em; font-weight: 700; }
h1 { font-size: clamp(2.5rem, 7vw, 4.5rem); letter-spacing: -0.04em; }
h2 { font-size: 1.75rem; }
h3 { font-size: 1.25rem; }
p { margin: 0 0 var(--space-2); max-width: var(--measure); }
ul, ol { margin: 0 0 var(--space-2); padding-left: 1.25em; max-width: var(--measure); }
li + li { margin-top: var(--space-1); }
strong { font-weight: 600; }
code, pre, kbd { font-family: var(--font-mono); font-size: 0.9em; }
pre {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-2);
  overflow-x: auto;
  line-height: 1.5;
}
pre code { font-size: 0.85rem; }
hr { border: 0; border-top: 1px solid var(--border); margin: var(--space-4) 0; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; text-underline-offset: 0.2em; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }

.container { max-width: var(--max); margin: 0 auto; padding: 0 var(--space-3); }
@media (max-width: 767px) { .container { padding: 0 var(--space-2); } }

.mono { font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0; }
.label {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--fg-muted);
  text-transform: lowercase;
  margin: 0 0 var(--space-3);
}
.label::before { content: '// '; color: var(--accent); }

.btn {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--fg);
  background: var(--bg-raised);
  transition: border-color var(--dur) ease, background var(--dur) ease;
}
.btn:hover { text-decoration: none; border-color: var(--accent); }
.btn--primary { background: var(--accent); color: var(--accent-contrast); border-color: var(--accent); }
.btn--primary:hover { filter: brightness(1.08); }

.tags { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: var(--space-1); max-width: none; }
.tags li { margin: 0; }
.tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 3px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--fg-muted);
  background: var(--bg-raised);
}

.table-wrap { overflow-x: auto; margin: 0 0 var(--space-3); border: 1px solid var(--border); border-radius: var(--radius); }
table { border-collapse: collapse; width: 100%; font-size: 0.95rem; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
th { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 500; color: var(--fg-muted); background: var(--bg-raised); }
td { font-variant-numeric: tabular-nums; }
tr:last-child td { border-bottom: 0; }

.skip { position: absolute; left: -9999px; top: 8px; z-index: 100; padding: 8px 12px; background: var(--accent); color: var(--accent-contrast); }
.skip:focus { left: 8px; }

/* Reveal-on-scroll. Only hides content when JS is running, so no-JS gets everything. */
@media (prefers-reduced-motion: no-preference) {
  html.js .reveal { opacity: 0; transform: translateY(8px); transition: opacity var(--dur) ease, transform var(--dur) ease; }
  html.js .reveal.is-visible { opacity: 1; transform: none; }
}

@media print {
  .nav, .site-footer, .theme-toggle, .skip { display: none !important; }
  body { background: #fff; color: #000; font-size: 11pt; }
  a { color: #000; }
}
```

- [ ] **Step 5: `src/components/ThemeToggle.astro`**

```astro
<button class="theme-toggle" type="button" aria-label="Toggle theme" title="Toggle theme">
  <svg class="icon icon--sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
  <svg class="icon icon--moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
</button>

<style>
  .theme-toggle {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; padding: 0;
    background: transparent; border: 1px solid var(--border); border-radius: var(--radius);
    color: var(--fg-muted); cursor: pointer;
    transition: border-color var(--dur) ease, color var(--dur) ease;
  }
  .theme-toggle:hover { border-color: var(--accent); color: var(--fg); }
  .icon--moon { display: none; }
  :global(:root[data-theme='dark']) .icon--sun { display: none; }
  :global(:root[data-theme='dark']) .icon--moon { display: block; }
</style>

<script>
  document.querySelectorAll<HTMLButtonElement>('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const root = document.documentElement;
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch {}
    });
  });
</script>
```

- [ ] **Step 6: `src/components/Nav.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
import { person } from '../data/profile';

const path = Astro.url.pathname;
const links = [
  { href: '/#work', label: 'projects' },
  { href: '/#experience', label: 'experience' },
  { href: '/resume/', label: 'résumé' },
  { href: person.github, label: 'github', external: true },
];
---

<header class="nav">
  <div class="container nav-inner">
    <a class="brand" href="/">samuel chen</a>
    <nav aria-label="Primary">
      <ul>
        {links.map((l) => (
          <li>
            <a
              href={l.href}
              aria-current={path === l.href ? 'page' : undefined}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >{l.label}</a>
          </li>
        ))}
      </ul>
      <ThemeToggle />
    </nav>
  </div>
</header>

<style>
  .nav {
    position: sticky; top: 0; z-index: 10;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 52px; }
  .brand, nav a { font-family: var(--font-mono); font-size: 0.85rem; color: var(--fg); }
  .brand { font-weight: 600; }
  nav { display: flex; align-items: center; gap: var(--space-2); }
  ul { list-style: none; margin: 0; padding: 0; display: flex; gap: var(--space-2); }
  li { margin: 0; }
  nav a { color: var(--fg-muted); transition: color var(--dur) ease; }
  nav a:hover, nav a[aria-current='page'] { color: var(--fg); text-decoration: none; }
  @media (max-width: 767px) { ul { gap: 12px; } nav a, .brand { font-size: 0.8rem; } }
</style>
```

- [ ] **Step 7: `src/components/Footer.astro`**

```astro
---
import { person } from '../data/profile';
const year = new Date().getFullYear();
---

<footer class="site-footer">
  <div class="container footer-inner">
    <ul class="contact">
      <li><a href={`mailto:${person.email}`}>{person.email}</a></li>
      <li><a href={person.github} target="_blank" rel="noopener noreferrer">github</a></li>
      <li><a href={person.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a></li>
      <li><a href={`tel:${person.phone.replace(/[^\d+]/g, '')}`}>{person.phone}</a></li>
    </ul>
    <p class="colophon">© {year} {person.name} · built with Astro</p>
  </div>
</footer>

<style>
  .site-footer { border-top: 1px solid var(--border); margin-top: var(--space-6); padding: var(--space-4) 0; }
  .footer-inner { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-2); }
  .contact, .colophon { font-family: var(--font-mono); font-size: 0.8rem; color: var(--fg-muted); margin: 0; }
  .contact { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: var(--space-2); max-width: none; }
  .contact li { margin: 0; }
  .contact a { color: var(--fg-muted); }
  .contact a:hover { color: var(--fg); }
</style>
```

- [ ] **Step 8: `src/layouts/Base.astro`**

```astro
---
import '../styles/tokens.css';
import '../styles/global.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Samuel Chen" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary" />
    <script is:inline>
      (function () {
        var stored = null;
        try { stored = localStorage.getItem('theme'); } catch (e) {}
        var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.dataset.theme = stored || (dark ? 'dark' : 'light');
        document.documentElement.classList.add('js');
      })();
    </script>
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
    <Nav />
    <slot />
    <Footer />
    <script>
      const els = document.querySelectorAll('.reveal');
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('is-visible'));
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
              }
            }
          },
          { rootMargin: '0px 0px -10% 0px' },
        );
        els.forEach((el) => io.observe(el));
      }
    </script>
  </body>
</html>
```

- [ ] **Step 9: favicon and robots**

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0b0d10"/>
  <text x="32" y="41" text-anchor="middle" font-family="JetBrains Mono, Menlo, monospace" font-size="26" font-weight="600" fill="#8b7cff">sc</text>
</svg>
```

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://samueljchen08.github.io/sitemap-index.xml
```

- [ ] **Step 10: Replace the placeholder `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { person } from '../data/profile';
---

<Base title="Samuel Chen" description="Samuel Chen — MIT Computer Science (AI) '27. AI systems, and the measurement that decides whether they work.">
  <main id="main">
    <div class="container">
      <h1>{person.name}</h1>
    </div>
  </main>
</Base>
```

- [ ] **Step 11: Run tests and typecheck**

Run: `npm test && npm run check`
Expected: `# pass 8` (5 profile + 3 dist), `# fail 0`; `astro check` reports 0 errors.

- [ ] **Step 12: Eyeball it**

Run: `npx astro dev --background`, open `http://localhost:4321/`. Confirm: dark ground if the OS is dark, toggle flips it and persists on reload, nav is sticky, no Google font requests in the Network tab. Then `npx astro dev stop`.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Add design tokens, global styles, Base layout, nav, footer, theme toggle

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 4: Projects collection schema + minimal project route + opsgym

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/opsgym.mdx`, `src/pages/projects/[slug].astro` (minimal — Task 8 finishes it)
- Test: `tests/dist.test.mjs` (append)

**Interfaces:**
- Produces: collection `projects` with `CollectionEntry<'projects'>` where `entry.id` is the slug (`opsgym`, …) and `entry.data` matches the schema below. Route `/projects/<id>/`.

- [ ] **Step 1: Append failing test**

Append to `tests/dist.test.mjs`:

```js
test('opsgym project page builds with its headline figures', () => {
  const page = html('projects/opsgym/index.html');
  assert.match(page, /<title>opsgym — Samuel Chen<\/title>/);
  assert.ok(page.includes('22.5'), 'noise floor figure present');
  assert.ok(page.includes('0.450'), 'pass@1 present');
  assert.ok(page.includes('https://github.com/samueljchen08/opsgym'));
});
```

Run: `npm test` → expected FAIL: `ENOENT ... projects/opsgym/index.html`.

- [ ] **Step 2: `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const figure = z.object({ value: z.string(), caption: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    question: z.string(),
    period: z.string(),
    repo: z.string().url(),
    live: z.string().url().optional(),
    stack: z.array(z.string()).min(1),
    headline: figure,
    results: z.array(figure).min(2).max(4),
    limits: z.string(),
  }),
});

export const collections = { projects };
```

- [ ] **Step 3: `src/content/projects/opsgym.mdx`**

Frontmatter exactly as below. Body: run `git show 13ac5cb:src/content/projects/opsgym.mdx`, take everything **after** the closing `---` of its frontmatter, and paste it unchanged (it is a verified transcription of the README; spot-check three figures against `https://raw.githubusercontent.com/samueljchen08/opsgym/main/README.md`: the 51 of 59 complaints, the 12.5% false-positive rate, and the funnel's 24). Then append the closing `## What is not done` section given below if the old body lacks one.

```mdx
---
title: 'opsgym'
order: 1
question: 'What makes an agentic RL environment trustworthy enough to train on?'
period: '2026'
repo: 'https://github.com/samueljchen08/opsgym'
stack: ['Python', 'SQLite', 'GRPO', 'LoRA', 'PyTorch']
headline:
  value: '22.5 pts'
  caption: 'the measured noise floor — any smaller improvement is not a result'
results:
  - value: '0.450'
    caption: 'pass@1, held out by world · 95% CI [0.325, 0.575]'
  - value: '12.5%'
    caption: 'false positives an outcome-only verifier hands out'
  - value: '176 → 24'
    caption: 'validation funnel, every rejection logged'
  - value: '0 GPU'
    caption: 'training code written and wired, deliberately unexecuted'
limits: 'No training run and no GPU: a single LoRA run on 495 records would produce a delta well inside the 22.5-point noise floor, so training/train.py is written and wired but has not been executed. All results use a policy simulator whose success probability is a function of task features chosen by the author, so difficulty spread and throughput are properties of the pipeline, not of any real policy. Grader reliability (89.7%) is measured on a synthetic reference set and is not a claim about real-world grader accuracy.'
---
```

`## What is not done, and why` (append only if missing from the old body):

```md
## What is not done, and why

- **No training run.** No GPU. A single LoRA run on 495 records would produce a delta well inside the noise floor measured above. `training/train.py` is written and the reward function is wired; it has not been executed.
- **No live model rollouts.** All results use a policy *simulator* whose success probability is a function of task features I chose. The difficulty spread, throughput figures and timing split are properties of the pipeline, not of any real policy.
- **Grader reliability uses a synthetic reference set.** Labelling trajectories I generated myself is circular. The harness is real and tested; 89.7% is not a claim about real-world grader accuracy.
- **The `discriminates` filter has never fired.** It tests one specific kind of laziness and the trivial-defect tasks retain hygiene assertions, so a slightly-less-lazy policy would pass.
```

- [ ] **Step 4: Minimal `src/pages/projects/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({ params: { slug: project.id }, props: { project } }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const { title, question, repo } = project.data;
---

<Base title={`${title} — Samuel Chen`} description={question}>
  <main id="main">
    <div class="container">
      <h1>{title}</h1>
      <p><a href={repo}>repo</a></p>
      <Content />
    </div>
  </main>
</Base>
```

- [ ] **Step 5: Run tests**

Run: `npm test && npm run check`
Expected: `# pass 9`, `# fail 0`; 0 type errors. If `astro check` complains about `render` or `glob`, run `npx astro sync` first (regenerates `.astro/types.d.ts`).

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/projects/opsgym.mdx src/pages/projects tests/dist.test.mjs
git commit -m "Add projects collection with opsgym and a minimal project route

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 5: Agentic Commerce Lab content

**Files:**
- Create: `src/content/projects/agentic-commerce-lab.mdx`
- Test: `tests/dist.test.mjs` (append)

- [ ] **Step 1: Append failing test**

```js
test('agentic-commerce-lab page builds with the live report link', () => {
  const page = html('projects/agentic-commerce-lab/index.html');
  assert.ok(page.includes('188,718'));
  assert.ok(page.includes('https://samueljchen08.github.io/agentic-commerce-lab/'));
  assert.ok(page.includes('E1a'));
});
```

Run `npm test` → FAIL (ENOENT).

- [ ] **Step 2: Write the MDX**

Body from `git show 13ac5cb:src/content/projects/agentic-commerce-lab.mdx` (after its frontmatter), unchanged, then append the two sections below (from the README's "Evidence classes" and "Engineering notes"; the old body stopped at "How it works").

```mdx
---
title: 'Agentic Commerce Lab'
order: 2
question: 'When an AI agent does the buying, which merchant lever is actually worth pulling?'
period: '2026'
repo: 'https://github.com/samueljchen08/agentic-commerce-lab'
live: 'https://samueljchen08.github.io/agentic-commerce-lab/'
stack: ['Python', 'Bayesian inference', 'claude-sonnet-5', 'HTML']
headline:
  value: '−$188,718'
  caption: 'the lever with the biggest agent-choice lift, once its cost is paid across every channel'
results:
  - value: '300'
    caption: 'real probes of claude-sonnet-5 · 60 mandates · 5 arms'
  - value: '+1.69 pp'
    caption: 'free-shipping selection lift · P(effect > 0) = 1.000'
  - value: '0.7456'
    caption: 'measured intraclass correlation — why probes are clustered by mandate'
  - value: 'E1a'
    caption: 'evidence class: one real provider, one frozen candidate set'
limits: 'Evidence class E1a: one real provider (claude-sonnet-5), one frozen candidate set, one prompt. That is one run against one model and does not license a general claim about AI buyer agents — the repository says so in its own words. The second-provider comparison is built but has not been run live, and the merchant economics use modeled, not observed, order volumes.'
---
```

Append after the old body:

```md
## Evidence classes

Every number the lab produces carries a tier, and the codebase enforces never promoting a result up a tier or reusing a stochastic model response as a fresh replication.

| Class | Environment | May claim |
| --- | --- | --- |
| E0 | simulated oracle, known coefficients | the software behaves correctly under known assumptions |
| E1a | one real provider, frozen candidate set | causal, within that model / prompt / candidate environment |
| E1b | two providers agreeing on rank | effect is robust across tested models |
| E2 | live retrieval surface, not randomized | association on an external surface |
| E3 | randomized merchant test | causal in the merchant population |
| E4 | orders, returns, margin linked to treatment | realized incremental contribution |

This lab has real, spent-money data at **E1a**. The simulated oracle (E0) is free and unlimited and is used for all structural development — it is never cited as evidence about how a real agent behaves.

## Engineering decisions that carry the claim

- **Bayesian clustered inference, not a t-test.** Replications of the same buyer mandate are correlated (measured intraclass correlation **0.7456**), so probe count overstates precision unless you cluster on mandate. The estimator is a Dirichlet-weighted bootstrap over mandates, which makes P(effect > 0) a genuine posterior probability and makes optional stopping valid.
- **A `NO_EFFECT` status distinct from `INCONCLUSIVE`.** A null is only called decisively when the 90% interval sits entirely inside a region of practical equivalence around zero. Two arms in the real run landed exactly tied with control; resampling that result up to 64× the sample size keeps P(effect > 0) pinned at ~0.50 — the signature of "nothing here," not "ask again later."
- **Integer-cent money everywhere.** No float ever touches a dollar figure.
- **Write-before-parse.** The raw provider response is persisted to disk before it is parsed; a failed write means the probe did not happen and is retried.
- **A cost preflight that is a hard gate.** Every real dispatch measures token counts against the real catalog and prompt before spending, and refuses to run above a configured budget.
- **Never force an entity match.** If a model names something outside the closed candidate set, the parser records the raw text and drops the selection rather than coercing it to the nearest product.
- **Golden parser fixtures from ~1,770 real captured responses**, classified by what actually went wrong — truncated JSON, prose before the object, empty responses.
```

- [ ] **Step 3: Run tests, commit**

Run: `npm test` → `# pass 10`.

```bash
git add src/content/projects/agentic-commerce-lab.mdx tests/dist.test.mjs
git commit -m "Add Agentic Commerce Lab project content

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 6: Multi-Object Tracking content

**Files:**
- Create: `src/content/projects/multi-object-tracking.mdx`
- Test: `tests/dist.test.mjs` (append)

- [ ] **Step 1: Append failing test**

```js
test('multi-object-tracking page builds with the Kalman result', () => {
  const page = html('projects/multi-object-tracking/index.html');
  assert.ok(page.includes('0.219'));
  assert.ok(page.includes('16,009'));
  assert.ok(page.includes('https://drive.google.com/file/d/14I8We1yRNw1d1kzCVHLzmc5P-jsfh__H/view'));
});
```

Run `npm test` → FAIL (ENOENT).

- [ ] **Step 2: Write the MDX**

Body = everything below the "Paper:" line in `docs/superpowers/reference/multi-object-tracking-figures.md`, unchanged, with this line inserted directly under the first paragraph: `The write-up is in [the paper](https://drive.google.com/file/d/14I8We1yRNw1d1kzCVHLzmc5P-jsfh__H/view); the code is a single Colab notebook in the repository.`

```mdx
---
title: 'Multi-Object Sports Tracking'
order: 3
question: 'Does knowing where the ball is improve next-frame player movement prediction?'
period: 'April 2026'
repo: 'https://github.com/samueljchen08/Multi-Object-Tracking'
stack: ['Python', 'PyTorch', 'YOLO11', 'XGBoost', 'OpenCV']
headline:
  value: '0.219 ft'
  caption: 'a hand-tuned Kalman filter with no training data beat every network trained on 138,000 rows'
results:
  - value: '3 / 3'
    caption: 'architectures that got worse when ball features were added'
  - value: '10.9%'
    caption: 'of frames where YOLO11 found the ball — the constraint on everything downstream'
  - value: '16,009'
    caption: 'rows in the fair comparison, so ball features are not confounded with 9× the data'
limits: 'The ball detector is the weak link and the result rests on it: YOLO11 found the ball in only 10.9% of frames, so the fair comparison runs on 16,009 rows rather than 138,357. A better detector could change the answer, and nothing here rules that out. The notebook is the only artifact; there is no packaged pipeline.'
---
```

- [ ] **Step 3: Run tests, commit**

Run: `npm test` → `# pass 11`.

```bash
git add src/content/projects/multi-object-tracking.mdx tests/dist.test.mjs
git commit -m "Add Multi-Object Sports Tracking project content

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 7: Homepage

**Files:**
- Create: `src/components/Section.astro`, `src/components/Tags.astro`, `src/components/ProjectEntry.astro`, `src/components/Timeline.astro`
- Modify: `src/pages/index.astro` (full homepage)
- Test: `tests/dist.test.mjs` (append)

**Interfaces:**
- Consumes: `person, education, roles, activities, skills, interests` from profile; `getCollection('projects')`.
- Produces: `<Section id label>`, `<Tags items>`, `<ProjectEntry project>`, `<Timeline items>` where `items: { dates: string; heading: string; sub?: string; bullets?: string[] }[]`.

- [ ] **Step 1: Append failing tests**

```js
test('homepage: hero has meta line and three actions, no tagline', () => {
  const page = html('index.html');
  assert.ok(page.includes("MIT CS-AI '27 · Cambridge, MA / Bellevue, WA"));
  assert.ok(page.includes('href="/samuel-chen-resume.pdf"'));
  assert.ok(page.includes('href="mailto:samchen@mit.edu"'));
  assert.doesNotMatch(page, /measurement machinery/);
});

test('homepage: three projects in order with headline figures', () => {
  const page = html('index.html');
  const i1 = page.indexOf('href="/projects/opsgym/"');
  const i2 = page.indexOf('href="/projects/agentic-commerce-lab/"');
  const i3 = page.indexOf('href="/projects/multi-object-tracking/"');
  assert.ok(i1 > -1 && i2 > i1 && i3 > i2, 'projects appear in order');
  for (const fig of ['22.5 pts', '−$188,718', '0.219 ft']) assert.ok(page.includes(fig), fig);
});

test('homepage: experience, education, activities sections', () => {
  const page = html('index.html');
  assert.match(page, /id="experience"/);
  const ig = page.indexOf('Goldman Sachs');
  const ins = page.indexOf('Nexus AI');
  assert.ok(ins > -1 && ig > ins, 'Nexus AI precedes Goldman');
  assert.ok(page.includes('4.95/5.0'));
  assert.ok(page.includes('Managing Director of Finance'));
  assert.ok(page.includes('VP of External Relations'));
});
```

Run `npm test` → FAIL on the first assertion.

- [ ] **Step 2: `src/components/Section.astro`**

```astro
---
interface Props { id: string; label: string }
const { id, label } = Astro.props;
---

<section id={id} class="section reveal">
  <div class="container">
    <h2 class="label">{label}</h2>
    <slot />
  </div>
</section>

<style>
  .section { padding: var(--space-5) 0 0; }
  .section + .section { border-top: 1px solid var(--border); margin-top: var(--space-5); }
  @media (max-width: 767px) { .section { padding-top: var(--space-4); } .section + .section { margin-top: var(--space-4); } }
</style>
```

- [ ] **Step 3: `src/components/Tags.astro`**

```astro
---
interface Props { items: readonly string[] }
const { items } = Astro.props;
---

<ul class="tags">
  {items.map((t) => <li><span class="tag">{t}</span></li>)}
</ul>
```

- [ ] **Step 4: `src/components/ProjectEntry.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import Tags from './Tags.astro';

interface Props { project: CollectionEntry<'projects'> }
const { project } = Astro.props;
const { title, question, headline, stack, repo, live } = project.data;
const href = `/projects/${project.id}/`;
---

<article class="entry">
  <div class="entry-main">
    <h3><a href={href}>{title}</a></h3>
    <p class="question">{question}</p>
    <Tags items={stack} />
    <ul class="links">
      <li><a href={href}>read →</a></li>
      <li><a href={repo} target="_blank" rel="noopener noreferrer">repo</a></li>
      {live && <li><a href={live} target="_blank" rel="noopener noreferrer">live report</a></li>}
    </ul>
  </div>
  <div class="entry-figure">
    <span class="value">{headline.value}</span>
    <span class="caption">{headline.caption}</span>
  </div>
</article>

<style>
  .entry {
    display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: var(--space-4);
    padding: var(--space-4) 0; border-top: 1px solid var(--border);
  }
  .entry:last-child { border-bottom: 1px solid var(--border); }
  h3 { font-size: 1.5rem; margin-bottom: var(--space-1); }
  h3 a { color: var(--fg); }
  h3 a:hover { color: var(--accent); text-decoration: none; }
  .question { color: var(--fg-muted); margin-bottom: var(--space-2); }
  .links { list-style: none; padding: 0; margin: var(--space-2) 0 0; display: flex; gap: var(--space-2); font-family: var(--font-mono); font-size: 0.85rem; }
  .links li { margin: 0; }
  .entry-figure { display: flex; flex-direction: column; gap: 6px; }
  .value { font-family: var(--font-mono); font-size: 2rem; font-weight: 600; color: var(--accent); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .caption { font-family: var(--font-mono); font-size: 0.78rem; color: var(--fg-muted); line-height: 1.5; }
  @media (max-width: 767px) {
    .entry { grid-template-columns: 1fr; gap: var(--space-2); padding: var(--space-3) 0; }
    .entry-figure { order: -1; }
    .value { font-size: 1.6rem; }
  }
</style>
```

- [ ] **Step 5: `src/components/Timeline.astro`**

```astro
---
interface TimelineItem { dates: string; heading: string; sub?: string; bullets?: string[] }
interface Props { items: TimelineItem[] }
const { items } = Astro.props;
---

<ol class="timeline">
  {items.map((it) => (
    <li class="row">
      <span class="dates">{it.dates}</span>
      <div class="body">
        <h3>{it.heading}</h3>
        {it.sub && <p class="sub">{it.sub}</p>}
        {it.bullets && it.bullets.length > 0 && (
          <ul class="bullets">{it.bullets.map((b) => <li>{b}</li>)}</ul>
        )}
      </div>
    </li>
  ))}
</ol>

<style>
  .timeline { list-style: none; padding: 0; margin: 0; max-width: none; }
  .row { display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: var(--space-3); padding: var(--space-3) 0; border-top: 1px solid var(--border); margin: 0; }
  .row:last-child { border-bottom: 1px solid var(--border); }
  .dates { font-family: var(--font-mono); font-size: 0.8rem; color: var(--fg-muted); padding-top: 4px; white-space: nowrap; }
  h3 { font-size: 1.1rem; }
  .sub { font-family: var(--font-mono); font-size: 0.8rem; color: var(--fg-muted); margin: 4px 0 var(--space-1); }
  .bullets { margin: var(--space-1) 0 0; font-size: 0.95rem; color: var(--fg); }
  @media (max-width: 767px) { .row { grid-template-columns: 1fr; gap: 6px; } }
</style>
```

- [ ] **Step 6: Full `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import Section from '../components/Section.astro';
import ProjectEntry from '../components/ProjectEntry.astro';
import Timeline from '../components/Timeline.astro';
import Tags from '../components/Tags.astro';
import { person, education, roles, activities, skills, interests } from '../data/profile';

const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);

const experience = roles.map((r) => ({
  dates: `${r.start} – ${r.end}`,
  heading: r.company,
  sub: `${r.title} · ${r.location}`,
  bullets: r.bullets.slice(0, 2),
}));

const offKeyboard = activities.map((a) => ({
  dates: a.start ? `${a.start} – ${a.end}` : '',
  heading: a.name,
  sub: a.role,
  bullets: a.bullets?.slice(0, 1),
}));

const description =
  "Samuel Chen — MIT Computer Science (AI) '27. Projects in agentic RL environments, causal experiments on AI buyer agents, and sports tracking; experience at Nexus AI, Goldman Sachs, Barings, and Cercano.";
---

<Base title="Samuel Chen" description={description}>
  <main id="main">
    <section class="hero">
      <div class="container">
        <h1>{person.name}</h1>
        <p class="meta mono">MIT CS-AI '27 · {person.locations[0]} / {person.locations[1]}<span class="cursor" aria-hidden="true"></span></p>
        <div class="actions">
          <a class="btn btn--primary" href={person.resumePdf}>résumé (pdf)</a>
          <a class="btn" href={person.github} target="_blank" rel="noopener noreferrer">github</a>
          <a class="btn" href={`mailto:${person.email}`}>email</a>
        </div>
      </div>
    </section>

    <Section id="work" label="selected work">
      {projects.map((p) => <ProjectEntry project={p} />)}
    </Section>

    <Section id="experience" label="experience">
      <Timeline items={experience} />
    </Section>

    <Section id="education" label="education & skills">
      <div class="edu">
        <h3>{education.school}</h3>
        <p class="mono muted">{education.degree} · {education.minor}</p>
        <p class="mono muted">GPA {education.gpa} · expected {education.expected} · {education.location}</p>
        <h4 class="sub-label">coursework</h4>
        <Tags items={education.coursework} />
        <h4 class="sub-label">technical</h4>
        <Tags items={skills} />
      </div>
    </Section>

    <Section id="activities" label="off the keyboard">
      <Timeline items={offKeyboard} />
      <p class="mono muted interests">interests · {interests.join(' · ')}</p>
    </Section>
  </main>
</Base>

<style>
  .hero {
    padding: var(--space-6) 0 var(--space-5);
    background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
    background-size: 24px 24px;
    border-bottom: 1px solid var(--border);
  }
  .meta { margin: var(--space-2) 0 var(--space-3); color: var(--fg-muted); }
  .cursor { display: inline-block; width: 0.55em; height: 1em; margin-left: 4px; vertical-align: -0.15em; background: var(--accent); animation: blink 1.1s steps(2, start) infinite; }
  @keyframes blink { to { visibility: hidden; } }
  @media (prefers-reduced-motion: reduce) { .cursor { animation: none; } }
  .actions { display: flex; flex-wrap: wrap; gap: var(--space-1); }
  .muted { color: var(--fg-muted); margin: 0 0 6px; }
  .edu h3 { margin-bottom: 6px; }
  .sub-label { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 500; color: var(--fg-muted); margin: var(--space-3) 0 var(--space-1); }
  .interests { margin-top: var(--space-3); max-width: none; }
  @media (max-width: 767px) { .hero { padding: var(--space-5) 0 var(--space-4); } }
</style>
```

- [ ] **Step 7: Run tests and typecheck**

Run: `npm test && npm run check` → `# pass 14`, 0 errors.

- [ ] **Step 8: Eyeball at three widths**

`npx astro dev --background`; open `/` and resize to ~1440, ~768, ~390 px. Confirm the figure column stacks above the project text on mobile, timeline dates stack above headings, nothing scrolls horizontally, the cursor blinks (and stops if you enable "Reduce motion" in macOS Accessibility). `npx astro dev stop`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Build the homepage: hero, selected work, experience, education, activities

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 8: Project page chrome — header, ResultStrip, Callout, Toc, prev/next

**Files:**
- Create: `src/components/ResultStrip.astro`, `src/components/Callout.astro`, `src/components/Toc.astro`
- Modify: `src/pages/projects/[slug].astro`
- Test: `tests/dist.test.mjs` (append)

**Interfaces:**
- Consumes: `render(project)` → `{ Content, headings }` where `headings: { depth: number; slug: string; text: string }[]`.
- Produces: `<ResultStrip results>`, `<Callout title>` (slot), `<Toc headings>`.

- [ ] **Step 1: Append failing tests**

```js
test('project page: result strip, limits callout, toc, prev/next', () => {
  const page = html('projects/agentic-commerce-lab/index.html');
  assert.match(page, /class="results[^"]*"/);
  assert.ok(page.includes('+1.69 pp'));
  assert.match(page, /class="callout[^"]*"/);
  assert.ok(page.includes('Evidence class E1a'));
  assert.match(page, /<nav[^>]*aria-label="On this page"/);
  assert.ok(page.includes('href="#the-wedge"'), 'toc links to a heading');
  assert.ok(page.includes('href="/projects/opsgym/"'), 'prev link');
  assert.ok(page.includes('href="/projects/multi-object-tracking/"'), 'next link');
});
```

Run `npm test` → FAIL on `class="results`.

- [ ] **Step 2: `src/components/ResultStrip.astro`**

```astro
---
interface Props { results: readonly { value: string; caption: string }[] }
const { results } = Astro.props;
---

<dl class="results">
  {results.map((r) => (
    <div class="result">
      <dt class="caption">{r.caption}</dt>
      <dd class="value">{r.value}</dd>
    </div>
  ))}
</dl>

<style>
  .results {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1px;
    background: var(--border); border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden; margin: var(--space-4) 0;
  }
  .result { display: flex; flex-direction: column-reverse; gap: 6px; padding: var(--space-2) var(--space-3); background: var(--bg-raised); margin: 0; }
  .value { font-family: var(--font-mono); font-size: 1.6rem; font-weight: 600; color: var(--accent); margin: 0; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .caption { font-family: var(--font-mono); font-size: 0.75rem; color: var(--fg-muted); line-height: 1.5; }
</style>
```

- [ ] **Step 3: `src/components/Callout.astro`**

```astro
---
interface Props { title: string }
const { title } = Astro.props;
---

<aside class="callout">
  <p class="callout-title label">{title}</p>
  <div class="callout-body"><slot /></div>
</aside>

<style>
  .callout { border: 1px solid var(--border); border-left: 3px solid var(--accent); border-radius: var(--radius); padding: var(--space-3); margin: var(--space-4) 0; background: var(--bg-raised); }
  .callout-title { margin-bottom: var(--space-1); }
  .callout-body :global(p:last-child) { margin-bottom: 0; }
</style>
```

- [ ] **Step 4: `src/components/Toc.astro`**

```astro
---
interface Props { headings: { depth: number; slug: string; text: string }[] }
const { headings } = Astro.props;
const items = headings.filter((h) => h.depth === 2);
---

{items.length > 1 && (
  <nav class="toc" aria-label="On this page">
    <p class="label">on this page</p>
    <ol>
      {items.map((h) => <li><a href={`#${h.slug}`}>{h.text}</a></li>)}
    </ol>
  </nav>
)}

<style>
  .toc { position: sticky; top: 72px; font-size: 0.85rem; }
  .toc .label { margin-bottom: var(--space-1); }
  ol { list-style: none; padding: 0; margin: 0; }
  li { margin: 0 0 6px; }
  a { color: var(--fg-muted); }
  a:hover { color: var(--fg); text-decoration: none; }
  @media (max-width: 1023px) { .toc { display: none; } }
</style>
```

- [ ] **Step 5: Full `src/pages/projects/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Tags from '../../components/Tags.astro';
import ResultStrip from '../../components/ResultStrip.astro';
import Callout from '../../components/Callout.astro';
import Toc from '../../components/Toc.astro';

export async function getStaticPaths() {
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  return projects.map((project, i) => ({
    params: { slug: project.id },
    props: { project, prev: projects[i - 1] ?? null, next: projects[i + 1] ?? null },
  }));
}

const { project, prev, next } = Astro.props;
const { Content, headings } = await render(project);
const { title, question, period, repo, live, stack, results, limits } = project.data;
---

<Base title={`${title} — Samuel Chen`} description={question}>
  <main id="main" class="container project">
    <header class="project-header">
      <h1>{title}</h1>
      <p class="question">{question}</p>
      <div class="meta">
        <span class="mono period">{period}</span>
        <Tags items={stack} />
        <ul class="links mono">
          <li><a href={repo} target="_blank" rel="noopener noreferrer">repo →</a></li>
          {live && <li><a href={live} target="_blank" rel="noopener noreferrer">live report →</a></li>}
        </ul>
      </div>
      <ResultStrip results={results} />
    </header>

    <div class="layout">
      <article class="prose">
        <Content />
        <Callout title="limits">
          <p>{limits}</p>
        </Callout>
      </article>
      <Toc headings={headings} />
    </div>

    <nav class="pager mono" aria-label="Other projects">
      {prev ? <a href={`/projects/${prev.id}/`}>← {prev.data.title}</a> : <span />}
      {next ? <a href={`/projects/${next.id}/`}>{next.data.title} →</a> : <span />}
    </nav>
  </main>
</Base>

<style>
  .project { padding-top: var(--space-5); }
  .project-header h1 { font-size: clamp(2rem, 5vw, 3rem); }
  .question { color: var(--fg-muted); font-size: 1.15rem; margin: var(--space-2) 0 var(--space-3); }
  .meta { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
  .period { color: var(--fg-muted); }
  .links { list-style: none; padding: 0; margin: 0; display: flex; gap: var(--space-2); max-width: none; }
  .links li { margin: 0; }
  .layout { display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: var(--space-5); align-items: start; }
  .prose :global(h2) { margin: var(--space-5) 0 var(--space-2); padding-top: var(--space-2); border-top: 1px solid var(--border); font-size: 1.5rem; }
  .prose :global(h3) { margin: var(--space-4) 0 var(--space-1); }
  .prose :global(h2:first-child) { margin-top: var(--space-2); border-top: 0; padding-top: 0; }
  .pager { display: flex; justify-content: space-between; gap: var(--space-2); margin-top: var(--space-5); padding-top: var(--space-3); border-top: 1px solid var(--border); }
  @media (max-width: 1023px) { .layout { grid-template-columns: 1fr; } }
  @media (max-width: 767px) { .project { padding-top: var(--space-4); } }
</style>
```

- [ ] **Step 6: Run tests, typecheck, eyeball**

Run: `npm test && npm run check` → `# pass 15`, 0 errors. Dev server: open `/projects/opsgym/`; check the TOC sticks and tracks headings, tables scroll inside their container at 390px, the Limits callout sits after the body, prev/next work. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Finish project pages: header, result strip, limits callout, TOC, pager

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 9: Résumé page with print stylesheet

**Files:**
- Create: `src/pages/resume.astro`
- Test: `tests/dist.test.mjs` (append)

- [ ] **Step 1: Append failing test**

```js
test('resume page renders every role and the PDF button', () => {
  const page = html('resume/index.html');
  assert.match(page, /<title>Résumé — Samuel Chen<\/title>/);
  assert.ok(page.includes('href="/samuel-chen-resume.pdf"'));
  for (const c of ['Nexus AI (Courtex)', 'Goldman Sachs', 'Barings', 'Cercano Management (Vulcan Capital)', 'MIT Sloan School of Management']) {
    assert.ok(page.includes(c), c);
  }
  assert.ok(page.includes('Recruited Collegiate Athlete (Point Guard)'));
  assert.ok(page.includes('Fantasy Football'));
});
```

Run `npm test` → FAIL (ENOENT).

- [ ] **Step 2: `src/pages/resume.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { person, education, roles, activities, skills, interests } from '../data/profile';
---

<Base title="Résumé — Samuel Chen" description="Samuel Chen's résumé: MIT Computer Science (AI) '27, Nexus AI co-founder, Goldman Sachs, Barings, Cercano Management, MIT Sloan research.">
  <main id="main" class="container resume">
    <header class="top">
      <div>
        <h1>{person.name}</h1>
        <p class="mono muted contact">
          {person.locations.join(' / ')} · <a href={`mailto:${person.email}`}>{person.email}</a> · {person.phone} ·
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer">linkedin</a> ·
          <a href={person.github} target="_blank" rel="noopener noreferrer">github</a>
        </p>
      </div>
      <a class="btn btn--primary" href={person.resumePdf}>download pdf</a>
    </header>

    <section>
      <h2 class="label">education</h2>
      <div class="row">
        <div class="row-head">
          <h3>{education.school}</h3>
          <span class="mono muted">{education.location} · expected {education.expected}</span>
        </div>
        <p>{education.degree}; {education.minor}. GPA {education.gpa}.</p>
        <p class="small"><strong>Coursework:</strong> {education.coursework.join(', ')}</p>
      </div>
    </section>

    <section>
      <h2 class="label">experience</h2>
      {roles.map((r) => (
        <div class="row">
          <div class="row-head">
            <h3>{r.company}</h3>
            <span class="mono muted">{r.location} · {r.start} – {r.end}</span>
          </div>
          <p class="title">{r.title}</p>
          <ul>{r.bullets.map((b) => <li>{b}</li>)}</ul>
        </div>
      ))}
    </section>

    <section>
      <h2 class="label">leadership & activities</h2>
      {activities.map((a) => (
        <div class="row">
          <div class="row-head">
            <h3>{a.name}</h3>
            {a.start && <span class="mono muted">{a.start} – {a.end}</span>}
          </div>
          {a.role && <p class="title">{a.role}</p>}
          {a.bullets && <ul>{a.bullets.map((b) => <li>{b}</li>)}</ul>}
        </div>
      ))}
    </section>

    <section>
      <h2 class="label">skills & interests</h2>
      <p><strong>Technical:</strong> {skills.join(', ')}</p>
      <p><strong>Interests:</strong> {interests.join(', ')}</p>
    </section>
  </main>
</Base>

<style>
  .resume { padding-top: var(--space-5); }
  .top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: var(--space-2); margin-bottom: var(--space-4); }
  .top h1 { font-size: clamp(2rem, 5vw, 3rem); }
  .muted { color: var(--fg-muted); }
  .contact { margin: var(--space-1) 0 0; max-width: none; }
  section { margin-top: var(--space-4); }
  .row { padding: var(--space-2) 0; border-top: 1px solid var(--border); }
  .row-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-1); align-items: baseline; }
  h3 { font-size: 1.05rem; }
  .title { font-style: italic; color: var(--fg-muted); margin: 2px 0 var(--space-1); }
  .row ul { margin-bottom: 0; font-size: 0.95rem; }
  .small { font-size: 0.9rem; }
  p { max-width: none; }

  @media print {
    .resume { padding-top: 0; }
    .top .btn { display: none; }
    section { margin-top: 12pt; break-inside: avoid; }
    .row { padding: 6pt 0; border-top: 0; }
    .label::before { content: ''; }
    .label { color: #000; border-bottom: 1px solid #000; text-transform: uppercase; font-weight: 700; margin-bottom: 4pt; }
    h1 { font-size: 20pt; }
    h3 { font-size: 11pt; }
    .row ul, .small, .title, .contact { font-size: 10pt; }
    li + li { margin-top: 2pt; }
  }
</style>
```

- [ ] **Step 3: Run tests, print-preview, commit**

Run: `npm test && npm run check` → `# pass 16`. Dev server: open `/resume/`, press ⌘P — confirm nav/footer/button are gone and it fits on one or two pages with black text. Stop the server.

```bash
git add src/pages/resume.astro tests/dist.test.mjs
git commit -m "Add HTML résumé page with print stylesheet

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 10: 404 page and sitemap check

**Files:**
- Create: `src/pages/404.astro`
- Test: `tests/dist.test.mjs` (append)

- [ ] **Step 1: Append failing test**

```js
test('404 page and sitemap exist', () => {
  const page = html('404.html');
  assert.ok(page.includes('href="/"'));
  assert.match(page, /not found/i);
  const sm = html('sitemap-0.xml');
  for (const url of ['https://samueljchen08.github.io/', 'https://samueljchen08.github.io/resume/', 'https://samueljchen08.github.io/projects/opsgym/']) {
    assert.ok(sm.includes(`<loc>${url}</loc>`), url);
  }
});
```

Run `npm test` → FAIL (ENOENT 404.html).

- [ ] **Step 2: `src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Not found — Samuel Chen" description="That page does not exist.">
  <main id="main" class="container nf">
    <p class="mono"><span class="accent">404</span> · page not found</p>
    <p><a href="/">← back home</a></p>
  </main>
</Base>

<style>
  .nf { padding: var(--space-6) var(--space-3); min-height: 50vh; }
  .accent { color: var(--accent); }
</style>
```

- [ ] **Step 3: Run tests, commit**

Run: `npm test` → `# pass 17`.

```bash
git add src/pages/404.astro tests/dist.test.mjs
git commit -m "Add 404 page

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 11: Link checker

**Files:**
- Create: `scripts/check-links.mjs`

**Interfaces:**
- Produces: `npm run check-links` (exit 1 on any broken internal link or any external response ≥ 400, except LinkedIn's bot-blocking 999, which is reported as unverifiable).

- [ ] **Step 1: Write the script**

```js
// Walks dist/, checks every href. Internal links must resolve to a file in dist/;
// external links must answer with a status < 400. Run after `npm run build`.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
if (!existsSync(dist)) { console.error('dist/ missing — run npm run build first'); process.exit(1); }

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}

const internal = new Map(); // href -> [pages]
const external = new Map();
for (const file of htmlFiles(dist)) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) continue;
    const bucket = /^https?:\/\//.test(href) ? external : internal;
    if (!bucket.has(href)) bucket.set(href, []);
    bucket.get(href).push(file.slice(dist.length));
  }
}

let failures = 0;
for (const [href, pages] of internal) {
  const path = href.split('#')[0].split('?')[0];
  const candidates = [join(dist, path), join(dist, path, 'index.html')];
  if (!candidates.some((c) => existsSync(c))) {
    failures++;
    console.log(`BROKEN internal ${href}  (from ${pages[0]})`);
  }
}

for (const [href, pages] of external) {
  try {
    let res = await fetch(href, { method: 'HEAD', redirect: 'follow' });
    if (res.status === 405 || res.status === 403) res = await fetch(href, { method: 'GET', redirect: 'follow' });
    if (res.status === 999) { console.log(`UNVERIFIABLE ${href} (bot-blocked, 999)`); continue; }
    if (res.status >= 400) { failures++; console.log(`BROKEN ${res.status} ${href}  (from ${pages[0]})`); }
    else console.log(`ok ${res.status} ${href}`);
  } catch (err) {
    failures++;
    console.log(`ERROR ${href}: ${err.message}`);
  }
}

console.log(`\n${internal.size} internal, ${external.size} external, ${failures} failures`);
process.exit(failures ? 1 : 0);
```

- [ ] **Step 2: Run it**

Run: `npm run build && npm run check-links`
Expected: `0 failures`. Expected externals: the three repos, the live report, the paper link, LinkedIn (may show UNVERIFIABLE), and `https://github.com/samueljchen08`. If the Google Drive link returns ≥ 400, open it in a browser to confirm it works before deciding anything — do not remove it.

- [ ] **Step 3: Commit**

```bash
git add scripts/check-links.mjs
git commit -m "Add link checker over the built site

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

---

### Task 12: Screenshots, Lighthouse, README, final verification

**Files:**
- Create: `scripts/screenshots.mjs`, `README.md`
- Output (gitignored): `screenshots/`

- [ ] **Step 1: Screenshot script**

`scripts/screenshots.mjs` (uses the installed Google Chrome via Playwright's `chrome` channel — no browser download):

```js
// Usage: start `npx astro preview` (see Task 12 step 2), then `node scripts/screenshots.mjs`.
// Uses the installed Google Chrome via Playwright's `chrome` channel — no browser download.
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://localhost:4321';
const routes = ['/', '/projects/opsgym/', '/projects/agentic-commerce-lab/', '/projects/multi-object-tracking/', '/resume/', '/404/'];
const widths = [1440, 768, 390];
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({ colorScheme: theme });
  for (const w of widths) {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: w, height: 900 });
    for (const r of routes) {
      await page.goto(base + r, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible')));
      const name = r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '-');
      await page.screenshot({ path: `screenshots/${name}-${w}-${theme}.png`, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      if (overflow) console.log(`HORIZONTAL OVERFLOW ${r} @ ${w}px ${theme}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log('done → screenshots/');
```

Install Playwright locally as a dev dependency so the import resolves: `npm install -D playwright` (latest; the `chrome` channel uses the installed Chrome at `/Applications/Google Chrome.app`, so no `playwright install` download is needed).

- [ ] **Step 2: Build, preview, screenshot**

```bash
npm run build
(npx astro preview > /dev/null 2>&1 &) ; sleep 3     # serves dist/ at http://localhost:4321
node scripts/screenshots.mjs
pkill -f "astro preview"
```

(`astro preview` has no `--background` flag; the subshell-and-`&` form above detaches it. If port 4321 is busy, `npx astro dev stop` first.)

Expected: 36 PNGs, no `HORIZONTAL OVERFLOW` lines. Open at least `home-1440-dark.png`, `home-390-dark.png`, `projects-opsgym-390-light.png`, `resume-768-dark.png` with the Read tool and look at them: hero spacing, project figure alignment, table scrolling, contrast in light mode. Fix anything wrong in the relevant component, rebuild, re-shoot.

- [ ] **Step 3: 320px overflow check**

Add `320` to `widths` temporarily and re-run; expected no overflow lines. Remove it afterwards (the spec's screenshot set is 1440/768/390).

- [ ] **Step 4: Lighthouse**

```bash
(npx astro preview > /dev/null 2>&1 &) ; sleep 3
npx -y lighthouse http://localhost:4321/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=screenshots/lh-home.json --quiet
npx -y lighthouse http://localhost:4321/projects/opsgym/ --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --output=json --output-path=screenshots/lh-opsgym.json --quiet
node -e "for (const f of ['home','opsgym']) { const r = require('./screenshots/lh-'+f+'.json').categories; console.log(f, Object.fromEntries(Object.entries(r).map(([k,v])=>[k, Math.round(v.score*100)]))) }"
pkill -f "astro preview"
```

Expected: `performance ≥ 95`, `accessibility = 100` on both. If accessibility < 100, read `audits` in the JSON for the failing audit id, fix it, re-run.

- [ ] **Step 5: Keyboard pass**

In the dev server, Tab from the top of `/`: skip link appears first, then brand, four nav links, theme toggle, three hero buttons, each project title / read / repo / live, footer links — every stop shows the violet focus ring. Enter on the toggle flips the theme.

- [ ] **Step 6: README**

Create `README.md`:

```md
# samueljchen08.github.io

Personal site for Samuel Chen — MIT Computer Science (AI), 2027.

## Develop

    npm install
    npm run dev          # http://localhost:4321
    npm run build        # → dist/
    npm test             # build + build-output tests
    npm run check        # astro check
    npm run check-links  # verify every href in dist/

## Content

- `src/data/profile.ts` — every fact the résumé PDF also states. Keep in sync with
  `public/samuel-chen-resume.pdf`.
- `src/content/projects/*.mdx` — one file per project; adding a project is one file.

Every figure on the site is transcribed from a repository README, the tracking notebook's
stored outputs, or the résumé. Nothing is rounded or inferred.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml` (withastro/action → GitHub Pages).
Pages must be set to **Source: GitHub Actions**.

## Design

Spec: `docs/superpowers/specs/2026-09-03-personal-site-design.md`.
```

- [ ] **Step 7: Final full verification and commit**

```bash
npm run check && npm test && npm run check-links
git add -A
git commit -m "Add screenshot script, README, and verification tooling

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VafgFh9921xL2biUf4feud"
```

Report to the user with: test counts, Lighthouse scores, the screenshot set, any UNVERIFIABLE links, and the reminder that the résumé PDF lacks the Sloan Business Club / StartLabs titles shown on the site. Do **not** push; pushing to `main` deploys, and that is the user's call.
