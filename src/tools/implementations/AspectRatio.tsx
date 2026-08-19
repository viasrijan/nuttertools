import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result } from '../../components/ui/Result'

export default function AspectRatio() {
  const [w, setW] = useState('16')
  const [h, setH] = useState('9')
  const [target, setTarget] = useState('1280')

  const a = parseFloat(w) || 16
  const b = parseFloat(h) || 9
  const t = parseFloat(target) || 1
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y))
  const g = gcd(Math.round(a), Math.round(b))
  const simple = `${Math.round(a / g)}:${Math.round(b / g)}`
  const ratio = a / b
  const widthForHeight = t * ratio

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Width units" value={w} onChange={(e) => setW(e.target.value)} />
        <Field label="Height units" value={h} onChange={(e) => setH(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Result label="Simplest ratio" value={simple} tone="good" />
        <Result label="Ratio (w/h)" value={ratio.toFixed(4)} />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Known width" value={target} onChange={(e) => setTarget(e.target.value)} hint="Compute missing height" />
        </div>
        <div className="grid gap-2">
          <Result label="Missing height" value={`${(t / ratio).toFixed(1)}`} />
          <Result label="Missing width (from that height)" value={`${widthForHeight.toFixed(1)}`} />
        </div>
      </div>
      <div className="aspect-[var(--ratio)] w-full max-w-md bg-gradient-to-br from-indigo-500 to-indigo-800 grid place-items-center" style={{ ['--ratio' as any]: `${a}/${b}` }}>
        <span className="text-white font-bold text-sm">{simple}</span>
      </div>
    </div>
  )
}