# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [semantic versioning](https://semver.org/).

## [1.2.0] - 2026-11-27

A full tidy-up: bug fixes, a 12-hour clock, a proper phone layout and a repo to match.

### Added
- **12h / 24h switch** for the clock. In 12-hour mode it shows AM or PM, and hours below 10 show a single digit, like a real clock face.
- Theme and clock format are remembered between visits.
- The page follows your device's light or dark theme until you pick one, with no white flash on load.
- Sharing tags (title, description, image) and a favicon.
- Live demo on GitHub Pages.
- Smoke tests in a headless browser at five screen widths, run in CI on every push and pull request.
- README banner, GitHub social preview and screenshots, all built from the real glyphs by `assets/build.mjs`.
- `CHANGELOG.md`, `SECURITY.md`, `CONTRIBUTING.md` and Dependabot.

### Fixed
- The **Gallery Dark** button was invisible in the light theme: white text on cream. The dark theme's CSS rule also matched the button itself, because both used `data-theme="neon"`. The theme now lives only on `<html>`, and the buttons use `data-theme-choice`.
- Screen readers announced the time **every second**, which made the page unusable with one. The time is now plain text that updates once a minute.
- Knockout holes were a slightly different colour from the card behind them. Cards are now solid, and each container sets its own knockout colour.
- The sharp top of the 4 was clipped at the edge of its box.
- The clock could run up to a second behind. It now ticks on the real second boundary.
- The clock was tiny on phones. Its digits now scale with the screen and fill the card.
- README clone link pointed to a repo that didn't exist, and the demo badge pointed to the homepage.

### Changed
- `KNOK_MATRIX___MONO.html` is now `index.html`, so GitHub Pages serves it at a clean address.
- Theme and format switches are now segmented controls with a visible keyboard focus ring.
- Muted text is darker in the light theme and lighter in the dark theme, to meet WCAG AA contrast.
- "Synchronized" is now spelled "Synchronised".
- Footer now reads Website, LinkedIn and Source.
- Licence year corrected to 2026, when the project was created.

### Removed
- Raw screenshots from the repo root (replaced by `assets/screenshots/`).

## [1.1.0] - 2026-05-19

First public version: ten geometric SVG glyphs, a design index, a live clock and two themes, in one HTML file. The licence was later switched to the standard MIT text (26 October 2026).
