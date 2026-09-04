# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, deployed to GitHub Pages at `https://samueljchen08.github.io` (a `<user>.github.io`
repository, so it serves from the domain root and needs no `base` path). Chosen by the user from
four offered options; Vercel + custom domain, plain static HTML/CSS, and Next.js were declined.
Content lives in an Astro content collection so adding a project is one file.

## Users

The primary visitor is a **software engineering recruiter or hiring engineer** evaluating Samuel
Chen for an internship or new-grad role, reaching the site from a resume, a GitHub profile, a
LinkedIn message, or a referral. They arrive skeptical and time-boxed — often under a minute on a
first pass — and their job is to decide whether this candidate is worth an interview slot.

A second, slower visitor is an **interviewer preparing for a scheduled conversation**, who arrives
knowing the name and wants enough technical substance to ask a real question. This visitor reads
project pages end to end; the first one may never leave the homepage.

## Product Purpose

A personal site that makes Samuel's engineering work legible on its own terms rather than through
a resume PDF's bullet points.

The specific problem: his resume is finance-weighted — Goldman Sachs FIG, Barings, Cercano — and a
skimming recruiter files him as a banking intern. His strongest evidence is two projects with
genuine research depth that a bullet point cannot carry. Success is a visitor who leaves
understanding that he builds AI systems *and* the measurement machinery that establishes whether
they work, and who can name one specific finding an hour later.

## Positioning

Most student portfolios list projects. This one leads with **results that were measured properly**,
including the negative and self-limiting ones: a stated noise floor below which his own improvements
would not count, a validation funnel whose rejections are all logged, an evidence class attached to
an experimental claim, and an explicit "what is not done, and why."

The honest reporting is the differentiator, not decoration on it. A competitor can copy a project
list; they cannot copy "at n=5, k=8, any improvement below 22.5 points is not a result" without
having done the A/A test.

## Operating Context

- First contact is usually a fast skim on a laptop between other candidates' materials; a meaningful
  share of traffic is mobile, from a link in a message.
- Visitors cross-check against GitHub. The site must link out to real repositories that corroborate
  what it claims, and one project already has a published live report at
  `samueljchen08.github.io/agentic-commerce-lab/`.
- Many visitors want the PDF resume to attach to an internal system, so it must be one click away.
- Application timelines mean the site is shared cold, without Samuel present to explain anything on
  it.

## Capabilities and Constraints

- Static site, no backend, no database, no forms. Contact is direct channels only.
- Surfaces: homepage, one deep-dive page per project, an HTML resume page plus a downloadable PDF.
- **No writing or notes section.** Explicitly declined by the user; do not scaffold one.
- All contact information is public by the user's explicit decision, the scraping tradeoff having
  been stated: `samchen@mit.edu`, `github.com/samueljchen08`, `linkedin.com/in/samuelj-chen`,
  `(206) 475-8031`, and location (Bellevue, WA / Cambridge, MA).
- The `Multi-Object-Tracking` repository has no written description — only a link to a paper. Its
  content must be derived from the notebook or supplied by Samuel, never invented.

## Brand Commitments

The name is Samuel Chen; there is no logo, wordmark, or existing identity system.

The user named four sites as taste evidence, not as a brief to copy: `tomaszgil.me`, `jzhao.xyz`,
`raycast.com`, `stripe.dev`. What they share is restraint, technical density presented with
precision, and craft in small details. They pin no palette, typeface, or world.

Prior art in the same portfolio: his `agentic-commerce-lab` report page, which he wrote himself,
uses Newsreader + Archivo + IBM Plex Mono on a `#EEF1EE` paper ground with a green/red ledger
palette and a dark mode. It is evidence of his ability, not a constraint on this site's world.

## Evidence on Hand

Real, verifiable, and the entire basis for the site's content:

- **`github.com/samueljchen08/opsgym`** — Python (~142k). RL environment and synthetic data pipeline
  for enterprise billing-support agents. Ten numbered findings with measured results; held-out
  evaluation (pass@1 0.450, 95% CI [0.325, 0.575]; pass@4 0.929); a 176→24 validation funnel with
  logged rejections; an A/A noise-floor table; and a stated "no training run, no GPU."
- **`github.com/samueljchen08/agentic-commerce-lab`** — Python + HTML (~187k). Real experiment
  against `claude-sonnet-5`: 300 probes, 60 mandates, 5 arms, 11 real competitor products. Live
  report published. Tagged evidence class E1a by its own author.
- **`github.com/samueljchen08/Multi-Object-Tracking`** — a single 2.4MB Jupyter notebook and a link
  to a paper. Description pending extraction.
- **Resume PDF** at `~/Downloads/Samuel Chen UROP Resume.pdf` (August 2026, the most recent of
  several versions), covering education, five roles, and athletics.

Absences future work must not fabricate: no employer testimonials, no user counts, no press, no
product screenshots other than the agentic-commerce-lab report, no training-run results, and no
metrics beyond those printed in the repositories and the resume.

## Product Principles

1. **A measured number outranks a description.** Wherever a claim and a figure compete for the same
   space, the figure wins — it is the thing a visitor remembers and the thing nobody can copy.
2. **Publish the limits with the results.** The noise floor, the evidence class, and the "what is
   not done" are load-bearing content, not disclaimers to bury. Removing them would remove the
   reason to trust everything else.
3. **Engineering first, finance as evidence.** The finance roles stay, framed for what they prove to
   an engineer — quantitative rigor and shipped Python under real stakes — and never lead.
4. **Survive the sixty-second skim and reward the twenty-minute read.** Both visitors are real and
   the design owes each a complete experience; neither may be served by degrading the other.
5. **Every claim is corroborable.** Anything asserted on the page must be checkable against a linked
   repository, the live report, or the resume.

## Accessibility & Inclusion

No user-specific requirement was established. Standard obligations apply: the site is shared cold
and read on unknown devices, so it must be keyboard navigable, legible at mobile widths, and
readable with the visitor's own light or dark preference honored.
