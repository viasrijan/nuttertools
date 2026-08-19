import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function TopsoilCalculator() {
  const [len, setLen] = useState('20')
  const [wid, setWid] = useState('10')
  const [depth, setDepth] = useState('4')

  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const D = (parseFloat(depth) || 0) / 12
  const cuFt = L * W * D
  const cuYd = cuFt / 27
  const tons = cuYd * 1.1
  const bags = Math.ceil(cuFt / 1.5)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Width (ft)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label="Depth (in)" type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Volume" value={`${cuYd.toFixed(2)} yd³ / ${cuFt.toFixed(1)} ft³`} tone="good" />
        <Result label="Weight" value={`≈ ${tons.toFixed(1)} tons`} />
        <Result label="1.5 ft³ bags" value={bags} />
        <Result label="40 lb bags" value={Math.ceil(cuYd * 55)} />
      </ResultGrid>
    </div>
  )
}