import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
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

test('opsgym project page builds with its headline figures', () => {
  const page = html('projects/opsgym/index.html');
  assert.match(page, /<title>opsgym — Samuel Chen<\/title>/);
  assert.ok(page.includes('22.5'), 'noise floor figure present');
  assert.ok(page.includes('0.450'), 'pass@1 present');
  assert.ok(page.includes('https://github.com/samueljchen08/opsgym'));
  assert.ok(page.includes('class="table-wrap"'), 'markdown tables are wrapped for horizontal scroll');
});

test('agentic-commerce-lab page builds with the live report link', () => {
  const page = html('projects/agentic-commerce-lab/index.html');
  assert.ok(page.includes('188,718'));
  assert.ok(page.includes('https://samueljchen08.github.io/agentic-commerce-lab/'));
  assert.ok(page.includes('E1a'));
});
