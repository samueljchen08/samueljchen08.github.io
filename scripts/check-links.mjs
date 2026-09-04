// Walks dist/, checks every href. Same-origin links resolve against dist first
// (fetched only when no matching file exists there); other internal links must
// resolve to a file in dist/; remaining external links must answer with a
// status < 400. Run after `npm run build`.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SITE = 'https://samueljchen08.github.io';

const dist = resolve('dist');
if (!existsSync(dist)) { console.error('dist/ missing — run npm run build first'); process.exit(1); }

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}

// Candidate dist/ files a path could resolve to: a literal file, an index.html
// under a directory, or a flat "<path>.html" (e.g. /404/ -> dist/404.html, how
// Astro emits its special 404 page regardless of trailingSlash config).
function distCandidates(path) {
  return [
    join(dist, path),
    join(dist, path, 'index.html'),
    join(dist, path.replace(/\/$/, '') + '.html'),
  ];
}

const internal = new Map(); // href -> [pages]
const external = new Map();
for (const file of htmlFiles(dist)) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) continue;
    let bucket = /^https?:\/\//.test(href) ? external : internal;
    let key = href;
    if (href.startsWith(SITE + '/')) {
      const path = href.slice(SITE.length).split('#')[0].split('?')[0];
      if (distCandidates(path).some((c) => existsSync(c))) {
        bucket = internal;
        key = path;
      }
    }
    if (!bucket.has(key)) bucket.set(key, []);
    bucket.get(key).push(file.slice(dist.length));
  }
}

let failures = 0;
for (const [href, pages] of internal) {
  const path = href.split('#')[0].split('?')[0];
  if (!distCandidates(path).some((c) => existsSync(c))) {
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
