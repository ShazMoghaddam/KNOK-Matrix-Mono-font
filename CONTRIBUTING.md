# Contributing

Thanks for your interest. Issues and pull requests are welcome, especially bug reports from browsers and screen readers I haven't tested.

## Getting set up

You only need a browser to work on the page: open `index.html`.

To run the tests, you also need Node 20 or later:

```bash
npm install
npx playwright install chromium
npm test
```

## Before you open a pull request

- Run `npm test`. CI runs the same tests at five screen widths.
- Check the page in both themes, both clock formats and at phone width.
- If you change how a glyph looks, rebuild the images with `npm run build:assets` and commit them.
- Add a line to `CHANGELOG.md` under a new "Unreleased" heading.

## Ideas for new glyphs

Each glyph sits in a 500 × 700 viewBox inside `<template id="digit-templates">`. Keep to primitive shapes (`rect`, `circle`, `polygon`, `path`), use the slot colours `--c1` to `--c7` so both themes work, and give inner holes `class="knockout"`.

## Style

- Keep it one HTML file with no runtime dependencies.
- Plain names and short comments that explain why, not just what.
- Every control must work with a keyboard and have a visible focus ring.
