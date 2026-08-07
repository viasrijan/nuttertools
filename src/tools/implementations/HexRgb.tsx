import { useState } from 'react'

function hexToRgb(hex: string) { const n = parseInt(hex.slice(1), 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 } }
function rgbToHex(r: number, g: number, b: number) { return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1) }
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0))
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export default function HexRgb() {
  const [hex, setHex] = useState('#4F46E5')
  const parsed = /^#[0-9a-fA-F]{6}$/.test(hex) ? hexToRgb(hex) : null
  const hsl = parsed ? rgbToHsl(parsed.r, parsed.g, parsed.b) : null

  return (
    <div className="space-y-4 max-w-xl">
      <label className="text-sm font-semibold">Hex color</label>
      <div className="flex gap-2">
        <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#000000'} onChange={e => setHex(e.target.value)} className="w-12 h-10 border" />
        <input value={hex} onChange={e => setHex(e.target.value)} className="border px-3 h-10 flex-1 font-mono text-sm" placeholder="#RRGGBB" />
      </div>
      <div className="h-24 rounded-lg border" style={{ background: /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#fff' }} />
      {parsed && hsl ? (
        <div className="space-y-2">
          <Row label="RGB" value={`rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`} />
          <Row label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          <Row label="Hex" value={hex.toLowerCase()} />
        </div>
      ) : <p className="text-xs text-red-500">Enter a valid 6-digit hex like #4F46E5</p>}
    </div>
  )
}

function Row({ label, value }: { label: string, value: string }) {
  return (
    <div className="border p-3 flex items-center gap-3">
      <span className="w-12 text-sm font-bold">{label}</span>
      <code className="flex-1 font-mono text-sm">{value}</code>
      <button onClick={() => navigator.clipboard.writeText(value)} className="text-xs border px-2 py-1">Copy</button>
    </div>
  )
}
