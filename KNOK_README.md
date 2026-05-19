# KNOK Matrix / Mono

**An abstract typographic layout engine and real-time digital system clock built from pure geometric SVG.**

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://shazmoghaddam.github.io/)
[![Version](https://img.shields.io/badge/version-1.1.0-blue)](#)
[![Licence: CC BY 4.0](https://img.shields.io/badge/Licence-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

[🔗 LinkedIn](https://www.linkedin.com/in/shazmoghaddam/) &nbsp;|&nbsp; [🌐 Portfolio](https://shazmoghaddam.github.io/)

---

<!-- Add a screenshot here once hosted -->
<!-- ![KNOK Matrix preview](./preview.png) -->

## What is it?

**KNOK Matrix / Mono** is a single-file, zero-dependency typographic system where digits 0–9 are rendered as hand-composed geometric SVG artworks. Each glyph (`KNOK_0` through `KNOK_9`) is built entirely from primitive SVG shapes — `<path>`, `<rect>`, `<circle>`, `<polygon>` — layered with CSS blend modes to produce optical depth and colour interaction.

The same ten glyphs power two things simultaneously:

- a **static design index** displaying all ten artworks in a responsive grid
- a **live clock** that reads the system time every second and swaps the correct SVG into each digit position

No images. No canvas. No libraries. One HTML file.

---

## Architecture

### SVG glyph system — `<template>` pattern

Every glyph lives inside a single `<template id="digit-templates">` element. The `<template>` tag is never rendered by the browser — it acts as an inert asset store. On load, `initSystem()` queries all ten `.art-digit` SVGs from the template's document fragment and uses `cloneNode(true)` to stamp copies into:

- each `.art-digit-wrapper[data-digit]` cell in the static index grid
- each `.clock-digit-box` slot in the live clock display

One authoritative definition per glyph, two views, zero duplication, zero extra DOM weight.

### Blend mode colour system

All SVG shape elements carry `mix-blend-mode: var(--blend-mode)`. The value switches with the active theme:

| Theme | Mode | Effect |
|---|---|---|
| **Studio Light** (light bg) | `multiply` | Colours deepen and darken where shapes overlap — ink on paper |
| **Gallery Dark** (dark bg) | `screen` | Colours brighten and glow where shapes overlap — light on a projector |

The same SVG geometry produces two visually distinct results in each mode — no artwork changes required.

### The `.knockout` technique

Several glyphs (0, 6, 7, 8, 9) contain ring shapes built from two overlapping filled shapes: a larger coloured shape and a smaller inner shape marked `class="knockout"`. The knockout class forces:

```css
.art-digit .knockout {
    mix-blend-mode: normal !important;
    opacity: 1 !important;
    fill: var(--bg-canvas) !important;
    transition: fill 0.4s ease;
}
```

`fill: var(--bg-canvas)` paints the inner shape with the exact background colour, punching a clean hole through the layer beneath. Because it references the CSS variable directly, the cutout automatically adapts when the theme switches — no JavaScript required.

### Theme switching — `data-theme` attribute

Themes are controlled by a single `data-theme` attribute on `<html>`. Setting `data-theme="neon"` activates the dark palette via a CSS attribute selector:

```css
[data-theme="neon"] {
    --bg-canvas: #0b0c10;
    --blend-mode: screen;
    /* ... */
}
```

Removing the attribute reverts to the default light theme. No class toggling, no JavaScript colour assignments — the cascade handles everything.

### Live clock — `syncSlot` diff optimisation

The clock ticks on a `1000ms` interval. Rather than re-rendering all six digit slots on every tick, `syncSlot()` compares the incoming digit character against a cached value map. A DOM update only fires when the value has actually changed:

```js
function syncSlot(slotId, digitValue) {
    if (currentClockStrings[slotId] !== digitValue) {
        currentClockStrings[slotId] = digitValue;
        const container = document.getElementById(slotId);
        container.innerHTML = '';
        container.appendChild(svgTemplates[parseInt(digitValue, 10)].cloneNode(true));
    }
}
```

In practice the hours slot may not change for 60 minutes. The diff check keeps DOM mutations to the strict minimum.

### Visibility-aware interval

The clock interval is stored and managed via the `visibilitychange` API:

```js
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(clockInterval);
    } else {
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
    }
});
```

When the tab is hidden the interval is cleared. When it returns to focus the clock syncs immediately before the new interval starts.

---

## Colour palette

All 11 colours are defined as CSS custom properties on `:root` and remapped to semantic slot variables (`--c1` through `--c7`) per theme. Slot assignments differ between themes so the same geometry reads differently in light vs dark context.

| Variable | Name | Hex |
|---|---|---|
| `--color-mint` | Mint | `#2FA084` |
| `--color-ultramarine` | Ultramarine | `#3852B4` |
| `--color-deepgreen` | Deep Green | `#285A48` |
| `--color-royalfall` | Royal Fall | `#2845D6` |
| `--color-amethyst` | Amethyst | `#B153D7` |
| `--color-purered` | Pure Red | `#FF0000` |
| `--color-cornflower` | Cornflower | `#5A7ACD` |
| `--color-vibrantyellow` | Vibrant Yellow | `#FFCC00` |
| `--color-slate` | Slate | `#7F8CAA` |
| `--color-safetyorange` | Safety Orange | `#FF6500` |
| `--color-hotpink` | Hot Pink | `#FF4B91` |

---

## Responsive behaviour

| Breakpoint | Grid layout |
|---|---|
| > 950px | 5 columns (full index) |
| ≤ 950px | 3 columns |
| ≤ 600px | 2 columns |

Clock separator dots and digit box sizing compress proportionally on small viewports.

---

## Accessibility

- Live clock announced to screen readers via a visually-hidden `aria-live="polite"` element
- Theme buttons expose active state via `aria-pressed`
- All SVG glyphs carry `role="img"` and `aria-label`
- Decorative clock separators marked `aria-hidden="true"`
- `prefers-reduced-motion` disables the pulsing dot animation
- `<main>` landmark wraps primary content; `<nav>` wraps footer links
- Controls grouped with `role="group"` and `aria-label`

---

## Project structure

```
KNOK_MATRIX___MONO.html   ← entire system in one file
README.md
LICENSE.txt
```

No build step. No package manager. No dependencies.

---

## Getting started

```bash
git clone https://github.com/shazmoghaddam/knok-matrix.git
cd knok-matrix
open KNOK_MATRIX___MONO.html
```

Or download the `.html` file and open it directly in any modern browser.

---

## Stack

```
HTML5      — template element, semantic landmarks, SVG primitives
CSS3       — custom properties, mix-blend-mode, attribute selectors, transitions
JS ES6     — cloneNode, setInterval, visibilitychange, string diffing
```

---

## Licence

This project is licensed under the **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

You are free to share and adapt this work for any purpose, including commercially, as long as you give appropriate credit to **Shaz Moghaddam** and indicate if changes were made.

[View full licence →](./LICENSE.txt) &nbsp;|&nbsp; [creativecommons.org/licenses/by/4.0](https://creativecommons.org/licenses/by/4.0/)

---

*No libraries · No frameworks · No build step · One file*

**Shaz Moghaddam** · Data Science · Machine Learning · App Development · London, UK
