import { useState } from 'react'

const PRESETS: [string, string, string][] = [
  ['Ocean', '#06b6d4', '#6366f1'],
  ['Sunset', '#f97316', '#ec4899'],
  ['Forest', '#22c55e', '#0ea5e9'],
  ['Lavender', '#a855f7', '#ec4899'],
  ['Fire', '#ef4444', '#f59e0b'],
  ['Mint', '#10b981', '#a3e635'],
]

export default function GradientGenerator() {
  const [from, setFrom] = useState('#06b6d4')
  const [to, setTo] = useState('#6366f1')
  const [angle, setAngle] = useState(135)

  const css = `background: linear-gradient(${angle}deg, ${from}, ${to});`

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">From
          <div className="flex items-center gap-2 mt-1"><input type="color" value={from} onChange={e => setFrom(e.target.value)} className="w-12 h-10 border" /><input value={from} onChange={e => setFrom(e.target.value)} className="border px-3 h-10 flex-1 font-mono text-sm" /></div>
        </label>
        <label className="text-sm font-semibold">To
          <div className="flex items-center gap-2 mt-1"><input type="color" value={to} onChange={e => setTo(e.target.value)} className="w-12 h-10 border" /><input value={to} onChange={e => setTo(e.target.value)} className="border px-3 h-10 flex-1 font-mono text-sm" /></div>
        </label>
      </div>
      <label className="block text-sm font-semibold">Angle: {angle}°<input type="range" min={0} max={360} value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full mt-2" /></label>
      <div className="h-40 rounded-lg border" style={{ background: `linear-gradient(${angle}deg, ${from}, ${to})` }} />
      <code className="block border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800">{css}</code>
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(css)} className="px-4 h-9 bg-zinc-900 text-white text-sm">Copy CSS</button>
        <button onClick={() => { const p = PRESETS[Math.floor(Math.random() * PRESETS.length)]; setFrom(p[1]); setTo(p[2]) }} className="px-4 h-9 border text-sm">Random</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(([name, a, b]) => (
          <button key={name} onClick={() => { setFrom(a); setTo(b) }} className="px-3 h-8 border text-xs">{name}</button>
        ))}
      </div>
    </div>
  )
}
