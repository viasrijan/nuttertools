import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function RoofingShingle() {
  const [sqft, setSqft] = useState('1500')
  const [pitch, setPitch] = useState('6')
  const [waste, setWaste] = useState('10')

  const s = parseFloat(sqft) || 0
  const p = parseFloat(pitch) || 0
  const factor = Math.sqrt(1 + Math.pow(p / 12, 2))
  const actual = s * factor
  const squares = Math.ceil((actual * (1 + (parseFloat(waste) || 10) / 100)) / 100)
  const bundles = squares * 3
  const underlayment = Math.ceil(actual / 225)
  const nails = bundles * 320
  const caps = Math.ceil((2 * Math.sqrt(actual)) / 35)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Footprint area (ft²)" type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} />
        <Field label="Roof pitch (in/12)" type="number" value={pitch} onChange={(e) => setPitch(e.target.value)} />
        <Field label="Waste %" type="number" value={waste} onChange={(e) => setWaste(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Slope-adjusted area" value={`${actual.toFixed(0)} ft²`} />
        <Result label="Roofing squares" value={squares} tone="good" />
        <Result label="Shingle bundles (3/sq)" value={bundles} />
        <Result label="Underlayment rolls (225 ft²)" value={underlayment} />
        <Result label="Nails" value={nails.toLocaleString()} />
        <Result label="Ridge cap bundles" value={caps} />
      </ResultGrid>
    </div>
  )
}