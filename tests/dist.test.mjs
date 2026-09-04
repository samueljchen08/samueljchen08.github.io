import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const html = (p) => readFileSync(join(dist, p), 'utf8');

test('homepage builds with nav and meta, and ships one palette', () => {
  const page = html('index.html');
  assert.match(page, /<title>Samuel Chen<\/title>/);
  assert.match(page, /<meta property="og:title"/);
  assert.match(page, /<link rel="canonical" href="https:\/\/samueljchen08\.github\.io\/"/);
  for (const href of ['/#projects', '/#experience', '/resume/', 'https://github.com/samueljchen08']) {
    assert.ok(page.includes(`href="${href}"`), `nav links to ${href}`);
  }
  assert.doesNotMatch(page, /aria-label="Toggle theme"/, 'the site ships one palette — no theme switch');
  assert.doesNotMatch(page, /data-theme/, 'no theme attribute is written at runtime');
});

test('fonts are self-hosted, nothing from Google', () => {
  const page = html('index.html');
  assert.doesNotMatch(page, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});

test('social preview card ships and is referenced absolutely', () => {
  assert.ok(existsSync(join(dist, 'og.png')), 'og.png is in the build');
  const page = html('index.html');
  assert.ok(
    page.includes('property="og:image" content="https://samueljchen08.github.io/og.png"'),
    'og:image is an absolute URL — relative paths are ignored by most platforms',
  );
  assert.match(page, /name="twitter:card" content="summary_large_image"/);
});

test('every image the pages reference is actually in the build', () => {
  // A logo referenced but not shipped renders as a broken icon; nothing else catches it.
  for (const file of ['index.html', 'resume/index.html']) {
    const page = html(file);
    for (const src of new Set([...page.matchAll(/(?:src|href)="(\/[^"]+\.(?:jpg|jpeg|png|svg|webp|pdf))"/g)].map((m) => m[1]))) {
      assert.ok(existsSync(join(dist, src)), `${src} referenced by ${file} is missing from dist/`);
    }
  }
});

test('robots and favicon ship', () => {
  assert.ok(existsSync(join(dist, 'robots.txt')));
  assert.ok(existsSync(join(dist, 'favicon.svg')));
  assert.match(html('robots.txt'), /Sitemap: https:\/\/samueljchen08\.github\.io\/sitemap-index\.xml/);
});

test('opsgym project page builds with its headline figures', () => {
  const page = html('projects/opsgym/index.html');
  assert.match(page, /<title>Opsgym — Samuel Chen<\/title>/);
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

test('multi-object-tracking page builds with the Kalman result', () => {
  const page = html('projects/multi-object-tracking/index.html');
  assert.ok(page.includes('0.219'));
  assert.ok(page.includes('16,009'));
  assert.ok(page.includes('https://drive.google.com/file/d/14I8We1yRNw1d1kzCVHLzmc5P-jsfh__H/view'));
});

test('homepage: hero has meta line and three actions, no tagline', () => {
  const page = html('index.html');
  assert.ok(page.includes("MIT CS-AI '27 · Cambridge, MA / Bellevue, WA"));
  assert.ok(page.includes('href="/samuel-chen-resume.pdf"'));
  assert.ok(page.includes('href="https://github.com/samueljchen08"'), 'hero links to github');
  assert.doesNotMatch(page, /id="contact"/, 'the contact section is gone');
  assert.doesNotMatch(page, /data-contact-form/, 'the contact form is gone');
  assert.doesNotMatch(page, /measurement machinery/);
});

test('homepage: projects carousel, in order and without the stat column', () => {
  const page = html('index.html');
  const i1 = page.indexOf('href="/projects/opsgym/"');
  const i2 = page.indexOf('href="/projects/agentic-commerce-lab/"');
  const i3 = page.indexOf('href="/projects/multi-object-tracking/"');
  assert.ok(i1 > -1 && i2 > i1 && i3 > i2, 'projects appear in order');
  for (const fig of ['22.5 pts', '−$188,718', '0.219 ft']) {
    assert.ok(!page.includes(fig), `${fig} belongs to the project page, not the card`);
  }
  assert.match(page, /aria-label="Next projects"/, 'projects carousel has controls');
  assert.match(page, /aria-label="Next roles"/, 'experience carousel has controls');
  // Arrows separate links; nothing trails the last one in a card.
  assert.doesNotMatch(page, /live report<\/a>\s*<span[^>]*>→/, 'no arrow after the last link');
  assert.ok(page.includes('>Opsgym<'), 'the project title is capitalised');
});

test('homepage: experience, education, activities sections', () => {
  const page = html('index.html');
  assert.match(page, /id="experience"/);
  const ig = page.indexOf('Goldman Sachs');
  const ins = page.indexOf('Nexus AI');
  assert.ok(ins > -1 && ig > ins, 'Nexus AI precedes Goldman');
  assert.ok(page.includes('4.95/5.0'));
  assert.ok(page.includes('Managing Director of Finance'));
  assert.ok(page.includes('VP of Corporate Relations'));
});

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

test('resume page renders every role and the PDF button', () => {
  const page = html('resume/index.html');
  assert.match(page, /<title>Résumé — Samuel Chen<\/title>/);
  assert.ok(page.includes('href="/samuel-chen-resume.pdf"'));
  for (const c of ['Nexus AI (Courtex)', 'Goldman Sachs', 'Barings', 'Cercano Management (Vulcan Capital)', 'MIT Sloan School of Management']) {
    assert.ok(page.includes(c), c);
  }
  assert.ok(page.includes('Recruited Collegiate Athlete (Point Guard)'));
  assert.ok(page.includes('Fantasy Football'));
  assert.ok(page.includes('· <a'), 'contact separators keep their spaces');
  assert.ok(!page.includes('·<a'), 'no collapsed separators');
});

test('404 page and sitemap exist', () => {
  const page = html('404.html');
  assert.ok(page.includes('href="/"'));
  assert.match(page, /not found/i);
  assert.ok(page.includes('name="robots" content="noindex"'), '404 is noindex');
  assert.ok(!page.includes('rel="canonical"'), '404 has no canonical link');
  const sm = html('sitemap-0.xml');
  for (const url of ['https://samueljchen08.github.io/', 'https://samueljchen08.github.io/resume/', 'https://samueljchen08.github.io/projects/opsgym/']) {
    assert.ok(sm.includes(`<loc>${url}</loc>`), url);
  }
});
