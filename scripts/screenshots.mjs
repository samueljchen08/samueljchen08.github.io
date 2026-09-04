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
