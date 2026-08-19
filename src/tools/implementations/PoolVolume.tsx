import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

export default function PoolVolume() {
  const [shape, setShape] = useState('rect')
  const [a, setA] = useState('20')
  const [b, setB] = useState('10')
  const [depth, setDepth] = useState('5')
  const [unit, setUnit] = useState('ft')

  const isM = unit === 'm'
  const A = parseFloat(a) || 0
  const B = parseFloat(b) || 0
  const D = parseFloat(depth) || 0

  const area = shape === 'rect' ? A * B : shape === 'round' ? Math.PI * Math.pow(A / 2, 2) : (A * B * Math.PI) / 4
  const m3 = area * D * (isM ? 1 : 0.3048 * 0.3048 * 0.3048)
  const gallons = m3 * 264.172
  const liters = m3 * 1000
  const hours = gallons / 1000
  const weight = m3 * 1000

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Select label="Shape" value={shape} onChange={setShape} options={[{ v: 'rect', label: 'Rectangle' }, { v: 'round', label: 'Round' }, { v: 'oval', label: 'Oval' }]} />
        <Field label={shape === 'round' ? 'Diameter' : 'Length'} type="number" value={a} onChange={(e) => setA(e.target.value)} />
        {shape !== 'round' && <Field label="Width" type="number" value={b} onChange={(e) => setB(e.target.value)} />}
        <Field label="Avg depth" type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
        <Select label="Units" value={unit} onChange={setUnit} options={[{ v: 'ft', label: 'Feet' }, { v: 'm', label: 'Meters' }]} />
      </div>
      <ResultGrid>
        <Result label="Volume" value={`${m3.toFixed(1)} m³`} />
        <Result label="Gallons" value={`${gallons.toFixed(0)} gal`} tone="good" />
        <Result label="Liters" value={`${liters.toLocaleString(undefined, { maximumFractionDigits: 0 })} L`} />
        <Result label="Water weight" value={`${(weight / 1000).toFixed(1)} tonnes`} />
        <Result label="Fill time (10 gpm)" value={`≈ ${hours.toFixed(1)} hours`} />
      </ResultGrid>
    </div>
  )
}