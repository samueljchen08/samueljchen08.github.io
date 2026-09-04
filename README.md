# samueljchen08.github.io

Personal site for Samuel Chen — MIT Computer Science (AI), 2027.

Built as a set of **audit working papers**: every measured figure on the site is a link that
resolves to the exact source it was agreed to, and the limits each project's own repository
states ship alongside its results rather than behind them.

## Sheets

| Index | Route | Contents |
| --- | --- | --- |
| `A-1` | `/` | Selected work, experience, education, contact |
| `W-1` | `/projects/opsgym/` | Agentic RL environment; measured evaluation noise floor |
| `W-2` | `/projects/agentic-commerce-lab/` | Causal experiments on AI buyer-agent choice |
| `W-3` | `/projects/multi-object-tracking/` | Sports tracking; the answer was no |
| `R-1` | `/resume/` | Résumé, plus the PDF |

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with `withastro/action`
and publishes to GitHub Pages. The repository is a `<user>.github.io` repo, so the site serves
from the domain root and needs no `base` path. Pages must be set to **Source: GitHub Actions**.

## Structure

```
src/
  data/profile.ts        Single source for everything the résumé PDF also states.
                         The homepage and /resume both read from it, so they cannot drift.
  content/projects/      One .mdx per project sheet. Adding a project is one file.
  components/            Sheet, Schedule, Mark (authored SVG pencil marks),
                         Figure (a measurement bound to its source), CrossRef.
  styles/tokens.css      Palette, type scale, spacing. Light and dark.
  styles/workpaper.css   The world: ruling, green-bar banding, ticks, stamps.
  layouts/Base.astro     Carries the design direction contract as an HTML comment.
```

## Content rule

Every figure is transcribed from a public source — the three repositories' READMEs, the
`Multi-Object-Tracking` notebook's stored cell outputs, or the résumé PDF. Nothing is rounded,
embellished, or inferred. When editing, keep it that way: if a number cannot be pointed at,
it does not belong on the page.

## Design

`PRODUCT.md` holds product truth. `DESIGN.md` records the built visual system. Surface strategy
per route lives in `.impeccable/surfaces/`.
