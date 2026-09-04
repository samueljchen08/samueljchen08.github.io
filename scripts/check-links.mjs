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
