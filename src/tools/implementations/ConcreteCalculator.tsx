import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

const BAGS: [string, number][] = [['40 lb', 0.011], ['60 lb', 0.017], ['80 lb', 0.022]]

export default function ConcreteCalculator() {
  const [len, setLen] = useState('3')
  const [wid, setWid] = useState('3')
  const [thick, setThick] = useState('10')
  const [unit, setUnit] = useState('m')

  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const T = (parseFloat(thick) || 0) / (unit === 'm' ? 100 : 12)
  const vol = L * W * T
  const cubicYards = vol * (unit === 'm' ? 1.30795 : 1 / 27)
  const cubicFeet = vol * (unit === 'm' ? 35.3147 : 1)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label={unit === 'm' ? 'Length (m)' : 'Length (ft)'} type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label={unit === 'm' ? 'Width (m)' : 'Width (ft)'} type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label={unit === 'm' ? 'Depth (cm)' : 'Depth (in)'} type="number" value={thick} onChange={(e) => setThick(e.target.value)} />
        <div className="flex items-end">
          <button onClick={() => setUnit(unit === 'm' ? 'ft' : 'm')} className="w-full h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Switch to {unit === 'm' ? 'ft' : 'm'}</button>
        </div>
      </div>
      <ResultGrid>
        <Result label="Volume" value={`${vol.toFixed(2)} m³ / ${cubicFeet.toFixed(1)} ft³`} tone="good" />
        <Result label="Cubic yards" value={`${cubicYards.toFixed(2)} yd³`} />
        {BAGS.map(([name, y]) => (
          <Result key={name} label={`${name} bags needed`} value={Math.ceil(cubicYards / y)} />
        ))}
      </ResultGrid>
    </div>
  )
}