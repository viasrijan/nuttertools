import { useState } from 'react'

function hexToRgb(hex: string) { const n = parseInt(hex.slice(1), 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 } }
function rgbToHex({ r, g, b }: { r: number, g: number, b: number }) { return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('') }

export default function ColorShades() {
  const [base, setBase] = useState('#4F46E5')
  const [count, setCount] = useState(11)

  const rgb = hexToRgb(base)
  const tints = Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / (count + 1)
    return rgbToHex({ r: rgb.r + (255 - rgb.r) * t, g: rgb.g + (255 - rgb.g) * t, b: rgb.b + (255 - rgb.b) * t })
  })
  const shades = Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / (count + 1)
    return rgbToHex({ r: rgb.r * (1 - t), g: rgb.g * (1 - t), b: rgb.b * (1 - t) })
  })
  const tones = Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / (count + 1)
    const target = 128
    return rgbToHex({ r: rgb.r + (target - rgb.r) * t, g: rgb.g + (target - rgb.g) * t, b: rgb.b + (target - rgb.b) * t })
  })

  const row = (label: string, colors: string[]) => (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">{label}</p>
      <div className="flex overflow-hidden rounded-lg border">
        {colors.map((c, i) => (
          <div key={i} className="flex-1 h-14 relative group" style={{ background: c }}>
            <button onClick={() => navigator.clipboard.writeText(c)} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-[10px] font-mono text-white grid place-items-center">{c}</button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <input type="color" value={base} onChange={e => setBase(e.target.value)} className="w-14 h-12 border" />
        <input value={base} onChange={e => setBase(e.target.value)} className="border px-3 h-10 font-mono text-sm flex-1" />
        <label className="text-sm">Shades ({count})
          <input type="range" min={5} max={20} value={count} onChange={e => setCount(parseInt(e.target.value))} className="w-32 ml-2" /></label>
      </div>
      {row('Tints (mix with white)', tints)}
      {row('Base', [base])}
      {row('Shades (mix with black)', shades)}
      {row('Tones (mix with gray)', tones)}
    </div>
  )
}
