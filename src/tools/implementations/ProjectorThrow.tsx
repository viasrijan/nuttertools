import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function ProjectorThrow() {
  const [ratio, setRatio] = useState('1.5')
  const [width, setWidth] = useState('100')
  const [screenH, setScreenH] = useState('56')

  const t = parseFloat(ratio) || 1
  const W = parseFloat(width) || 0
  const H = parseFloat(screenH) || 0

  const dist = t * W
  const minDist = (t - 0.3) * W
  const maxDist = (t + 0.3) * W
  const idealDist = H * t * 1.78

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Throw ratio" type="number" value={ratio} onChange={(e) => setRatio(e.target.value)} hint="Common: 1.0–1.5 (short), 2.0+ (long)" />
        <Field label="Screen width (in)" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
        <Field label="Screen height (in)" type="number" value={screenH} onChange={(e) => setScreenH(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Projector distance" value={`${dist.toFixed(1)} in (${(dist / 12).toFixed(1)} ft)`} tone="good" />
        <Result label="Zoom range (≈±0.3)" value={`${minDist.toFixed(0)} – ${maxDist.toFixed(0)} in`} />
        <Result label="Ideal distance for 16:9" value={`${idealDist.toFixed(1)} in`} />
      </ResultGrid>
    </div>
  )
}