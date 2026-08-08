import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'public', 'icons')

const CAT_GRAD = {
  'Image Tools': ['#0ea5e9', '#6366f1'],
  'PDF Tools': ['#f43f5e', '#f97316'],
  'Developer Tools': ['#6366f1', '#a855f7'],
  'Encoding & Security': ['#10b981', '#0ea5e9'],
  'Text & Writing': ['#f59e0b', '#f43f5e'],
  'Color & Design': ['#d946ef', '#f43f5e'],
  'Video Tools': ['#a855f7', '#6366f1'],
  'Audio Tools': ['#06b6d4', '#0ea5e9'],
  'File Tools': ['#84cc16', '#10b981'],
  'Web & SEO': ['#14b8a6', '#0ea5e9'],
  'Everyday Utilities': ['#f97316', '#ef4444'],
  'AI Tools': ['#8b5cf6', '#ec4899'],
}

const SLUG_GRAD = {
  'image-tools': CAT_GRAD['Image Tools'],
  'pdf-tools': CAT_GRAD['PDF Tools'],
  'developer-tools': CAT_GRAD['Developer Tools'],
  'encoding-security': CAT_GRAD['Encoding & Security'],
  'text-writing': CAT_GRAD['Text & Writing'],
  'color-design': CAT_GRAD['Color & Design'],
  'video-tools': CAT_GRAD['Video Tools'],
  'audio-tools': CAT_GRAD['Audio Tools'],
  'file-tools': CAT_GRAD['File Tools'],
  'web-seo': CAT_GRAD['Web & SEO'],
  'everyday-utilities': CAT_GRAD['Everyday Utilities'],
  'ai-tools': CAT_GRAD['AI Tools'],
}

function parseBlock(src, name) {
  const start = src.indexOf(`const ${name}`)
  const brace = src.indexOf('{', start)
  const end = src.indexOf('\n}', brace)
  const block = src.slice(brace, end)
  const map = {}
  for (const m of block.matchAll(/'([^']+)': ([A-Za-z0-9]+)/g)) map[m[1]] = m[2]
  return map
}

const ICONS_DIR = path.join(ROOT, 'node_modules', 'lucide-react', 'dist', 'esm', 'icons')

const INDEX_SRC = fs.readFileSync(
  path.join(ROOT, 'node_modules', 'lucide-react', 'dist', 'esm', 'lucide-react.mjs'),
  'utf8',
)
const EXPORT_FILE = {}
for (const m of INDEX_SRC.matchAll(/export \{([^}]*)\} from '\.\/icons\/([a-z0-9-]+)\.mjs';/g)) {
  for (const alias of m[1].split(',')) {
    const am = alias.match(/default as ([A-Za-z0-9]+)/)
    if (am) EXPORT_FILE[am[1]] = m[2]
  }
}

async function loadIcon(name) {
  const file = EXPORT_FILE[name]
  if (!file) return { file: null, nodes: null }
  const mod = await import(pathToFileURL(path.join(ICONS_DIR, `${file}.mjs`)).href)
  return { file, nodes: mod.__iconNode }
}

function attrs(o) {
  return Object.entries(o)
    .filter(([k]) => k !== 'key')
    .map(([k, v]) => `${k.replace(/([a-z])([A-Z])/g, '$1-$2')}="${v}"`)
    .join(' ')
}

function nodesToSvg(nodes) {
  return nodes.map(([tag, o]) => `<${tag} ${attrs(o)} />`).join('')
}

function svgFor(nodes, stroke) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
  ${nodesToSvg(nodes)}
</svg>`
}

async function renderPng(nodes, out, [c1, c2]) {
  const mk = (gradient) => `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="url(#g)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="g"${gradient}>
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  ${nodesToSvg(nodes)}
</svg>`
  let buf = await sharp(Buffer.from(mk(' x1="0" y1="0" x2="1" y2="1"'))).png().toBuffer()
  const stats = await sharp(buf).ensureAlpha().stats()
  const blank = stats.channels.every((c) => c.max === 0)
  if (blank) {
    console.log(`  blank render (straight-line librsvg bug), retrying with userSpaceOnUse: ${path.basename(out)}`)
    buf = await sharp(Buffer.from(mk(' x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"'))).png().toBuffer()
  }
  fs.writeFileSync(out, buf)
}

async function renderWhite(nodes, out) {
  await sharp(Buffer.from(svgFor(nodes, '#ffffff'))).png().toFile(out)
}

fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(path.join(OUT, 'white'), { recursive: true })
const iconSrc = fs.readFileSync(path.join(ROOT, 'src', 'components', 'Icon.tsx'), 'utf8')
const TOOL = parseBlock(iconSrc, 'TOOL_ICONS')
const CAT = parseBlock(iconSrc, 'CAT_ICONS')
const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'tools.json'), 'utf8'))

const cache = {}
async function iconFor(name) {
  if (!(name in cache)) cache[name] = await loadIcon(name)
  return cache[name]
}

let ok = 0
const missing = []
for (const t of tools) {
  const comp = TOOL[t.id]
  const { file, nodes } = await iconFor(comp)
  if (!nodes) { missing.push(`${t.id} (${comp})`); continue }
  await renderPng(nodes, path.join(OUT, `${t.id}.png`), CAT_GRAD[t.category] || ['#6366f1', '#a855f7'])
  await renderWhite(nodes, path.join(OUT, 'white', `${t.id}.png`))
  ok++
}

for (const slug of Object.keys(CAT)) {
  const comp = CAT[slug]
  const { file, nodes } = await iconFor(comp)
  if (!nodes) { missing.push(`cat-${slug} (${comp})`); continue }
  await renderPng(nodes, path.join(OUT, `cat-${slug}.png`), SLUG_GRAD[slug] || ['#6366f1', '#a855f7'])
  await renderWhite(nodes, path.join(OUT, 'white', `cat-${slug}.png`))
  ok++
}

console.log(`generated ${ok * 2} pngs -> public/icons (+ white variants)`)
if (missing.length) console.log('MISSING:', missing.join(', '))
