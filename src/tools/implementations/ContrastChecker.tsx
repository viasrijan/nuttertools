import { useState } from 'react'

function hexToRgb(hex: string) {
  const n = hex.replace('#', '')
  return { r: parseInt(n.slice(0, 2), 16), g: parseInt(n.slice(2, 4), 16), b: parseInt(n.slice(4, 6), 16) }
}
function relLum({ r, g, b }: { r: number, g: number, b: number }) {
  const f = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
function contrast(a: string, b: string) {
  const l1 = relLum(hexToRgb(a)), l2 = relLum(hexToRgb(b))
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

export default function ContrastChecker() {
  const [fg, setFg] = useState('#111827')
  const [bg, setBg] = useState('#FFFFFF')
  const ratio = contrast(fg, bg)

  const passAA = ratio >= 4.5
  const passAALarge = ratio >= 3
  const passAAA = ratio >= 7

  const score = (r: number) => {
    if (r >= 7) return 'bg-emerald-500 text-white'
    if (r >= 4.5) return 'bg-emerald-500 text-white'
    if (r >= 3) return 'bg-amber-500 text-white'
    return 'bg-red-500 text-white'
  }

  return (
    <div className="space-y-5 max-w-2xl omni-rise">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">Foreground
          <div className="flex items-center gap-2 mt-1"><input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-12 h-10 border" /><input value={fg} onChange={e => setFg(e.target.value)} className="border px-3 h-10 flex-1 font-mono text-sm" /></div>
        </label>
        <label className="text-sm font-semibold">Background
          <div className="flex items-center gap-2 mt-1"><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-12 h-10 border" /><input value={bg} onChange={e => setBg(e.target.value)} className="border px-3 h-10 flex-1 font-mono text-sm" /></div>
        </label>
      </div>
      <div className="border p-6 text-center" style={{ background: bg, color: fg }}>
        <p className="text-2xl font-bold">Contrast ratio {ratio.toFixed(2)}:1</p>
        <p className="mt-2">Sample text — The quick brown fox</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 text-center">
        <div className={`border p-3 ${ratio >= 4.5 ? 'ring-2 ring-emerald-500' : ''}`}><div className="text-xl font-bold">{ratio >= 4.5 ? '✓' : '✗'}</div><p className="text-xs font-semibold">AA Normal text</p><p className="text-[11px] text-zinc-500">needs 4.5:1</p></div>
        <div className={`border p-3 ${ratio >= 3 ? 'ring-2 ring-emerald-500' : ''}`}><div className="text-xl font-bold">{ratio >= 3 ? '✓' : '✗'}</div><p className="text-xs font-semibold">AA Large text</p><p className="text-[11px] text-zinc-500">needs 3:1</p></div>
        <div className={`border p-3 ${ratio >= 7 ? 'ring-2 ring-emerald-500' : ''}`}><div className="text-xl font-bold">{ratio >= 7 ? '✓' : '✗'}</div><p className="text-xs font-semibold">AAA</p><p className="text-[11px] text-zinc-500">needs 7:1</p></div>
      </div>
      <p className={`text-center text-sm font-bold p-3 ${score(ratio)}`}>
        {ratio >= 7 ? 'AAA — excellent accessibility' : ratio >= 4.5 ? 'AA — accessible for normal text' : ratio >= 3 ? 'AA — only for large text' : 'Fail — poor contrast'}
      </p>
    </div>
  )
}
