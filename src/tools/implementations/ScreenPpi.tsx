import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function ScreenPpi() {
  const [w, setW] = useState('2560')
  const [h, setH] = useState('1440')
  const [d, setD] = useState('27')

  const W = parseFloat(w) || 0
  const H = parseFloat(h) || 0
  const D = parseFloat(d) || 1

  const ppi = Math.sqrt(W * W + H * H) / D
  const pitch = 25.4 / ppi
  const aspect = W / H

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Pixel width" type="number" value={w} onChange={(e) => setW(e.target.value)} />
        <Field label="Pixel height" type="number" value={h} onChange={(e) => setH(e.target.value)} />
        <Field label="Diagonal size (in)" type="number" value={d} onChange={(e) => setD(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Pixel density" value={`${ppi.toFixed(1)} PPI`} tone="good" />
        <Result label="Pixel pitch" value={`${pitch.toFixed(3)} mm`} />
        <Result label="Aspect ratio" value={`${aspect.toFixed(2)}:1`} />
        <Result label="Total pixels" value={`${(W * H).toLocaleString()}`} />
      </ResultGrid>
    </div>
  )
}