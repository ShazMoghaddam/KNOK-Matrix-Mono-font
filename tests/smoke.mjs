/**
 * Smoke tests: open the real page in headless Chromium and check it works.
 *
 *     npm test
 *
 * Runs in CI on every push and pull request.
 */

import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import { chromium } from 'playwright';
import { serve } from '../scripts/serve.mjs';

let browser, server, url;

before(async () => {
  ({ server, base: url } = await serve());
  url += '/index.html';
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  server?.close();
});

async function open(options = {}) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.waitForSelector('#s2 svg');
  return { page, errors, context };
}

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`renders cleanly at ${width}px`, async () => {
    const { page, errors, context } = await open({ viewport: { width, height: 900 } });
    const r = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      glyphs: document.querySelectorAll('.digits-grid .art-digit').length,
      slots: document.querySelectorAll('.clock-digit-box svg').length,
    }));
    assert.deepEqual(errors, [], 'no JavaScript errors');
    assert.ok(r.overflow <= 0, `no sideways scrolling (page is ${r.overflow}px too wide)`);
    assert.equal(r.glyphs, 10, 'all ten glyphs in the index');
    assert.equal(r.slots, 6, 'all six clock slots drawn');
    await context.close();
  });
}

test('both theme buttons are readable in both themes', async () => {
  const { page, context } = await open({ colorScheme: 'light' });
  for (const theme of ['light', 'dark']) {
    await page.click(`[data-theme-choice="${theme}"]`);
    const same = await page.evaluate(() => [...document.querySelectorAll('.btn')].filter(b => {
      const s = getComputedStyle(b);
      const bg = s.backgroundColor === 'rgba(0, 0, 0, 0)'
        ? getComputedStyle(b.parentElement).backgroundColor
        : s.backgroundColor;
      return s.color === bg;
    }).map(b => b.textContent));
    assert.deepEqual(same, [], `no button text matches its background in ${theme}`);
  }
  await context.close();
});

test('theme follows the system, then remembers the visitor\'s choice', async () => {
  const { page, context } = await open({ colorScheme: 'dark' });
  assert.equal(await page.getAttribute('html', 'data-theme'), 'dark');
  await page.click('[data-theme-choice="light"]');
  await page.reload();
  assert.equal(await page.getAttribute('html', 'data-theme'), null);
  assert.equal(await page.getAttribute('[data-theme-choice="light"]', 'aria-pressed'), 'true');
  await context.close();
});

test('12-hour mode shows AM or PM and is remembered', async () => {
  const { page, context } = await open();
  await page.click('[data-format-choice="12"]');
  assert.match(await page.textContent('#meridiem'), /^(AM|PM)$/);
  await page.reload();
  await page.waitForSelector('#s2 svg');
  assert.equal(await page.getAttribute('[data-format-choice="12"]', 'aria-pressed'), 'true');
  assert.equal(await page.isVisible('#meridiem'), true);
  await context.close();
});

test('screen readers get the time without a per-second announcement', async () => {
  const { page, context } = await open();
  const r = await page.evaluate(() => {
    const t = document.getElementById('clock-accessible');
    return { text: t.textContent, live: t.closest('[aria-live]') };
  });
  assert.match(r.text, /^Current time \d{1,2}:\d{2}/);
  assert.equal(r.live, null, 'the clock is not a live region');
  await context.close();
});
