import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function InsulationCalculator() {
  const [len, setLen] = useState('30')
  const [wid, setWid] = useState('20')
  const [r, setR] = useState('13')

  const area = (parseFloat(len) || 0) * (parseFloat(wid) || 0)
  const rolls = Math.ceil(area / 60)
  const batts = Math.ceil(area / 40.4)
  const bags = Math.ceil(area / (1.09 * 12.5))

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Area length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Area width (ft)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label="Target R-value" type="number" value={r} onChange={(e) => setR(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Area" value={`${area.toFixed(1)} ft²`} tone="good" />
        <Result label="Fiberglass rolls (60 ft²)" value={rolls} />
        <Result label="Batts (40.4 ft²)" value={batts} />
        <Result label="Blown-in bags" value={bags} />
        <Result label="Suggested thickness" value={`${(parseFloat(r) || 13) >= 30 ? '11–12 in' : (parseFloat(r) || 13) >= 19 ? '6–7 in' : '3.5–4 in'}`} />
      </ResultGrid>
    </div>
  )
}