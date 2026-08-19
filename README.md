# NutterTools — Every Useful Tool, All in One Place

A collection of useful tools — images, PDFs, code, media, text and everyday utilities — organized into sections.

## Live
https://viasrijan.github.io/nuttertools/

## Features
- 111 tools listed (all implemented)
- Tools organized into sections with dropdown navigation
- Search, dark mode, PWA
- Flat white SVG icons throughout, powered by lucide-react

## Quick Start
npm install
npm run dev

## Build for GitHub Pages
npm run build
npx gh-pages -d dist

## Stack
Vite + React + Tailwind + lucide-react + pdf-lib + pdfjs-dist + tesseract.js + heic2any + qrcode + jszip

## Donate
https://www.paypal.me/iSrijan

## Add new tool
1. Add an entry to `src/data/tools.json` (id, name, desc, category, icon, implemented)
2. Map the id to a lucide icon in `src/components/Icon.tsx`
3. Create the implementation in `src/tools/implementations` and register it in `src/tools/registry.tsx`
4. Set `implemented: true` in `tools.json`
