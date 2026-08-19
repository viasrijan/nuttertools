import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function GravelCalculator() {
  const [len, setLen] = useState('10')
  const [wid, setWid] = useState('4')
  const [depth, setDepth] = useState('4')
  const [density, setDensity] = useState('2800')

  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const D = (parseFloat(depth) || 0) / 12
  const volYd = (L * W * D) / 27
  const tons = (volYd * (parseFloat(density) || 2800)) / 2000

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Width (ft)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label="Depth (in)" type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
        <Field label="Density (lb/yd³)" type="number" value={density} onChange={(e) => setDensity(e.target.value)} hint="Gravel ≈ 2800, sand ≈ 2600" />
      </div>
      <ResultGrid>
        <Result label="Volume" value={`${volYd.toFixed(2)} cubic yards / ${(volYd * 0.7646).toFixed(1)} m³`} tone="good" />
        <Result label="Weight" value={`${tons.toFixed(1)} tons`} tone="good" />
        <Result label="Weight (kg)" value={`${(tons * 907.2).toFixed(0)} kg`} />
        <Result label="Truckloads (10 yd³)" value={Math.ceil(volYd / 10)} />
      </ResultGrid>
    </div>
  )
}