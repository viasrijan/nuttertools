# OmniTools - 95+ Privacy-First Tools

All-in-one static site with 95+ tools that work 100% offline in browser. Built for GitHub Pages.

## Live
https://viasrijan.github.io/omnitools/

## Features
- 15 fully working tools (image, pdf, dev)
- 80 placeholder pages ready to implement
- No backend, no uploads, files never leave device
- Search, categories, dark mode, PWA

## Quick Start
npm install
npm run dev

## Build for GitHub Pages
npm run build
npx gh-pages -d dist

## Stack
Vite + React + Tailwind + pdf-lib + pdfjs-dist + tesseract.js + heic2any + qrcode + jszip

Add new tool: create file in src/tools/implementations and register in src/tools/registry.tsx + add to src/data/tools.json with implemented:true
