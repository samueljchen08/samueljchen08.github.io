# Personal site — design spec

Date: 2026-09-03
Status: approved in brainstorming; awaiting user review of this document.

## 1. Purpose

A personal site for Samuel Chen (MIT CS-AI '27) aimed at CS internship / new-grad
recruiting: interviewers and recruiters arriving from a résumé, GitHub, or a LinkedIn
message. Two readers must both be served:

- the **60-second skimmer**, who reads the homepage only and decides whether to book
  an interview;
- the **20-minute reader**, an interviewer preparing a conversation, who reads a project
  page end to end and wants something concrete to ask about.

Engineering leads; finance roles (Goldman, Barings, Cercano) appear in experience,
framed around the quantitative / Python work they involved.

This is a **fresh build**. The previous "audit working papers" build in this directory is
discarded in full (see §8). Only the résumé PDF and verified *facts* extracted from the
repositories are carried forward.

## 2. Scope

Routes:

| Route | Purpose |
| --- | --- |
| `/` | Hero, selected work, experience, education & skills, activities, footer |
| `/projects/opsgym/` | Long-form project page |
| `/projects/agentic-commerce-lab/` | Long-form project page |
| `/projects/multi-object-tracking/` | Long-form project page |
| `/resume/` | HTML résumé rendered from `profile.ts`, with PDF download |
| `/404` | Mono one-liner + link home |

Out of scope (explicitly declined): a writing / blog / notes section; any backend, forms,
or analytics; testimonials or anything not corroborable by the repos, notebook, or PDF.

## 3. Visual system

**Direction.** Dark-first, technical, restrained — stripe.dev as the reference: density
with precision, small details, no decoration for its own sake.

**Palette (dark, primary).**

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0b0d10` | page ground |
| `--bg-raised` | `#12151a` | callouts, table headers, nav |
| `--border` | `#1f242b` | hairlines |
| `--fg` | `#e6e8eb` | primary text |
| `--fg-muted` | `#8b929c` | secondary text, captions |
| `--accent` | `#8b7cff` | links, cursor, headline numbers |
| `--ok` / `--bad` | muted green / muted red | result-table tints only |

**Light mode** is a full token swap on an off-white ground (`#f6f7f9`), reached by a
toggle in the nav; initial state follows `prefers-color-scheme`. Dark is the design
target; light must be correct and legible, not a second design.

**Type.** Inter (variable) for body and headings; JetBrains Mono (variable) for section
labels, dates, tags, table numbers, nav, and meta lines. Both self-hosted via
`@fontsource-variable/*`. Body 17px / 1.6, measure ≤ 68ch. Headings tight-tracked, heavy.

**Texture.** Faint dot grid behind the hero only; mono labels prefixed `//`; hairline
rules between sections. No gradients, no glassmorphism, no shadows beyond a 1px border.

**Motion.** Hover state changes; a single `fade-up` on section entry; a blinking block
cursor at the end of the hero meta line. All ≤ 200 ms; everything disabled under
`prefers-reduced-motion`.

**Layout.** Max content width 1100px; single column below 768px. Spacing scale
8 / 16 / 24 / 40 / 64 / 96 px — no ad hoc margins.

## 4. Page structure

### Nav (all pages)
Sticky, slim. Left: `samuel chen` (mono). Right: `projects · experience · résumé ·
github` + theme toggle. Links stay inline on mobile; no hamburger.

### Homepage `/`
1. **Hero.** `Samuel Chen` (large). Below it a mono meta line
   `MIT CS-AI '27 · Cambridge, MA / Bellevue, WA` ending in the block cursor. Then three
   actions: `résumé (pdf) · github · email`. **No tagline or descriptive sentence.**
2. **Selected work** (`// selected work`). Three full-width entries, in `order`:
   title · the one-sentence question the project answers · headline figure with mono
   caption · stack tags · links `read →`, `repo`, `live report` (where present).
   Headline figures: opsgym `22.5 pts`; agentic-commerce-lab `−$188,718`;
   multi-object-tracking `0.219 ft`.
3. **Experience** (`// experience`). Timeline rows: mono date range left; company,
   title, location, 1–2 bullets right. Order: Nexus AI (Co-Founder) → Goldman Sachs FIG →
   Barings → Cercano → MIT Sloan research.
4. **Education & skills.** MIT, BS CS-AI, minor in Finance, GPA 4.95/5.0, exp. May 2027;
   coursework as wrapped tags; technical skills as tags.
5. **Off the keyboard.** A list of activities with roles (not a paragraph): MIT Varsity
   Basketball (Point Guard), Sloan Business Club (MD of Finance), StartLabs (VP of
   External Relations), Splash, Brass Rat Investments; then the interests line.
6. **Footer.** Email, GitHub, LinkedIn, phone, `© 2026 · built with Astro`.

### Project pages `/projects/<slug>/`
- Header: title, question, mono meta (period · stack tags · `repo →` · `live report →`).
- **Result strip**: 3–4 headline numbers with captions, directly under the header.
- Body: MDX prose with `##` sections; tables for measured results (wrapped in a
  horizontally-scrolling container); pre blocks for the README's ASCII tables.
- **Limits** callout near the end — what is not done and why. Bordered block, not a
  warning style.
- Sticky right-hand mini-TOC ≥ 1024px; hidden below.
- Prev / next project links at the bottom.

### Résumé `/resume/`
HTML rendering of `profile.ts` (contact, education, experience, leadership & activities,
skills & interests) with a prominent `download pdf` button at the top. A print stylesheet
yields a clean one-pager.

## 5. Content architecture

**`src/data/profile.ts`** — single source for everything the PDF also states:
`person` (name, email, phone, location(s), github, linkedin, resumePdf), `education`
(school, degree, minor, gpa, expected, coursework[]), `roles[]` (company, title, location,
start, end, bullets[], `track: 'engineering' | 'finance'`), `activities[]` (name, role?,
dates?, bullets?[]), `skills[]`, `interests[]`. Header comment: keep in sync with
`public/samuel-chen-resume.pdf`. Note in-file that the Sloan Business Club and StartLabs
titles were supplied by Samuel and are not yet on the PDF.

**`src/content/projects/*.mdx`** — one file per project; schema in
`src/content.config.ts`:

```
title: string
order: number
question: string
period: string
repo: url
live?: url
stack: string[]
headline: { value: string; caption: string }
results: { value: string; caption: string }[]
limits: string
```

Body: MDX prose. Adding a project = one file; it appears on the homepage automatically.

**Components** (`src/components/`): `Nav`, `Footer`, `Section` (label + slot),
`ProjectEntry`, `Timeline` + `TimelineRow`, `Tags`, `ResultStrip`, `Callout`, `Toc`,
`ThemeToggle`. Layouts: `Base.astro` (head/meta/OG, fonts, theme script, nav, footer).
Styles: `src/styles/tokens.css`, `src/styles/global.css` (reset, typography, tables,
print).

**Content rule.** Every figure is transcribed from a repository README, the
`Multi-Object-Tracking` notebook's stored cell outputs, or the résumé PDF. Nothing is
rounded, embellished, or inferred.

### Project content sources
- **opsgym** — README: 10 findings, isolation table, grader reliability table, A/A
  noise-floor table, held-out eval (pass@1 0.450, CI [0.325, 0.575]; pass@4 0.929),
  176→24 validation funnel, "what is not done" list.
- **agentic-commerce-lab** — README: the wedge (+8.68 pp / $883,432 synthetic;
  +1.69 pp / −$188,718 real E1a run), pipeline, evidence classes table, engineering
  notes; live report at `samueljchen08.github.io/agentic-commerce-lab/`.
- **multi-object-tracking** — notebook outputs (as previously extracted): detector
  coverage 10.9%, full-test-set table (Kalman 0.219 ft), fair-comparison table on 16,009
  rows, horizon table, reversed-question table. Paper link from README.

## 6. Build & deploy

- Astro 7, `@astrojs/mdx`, `@astrojs/sitemap`, `@fontsource-variable/inter`,
  `@fontsource-variable/jetbrains-mono`. No Tailwind, no UI framework.
- Client JS: inline theme script in `<head>` (no flash) and a reduced-motion-aware
  IntersectionObserver for `fade-up`. Nothing else.
- `astro.config.mjs`: `site: 'https://samueljchen08.github.io'`, no `base`; rehype
  table-wrap plugin retained (needed for mobile tables).
- Deploy: existing `.github/workflows/deploy.yml` (`withastro/action` → GitHub Pages) on
  push to `main`. Pages source must be "GitHub Actions".
- Every page has title, description, canonical, and Open Graph tags.

## 7. Verification (definition of done)

- `astro check` and `astro build` pass with no errors or warnings.
- A script walks `dist/` and verifies every internal href resolves and every external
  href returns < 400 (repos, live report, LinkedIn, paper link).
- Lighthouse (dev browser): Performance ≥ 95, Accessibility 100, on `/` and one project
  page, both themes.
- Screenshots at 1440 / 768 / 390 px for every route in both themes, reviewed before
  completion is claimed.
- No horizontal page scroll at 320px; tables scroll within their container.
- Keyboard: every interactive element reachable and visibly focused.

## 8. Fresh-start mechanics

Delete: `src/`, `public/favicon.*`, `.impeccable/`, `README.md`, `PRODUCT.md`,
`DESIGN.md` (if present), `dist/`, `.astro/`.
Keep: `public/samuel-chen-resume.pdf`, `package.json` / lockfile (deps adjusted),
`tsconfig.json`, `astro.config.mjs`, `.github/workflows/deploy.yml`, `.gitignore`,
`AGENTS.md` + `CLAUDE.md` symlink, `.vscode/`.
The previous build is preserved in git history (`13ac5cb`). This spec is committed on top
of it; the next commit is the cleaned baseline, then implementation proceeds in small
commits.
