import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

const NAMED: Record<string, string> = {
  black: '#000000', white: '#FFFFFF', red: '#FF0000', green: '#008000', blue: '#0000FF',
  yellow: '#FFFF00', orange: '#FFA500', purple: '#800080', pink: '#FFC0CB', gray: '#808080',
  grey: '#808080', silver: '#C0C0C0', maroon: '#800000', olive: '#808000', lime: '#00FF00',
  teal: '#008080', navy: '#000080', cyan: '#00FFFF', magenta: '#FF00FF', brown: '#A52A2A',
  gold: '#FFD700', coral: '#FF7F50', crimson: '#DC143C', tomato: '#FF6347', salmon: '#FA8072',
  indigo: '#4B0082', violet: '#EE82EE', orchid: '#DA70D6', turquoise: '#40E0D0', beige: '#F5F5DC',
  khaki: '#F0E68C', ivory: '#FFFFF0', lavender: '#E6E6FA', mint: '#98FB98', skyblue: '#87CEEB',
  slateblue: '#6A5ACD', steelblue: '#4682B4', darkred: '#8B0000', darkgreen: '#006400',
  darkblue: '#00008B', darkorange: '#FF8C00', darkmagenta: '#8B008B', darkcyan: '#008B8B',
  lightblue: '#ADD8E6', lightgreen: '#90EE90', lightyellow: '#FFFFE0', lightgray: '#D3D3D3',
}

function parse(input: string): { r: number, g: number, b: number } | null {
  let s = input.trim().toLowerCase()
  if (s in NAMED) s = NAMED[s]
  let m = s.match(/^#([0-9a-f]{3})$/i)
  if (m) { const c = m[1]; return { r: parseInt(c[0] + c[0], 16), g: parseInt(c[1] + c[1], 16), b: parseInt(c[2] + c[2], 16) } }
  m = s.match(/^#([0-9a-f]{6})$/i)
  if (m) { const n = parseInt(m[1], 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 } }
  m = s.match(/^rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (m) return { r: +m[1], g: +m[2], b: +m[3] }
  m = s.match(/^hsla?\((\d+)[,\s]+(\d+)%?[,\s]+(\d+)%?/)
  if (m) { const [h, ss, l] = [+m[1], +m[2] / 100, +m[3] / 100]; return hslToRgb(h, ss, l) }
  return null
}
function hslToRgb(h: number, s: number, l: number) {
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))))
  }
  return { r: f(0), g: f(8), b: f(4) }
}
function toHex(c: { r: number, g: number, b: number }) { return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('') }
function toHsl(c: { r: number, g: number, b: number }) {
  let r = c.r / 255, g = c.g / 255, b = c.b / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

export default function CssColorConverter() {
  const [input, setInput] = useState('#4F46E5')
  const parsed = parse(input)
  const hex = parsed ? toHex(parsed) : null
  const hsl = parsed ? toHsl(parsed) : null
  const name = hex ? Object.entries(NAMED).find(([n, v]) => v.toLowerCase() === hex.toLowerCase())?.[0] : null

  const rows = parsed && hex && hsl ? [
    ['HEX', hex],
    ['RGB', `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`],
    ['HSL', hsl],
    ['Name', name || '— (not a named color)'],
  ] : []

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <input value={input} onChange={e => setInput(e.target.value)} className="w-full border px-3 h-10 font-mono text-sm" placeholder="#hex, rgb(), hsl() or a color name" />
      {!parsed && <p className="text-xs text-red-500">Could not parse that color</p>}
      {parsed && <div className="h-24  border" style={{ background: `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})` }} />}
      <div className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="border p-3 flex items-center gap-3">
            <span className="w-12 text-sm font-bold">{label}</span>
            <code className="flex-1 font-mono text-sm">{value}</code>
            <CopyButton value={value} />
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500">Try: <button onClick={() => setInput('tomato')} className="underline">tomato</button> · <button onClick={() => setInput('#0ea5e9')} className="underline">#0ea5e9</button> · <button onClick={() => setInput('rgb(244, 63, 94)')} className="underline">rgb(244, 63, 94)</button> · <button onClick={() => setInput('hsl(210, 100%, 50%)')} className="underline">hsl(210, 100%, 50%)</button></p>
    </div>
  )
}
