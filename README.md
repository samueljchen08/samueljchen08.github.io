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
