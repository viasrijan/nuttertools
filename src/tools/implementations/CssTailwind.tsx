import { useState } from 'react'

import { Button } from '../../components/ui/Button'

const HEX = { r: 255, g: 0, b: 0 }

function rgbToTailwind(css: string): string | null {
  let m = css.match(/#([0-9a-f]{6})/i)
  if (m) {
    const n = parseInt(m[1], 16)
    const { r, g, b } = { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
    return hexToClosest(r, g, b)
  }
  m = css.match(/rgb\((\d+)[,\s]+(\d+)[,\s]+(\d+)\)/)
  if (m) return hexToClosest(+m[1], +m[2], +m[3])
  return null
}

function hexToClosest(r: number, g: number, b: number): string {
  const hues: [number, number, number, string][] = [
    [248, 113, 113, 'red'], [251, 146, 60, 'orange'], [250, 204, 21, 'yellow'],
    [74, 222, 128, 'green'], [45, 212, 191, 'teal'], [34, 211, 238, 'cyan'],
    [96, 165, 250, 'blue'], [129, 140, 248, 'indigo'], [167, 139, 250, 'violet'],
    [192, 132, 252, 'purple'], [244, 114, 182, 'pink'], [132, 204, 22, 'lime'],
  ]
  const shades: [number, number, number, number][] = [
    [50, 100, 100, 100], [100, 100, 100, 200], [150, 100, 100, 300],
    [200, 100, 100, 400], [255, 100, 100, 500], [220, 100, 100, 600],
    [180, 100, 100, 700], [140, 100, 100, 800], [100, 100, 100, 900],
  ]
  let best: [string, number, number] | null = null
  for (const [hr, hg, hb, name] of hues) {
    for (const [sb, scale, sr, sh] of shades) {
      const dr = r - (hr * (1 - sb / 400) + sr * (sb / 400))
      const dg = g - (hg * (1 - sb / 400) + sr * (sb / 400))
      const db = b - (hb * (1 - sb / 400) + sr * (sb / 400))
      const d = dr * dr + dg * dg + db * db
      if (!best || d < best[2]) best = [name, sh, d]
    }
  }
  if (!best) return 'text-zinc-500'
  return `text-${best[0]}-${best[1]}`
}

function convertCss(css: string): string {
  const decls = css.split(';').map(s => s.trim()).filter(Boolean)
  const classes: string[] = []
  for (const d of decls) {
    const [prop, val] = d.split(':').map(s => s.trim())
    if (!prop || !val) continue
    const v = val.replace(/!important/g, '').trim()
    if (prop === 'margin-top' && v.endsWith('px')) classes.push(`mt-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'margin-bottom' && v.endsWith('px')) classes.push(`mb-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'margin-left' && v.endsWith('px')) classes.push(`ml-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'margin-right' && v.endsWith('px')) classes.push(`mr-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'padding-top' && v.endsWith('px')) classes.push(`pt-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'padding-bottom' && v.endsWith('px')) classes.push(`pb-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'padding-left' && v.endsWith('px')) classes.push(`pl-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'padding-right' && v.endsWith('px')) classes.push(`pr-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'color') { const c = rgbToTailwind(v); if (c) classes.push(c) }
    else if (prop === 'background-color') { const c = rgbToTailwind(v); if (c) classes.push(c.replace('text-', 'bg-')) }
    else if (prop === 'border-radius' && v === '50%') classes.push('')
    else if (prop === 'border-radius' && v.endsWith('px')) classes.push(`[${v}]`)
    else if (prop === 'font-weight' && v === 'bold') classes.push('font-bold')
    else if (prop === 'font-size' && v.endsWith('px')) {
      const s = parseFloat(v)
      if (s <= 12) classes.push('text-xs'); else if (s <= 14) classes.push('text-sm'); else if (s <= 16) classes.push('text-base'); else if (s <= 18) classes.push('text-lg'); else if (s <= 20) classes.push('text-xl'); else classes.push(`text-[${v}]`)
    }
    else if (prop === 'text-align' && v === 'center') classes.push('text-center')
    else if (prop === 'text-align' && v === 'right') classes.push('text-right')
    else if (prop === 'display' && v === 'flex') classes.push('flex')
    else if (prop === 'justify-content' && v === 'center') classes.push('justify-center')
    else if (prop === 'align-items' && v === 'center') classes.push('items-center')
    else if (prop === 'gap' && v.endsWith('px')) classes.push(`gap-${Math.round(parseFloat(v) / 4)}`)
    else if (prop === 'position' && v === 'absolute') classes.push('absolute')
    else if (prop === 'position' && v === 'relative') classes.push('relative')
    else if (prop === 'width' && v === '100%') classes.push('w-full')
    else if (prop === 'height' && v === '100%') classes.push('h-full')
    else if (prop === 'overflow' && v === 'hidden') classes.push('overflow-hidden')
    else classes.push(`[${prop}:${val}]`)
  }
  return classes.join(' ')
}

export default function CssTailwind() {
  const [css, setCss] = useState('color: #4F46E5;\nfont-size: 16px;\nfont-weight: bold;\nborder-radius: 8px;')
  return (
    <div className="space-y-5">
      <p className="text-xs font-medium text-zinc-500">Convert common CSS declarations to Tailwind utility classes. Unknown values are emitted as arbitrary properties.</p>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-semibold mb-1">CSS</p>
          <textarea value={css} onChange={e => setCss(e.target.value)} className="w-full h-64 border p-3 font-mono text-xs" />
        </div>
        <div>
          <p className="text-sm font-semibold mb-1">Tailwind classes</p>
          <div className="w-full h-64 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800 overflow-auto whitespace-pre-wrap">{convertCss(css)}</div>
          <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(convertCss(css))} className="mt-2">Copy classes</Button>
        </div>
      </div>
      <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-5 transition-all duration-200 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Preview</p>
        <div className={convertCss(css) + ' bg-zinc-50 dark:bg-zinc-800 p-4 border'}>Styled with generated classes</div>
      </div>
    </div>
  )
}
