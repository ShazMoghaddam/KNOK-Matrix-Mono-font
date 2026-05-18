# KNOK Matrix / Mono

An abstract typographic layout engine and digital system clock that showcases dynamic geometric SVGs interacting via CSS blend modes. 

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://shazmoghaddam.github.io/)

---

## 📐 Architecture Overview

**KNOK Matrix / Mono** functions as both an isolated real-time clock and a full modular index system (`KNOK_0` through `KNOK_9`). Every digit is precision-crafted utilizing structural SVG elements inside a rigid 500x700 mapping container.

The visual system emphasizes raw geometric interaction by running colors through strict CSS blend configurations (`multiply` / `screen`). To keep the layout clean, custom `.knockout` utility selectors isolate canvas-matching variables directly, enabling beautiful background-aware negative space cuts.

### Key Features
* 🕒 **Synchronized Live Clock:** Dynamic string-matching DOM engine running on an efficient `1000ms` cycle.
* 🌗 **Context-Aware Color-Spaces:** Toggle between **Studio Light** (`multiply`) and **Gallery Dark** (`screen`) visual modes seamlessly.
* 🏗️ **Performance Optimized:** Uses an HTML5 `<template>` node to safely store base assets, generating cloned references instantly with zero document bloat.

---

## 🎨 Color Palette Architecture

The interface maps 11 custom-tuned structural color spaces into dynamic layout blocks:

| Variable | Color Name | Hex |
|---|---|---|
| `--color-mint` | Mint | `#2FA084` |
| `--color-ultramarine` | Ultramarine | `#3852B4` |
| `--color-royalfall` | Royal Fall | `#2845D6` |
| `--color-safetyorange` | Safety Orange | `#FF6500` |
| `--color-purered` | Pure Red | `#FF0000` |
| `--color-hotpink` | Hot Pink | `#FF4B91` |

---

## 🚀 Getting Started

Since the system relies entirely on native browser features, it requires no compilation or package managers.

1. Clone or download the repository.
2. Open `index.html` directly in any modern browser.

```bash
git clone [https://github.com/shazmoghaddam/knok-matrix.git](https://github.com/shazmoghaddam/knok-matrix.git)
cd knok-matrix
open index.html