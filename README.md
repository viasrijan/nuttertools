# OmniTools — Every Useful Tool, All in One Place

A collection of 86 useful tools — images, PDFs, code, media, text and everyday utilities — organized into sections.

## Live
https://viasrijan.github.io/omnitools/

## Features
- 15 fully working tools (image, pdf, dev), 71 more on the way
- Tools organized into sections with dropdown navigation
- Search, dark mode, PWA

## Quick Start
npm install
npm run dev

## Build for GitHub Pages
npm run build
npx gh-pages -d dist

## Stack
Vite + React + Tailwind + pdf-lib + pdfjs-dist + tesseract.js + heic2any + qrcode + jszip

Add new tool: create file in src/tools/implementations and register in src/tools/registry.tsx + add to src/data/tools.json with implemented:true
