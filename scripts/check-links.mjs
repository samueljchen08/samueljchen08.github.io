// Walks dist/, checks every href. Same-origin links resolve against dist first
// (fetched only when no matching file exists there); other internal links must
// resolve to a file in dist/; remaining external links must answer with a
// status < 400. Internal hrefs carrying a "#frag" (including "/#work" and
// bare same-page TOC links like "#the-wedge") also have their fragment
// verified against an id="frag" in the resolved target page. Run after
// `npm run build`.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SITE = 'https://samueljchen08.github.io';
const FETCH_TIMEOUT_MS = 15000;

const dist = resolve('dist');
if (!existsSync(dist)) { console.error('dist/ missing — run npm run build first'); process.exit(1); }

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}

function isFile(p) {
  return existsSync(p) && statSync(p).isFile();
}

// Candidate dist/ files a path could resolve to: a literal file, an index.html
// under a directory, or a flat "<path>.html" (e.g. /404/ -> dist/404.html, how
// Astro emits its special 404 page regardless of trailingSlash config). Only
// actual files count — a bare directory (e.g. dist/ itself for path "") must
// not satisfy the literal candidate.
function distCandidates(path) {
  return [
    join(dist, path),
    join(dist, path, 'index.html'),
    join(dist, path.replace(/\/$/, '') + '.html'),
  ];
}

function resolveDistFile(path) {
  return distCandidates(path).find((c) => isFile(c));
}

const files = [...htmlFiles(dist)];
const htmlByFile = new Map();
for (const file of files) htmlByFile.set(file, readFileSync(file, 'utf8'));

const internal = new Map(); // href -> [pages]
const external = new Map();
const fragments = new Map(); // `${targetFile}#${frag}` -> { targetFile, frag, pages: [] }

function recordFragment(sourceFile, frag, targetFile) {
  const key = `${targetFile ?? 'MISSING'}#${frag}`;
  if (!fragments.has(key)) fragments.set(key, { targetFile, frag, pages: [] });
  fragments.get(key).pages.push(sourceFile.slice(dist.length));
}

for (const file of files) {
  const src = htmlByFile.get(file);
  for (const m of src.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;

    if (href.startsWith('#')) {
      const frag = href.slice(1);
      if (frag) recordFragment(file, frag, file); // bare fragment targets its own page
      continue;
    }

    let bucket = /^https?:\/\//.test(href) ? external : internal;
    let key = href;
    if (href.startsWith(SITE + '/')) {
      const path = href.slice(SITE.length).split('#')[0].split('?')[0];
      if (resolveDistFile(path)) {
        bucket = internal;
        key = path;
      }
    }
    if (!bucket.has(key)) bucket.set(key, []);
    bucket.get(key).push(file.slice(dist.length));

    if (bucket === internal && href.includes('#')) {
      const frag = href.split('#')[1];
      if (frag) {
        const rawPath = href.startsWith(SITE + '/') ? href.slice(SITE.length) : href;
        const path = rawPath.split('#')[0].split('?')[0];
        recordFragment(file, frag, resolveDistFile(path));
      }
    }
  }
}

let failures = 0;
for (const [href, pages] of internal) {
  const path = href.split('#')[0].split('?')[0];
  if (!resolveDistFile(path)) {
    failures++;
    console.log(`BROKEN internal ${href}  (from ${pages[0]})`);
  }
}

for (const { targetFile, frag, pages } of fragments.values()) {
  if (!targetFile) {
    failures++;
    console.log(`BROKEN fragment #${frag}  (from ${pages[0]}, target page missing)`);
    continue;
  }
  const html = htmlByFile.get(targetFile) ?? readFileSync(targetFile, 'utf8');
  if (html.includes(`id="${frag}"`)) {
    console.log(`ok fragment #${frag}  (${targetFile.slice(dist.length)})`);
  } else {
    failures++;
    console.log(`BROKEN fragment #${frag}  (from ${pages[0]}, target ${targetFile.slice(dist.length)})`);
  }
}

for (const [href, pages] of external) {
  try {
    let res = await fetch(href, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (res.status === 405 || res.status === 403) res = await fetch(href, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (res.status === 999) { console.log(`UNVERIFIABLE ${href} (bot-blocked, 999)`); continue; }
    if (res.status >= 400) { failures++; console.log(`BROKEN ${res.status} ${href}  (from ${pages[0]})`); }
    else console.log(`ok ${res.status} ${href}`);
  } catch (err) {
    failures++;
    console.log(`ERROR ${href}: ${err.message}`);
  }
}

console.log(`\n${internal.size} internal, ${fragments.size} fragments, ${external.size} external, ${failures} failures`);
process.exit(failures ? 1 : 0);
