/**
 * Build the README banner, the GitHub social preview and the README screenshots.
 *
 * Usage (from the repo root):
 *
 *     npm install
 *     npm run build:assets
 *
 * Writes:
 *   assets/banner.png          2560 x 800, shown at the top of the README
 *   assets/social-preview.png  1280 x 640, upload it in Settings > Social preview
 *   assets/screenshots/*.png   light, dark and phone views of the live page
 *
 * Every glyph is taken from index.html itself, so the images always match the real artwork.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { serve, ROOT } from '../scripts/serve.mjs';

const OUT = join(ROOT, 'assets');

/* Banner and preview share the page's own CSS, so colours and blend modes are identical */
function brandPage({ css, glyphs, theme, body, extraCss }) {
  const glyph = d => glyphs[d];
  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8">
<style>${css}
html, body { margin: 0; padding: 0; }
body { display: block; min-height: 0; overflow: hidden; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
${extraCss}</style></head><body>${body(glyph)}</body></html>`;
}

const BANNER_CSS = `
.banner { width: 1280px; height: 400px; box-sizing: border-box; padding: 56px 64px;
  display: grid; grid-template-columns: 1fr 520px; align-items: center; gap: 40px;
  background: var(--bg-canvas); position: relative; }
.banner::after { content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(var(--border) 1px, transparent 1px);
  background-size: 100% 44px; opacity: .55; }
.eyebrow { font-size: 14px; letter-spacing: 3.5px; text-transform: uppercase; color: var(--color-royalfall); font-weight: 700; margin: 0 0 18px; }
.title { font-size: 70px; line-height: .95; font-weight: 900; text-transform: uppercase; letter-spacing: -1.5px; margin: 0; color: var(--color-text); }
.sub { font-size: 20px; color: var(--text-muted); margin: 20px 0 24px; }
.chips { display: flex; gap: 10px; flex-wrap: wrap; position: relative; z-index: 1; }
.chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 999px;
  background: var(--surface); border: 1px solid var(--border); font-size: 15px; font-weight: 600; color: var(--color-text); }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.clock { position: relative; z-index: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 22px;
  padding: 26px 26px 20px; box-shadow: 0 24px 48px rgba(0,0,0,.06); }
.clock .label { text-align: center; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 16px; }
.clock .row { display: flex; align-items: center; justify-content: center; gap: 12px; }
.clock .box { --knockout: var(--surface-sunk); width: 98px; aspect-ratio: 5/7; background: var(--surface-sunk); border-radius: 10px; }
.clock .sep { display: flex; flex-direction: column; gap: 16px; }
.clock .sep i { width: 13px; height: 13px; border-radius: 50%; background: var(--color-purered); display: block; }
`;

const PREVIEW_CSS = `
.preview { width: 1280px; height: 640px; box-sizing: border-box; padding: 64px 64px 52px;
  display: flex; flex-direction: column; background: var(--bg-canvas); }
.eyebrow { font-size: 16px; letter-spacing: 4px; text-transform: uppercase; color: var(--color-vibrantyellow); font-weight: 700; margin: 0 0 18px; }
.title { font-size: 100px; line-height: .95; font-weight: 900; text-transform: uppercase; letter-spacing: -2.5px; margin: 0; color: var(--color-text); }
.sub { font-size: 26px; color: var(--text-muted); margin: 22px 0 0; }
.glyphs { margin-top: auto; display: grid; grid-template-columns: repeat(10, 1fr); gap: 12px; }
.glyphs .cell { --knockout: var(--surface); background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px 4px; }
.glyphs .cell .art-digit { aspect-ratio: 5/7; height: auto; }
.foot { display: flex; justify-content: space-between; margin-top: 22px; font-size: 15px; color: var(--text-muted); letter-spacing: 1px; }
`;

async function main() {
  const { server, base } = await serve();
  const url = `${base}/index.html`;
  const browser = await chromium.launch();
  await mkdir(join(OUT, 'screenshots'), { recursive: true });

  /* 1. Pull the page's CSS and the ten glyphs straight from index.html */
  const page = await browser.newPage();
  await page.goto(url);
  const { css, glyphs } = await page.evaluate(() => ({
    css: document.querySelector('style').textContent,
    glyphs: [...document.getElementById('digit-templates').content.querySelectorAll('svg')].map(s => s.outerHTML),
  }));
  await page.close();

  /* 2. Banner: Studio Light, with the clock reading 10:24 */
  const banner = await browser.newPage({ viewport: { width: 1280, height: 400 }, deviceScaleFactor: 2 });
  await banner.setContent(brandPage({
    css, glyphs, theme: 'light', extraCss: BANNER_CSS,
    body: g => `<div class="banner">
      <div>
        <p class="eyebrow mono">Pure SVG · live clock · one HTML file</p>
        <h1 class="title">KNOK Matrix<br>/ Mono</h1>
        <p class="sub">Ten digits drawn from circles, rectangles and polygons.</p>
        <div class="chips">
          <span class="chip"><span class="dot" style="background:#f6f5f0;border:1px solid #bbb"></span>Studio Light</span>
          <span class="chip"><span class="dot" style="background:#0b0c10"></span>Gallery Dark</span>
          <span class="chip"><span class="dot" style="background:var(--color-purered)"></span>12h / 24h</span>
        </div>
      </div>
      <div class="clock">
        <div class="label">Synchronised live display</div>
        <div class="row">
          <div class="box">${g(1)}</div><div class="box">${g(0)}</div>
          <div class="sep"><i></i><i></i></div>
          <div class="box">${g(2)}</div><div class="box">${g(4)}</div>
        </div>
      </div>
    </div>`,
  }));
  await banner.screenshot({ path: join(OUT, 'banner.png') });
  await banner.close();

  /* 3. Social preview: Gallery Dark, all ten glyphs */
  const preview = await browser.newPage({ viewport: { width: 1280, height: 640 } });
  await preview.setContent(brandPage({
    css, glyphs, theme: 'dark', extraCss: PREVIEW_CSS,
    body: g => `<div class="preview">
      <p class="eyebrow mono">Pure SVG · live clock · one HTML file</p>
      <h1 class="title">KNOK Matrix / Mono</h1>
      <p class="sub">Ten digits drawn from circles, rectangles and polygons.</p>
      <div class="glyphs">${[...Array(10).keys()].map(d => `<div class="cell">${g(d)}</div>`).join('')}</div>
      <div class="foot mono"><span>github.com/ShazMoghaddam/knok-matrix</span><span>Shaz Moghaddam · London</span></div>
    </div>`,
  }));
  await preview.screenshot({ path: join(OUT, 'social-preview.png') });
  await preview.close();

  /* 4. README screenshots of the real page */
  const shots = [
    { name: 'desktop-light', theme: 'light', viewport: { width: 1440, height: 900 }, scale: 1 },
    { name: 'desktop-dark',  theme: 'dark',  viewport: { width: 1440, height: 900 }, scale: 1 },
    { name: 'phone-dark',    theme: 'dark',  viewport: { width: 390,  height: 844 }, scale: 2 },
  ];
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.scale, colorScheme: s.theme });
    const p = await ctx.newPage();
    await p.goto(url);
    await p.waitForTimeout(400);
    await p.screenshot({ path: join(OUT, 'screenshots', `${s.name}.png`) });
    await ctx.close();
  }

  await browser.close();
  server.close();
  console.log('wrote assets/banner.png, assets/social-preview.png and assets/screenshots/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
