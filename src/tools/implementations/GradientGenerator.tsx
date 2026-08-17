import { useState } from 'react'

import { Button } from '../../components/ui/Button'

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
    <div className="space-y-5 max-w-2xl omni-rise">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">From
          <div className="flex items-center gap-2 mt-1"><input type="color" value={from} onChange={e => setFrom(e.target.value)} className="w-12 h-10 border" /><input value={from} onChange={e => setFrom(e.target.value)} className="border px-3 h-10 flex-1 font-mono text-sm" /></div>
        </label>
        <label className="text-sm font-semibold">To
          <div className="flex items-center gap-2 mt-1"><input type="color" value={to} onChange={e => setTo(e.target.value)} className="w-12 h-10 border" /><input value={to} onChange={e => setTo(e.target.value)} className="border px-3 h-10 flex-1 font-mono text-sm" /></div>
        </label>
      </div>
      <label className="block text-sm font-semibold">Angle: {angle}°<input type="range" min={0} max={360} value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full mt-2" /></label>
      <div className="h-40  border" style={{ background: `linear-gradient(${angle}deg, ${from}, ${to})` }} />
      <code className="block border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800">{css}</code>
      <div className="flex gap-2.5">
        <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</Button>
        <Button variant="outline" size="sm" onClick={() => { const p = PRESETS[Math.floor(Math.random() * PRESETS.length)]; setFrom(p[1]); setTo(p[2]) }}>Random</Button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {PRESETS.map(([name, a, b]) => (
          <Button key={name} variant="outline" size="sm" className="px-3 h-8 text-xs" onClick={() => { setFrom(a); setTo(b) }}>{name}</Button>
        ))}
      </div>
    </div>
  )
}
