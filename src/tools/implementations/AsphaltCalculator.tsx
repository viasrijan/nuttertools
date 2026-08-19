import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function AsphaltCalculator() {
  const [len, setLen] = useState('100')
  const [wid, setWid] = useState('10')
  const [depth, setDepth] = useState('3')

  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const D = (parseFloat(depth) || 0) / 12
  const volYd = (L * W * D) / 27
  const tons = volYd * 2.025
  const loads = Math.ceil(tons / 15)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Width (ft)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label="Depth (in)" type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Volume" value={`${volYd.toFixed(2)} yd³`} />
        <Result label="Asphalt weight" value={`${tons.toFixed(1)} tons`} tone="good" />
        <Result label="Truckloads (15 tons)" value={loads} />
        <Result label="Area" value={`${(L * W).toFixed(1)} ft²`} />
      </ResultGrid>
    </div>
  )
}