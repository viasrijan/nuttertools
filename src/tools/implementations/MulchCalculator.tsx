import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function MulchCalculator() {
  const [len, setLen] = useState('20')
  const [wid, setWid] = useState('10')
  const [depth, setDepth] = useState('3')

  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const D = (parseFloat(depth) || 0) / 12
  const cuFt = L * W * D
  const cuYd = cuFt / 27
  const bags2 = Math.ceil(cuFt / 2)
  const bags3 = Math.ceil(cuFt / 3)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Width (ft)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label="Depth (in)" type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Volume" value={`${cuFt.toFixed(1)} ft³ / ${cuYd.toFixed(2)} yd³`} tone="good" />
        <Result label="2 ft³ bags" value={bags2} />
        <Result label="3 ft³ bags" value={bags3} />
        <Result label="Coverage per bag" value={`${(2 / cuFt * 1).toFixed(1)}% of area`} />
      </ResultGrid>
    </div>
  )
}