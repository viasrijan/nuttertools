import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function PipeVolume() {
  const [len, setLen] = useState('100')
  const [dia, setDia] = useState('2')
  const [unit, setUnit] = useState('in')

  const isIn = unit === 'in'
  const L = (parseFloat(len) || 0) * (isIn ? 1 : 1 / 12)
  const D = (parseFloat(dia) || 0) * (isIn ? 1 : 1 / 12)
  const r = D / 2
  const volFt3 = Math.PI * r * r * L
  const gallons = volFt3 * 7.48052
  const liters = gallons * 3.78541
  const weight = gallons * 8.34

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label={isIn ? 'Length (ft)' : 'Length (in)'} type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label={isIn ? 'Inner diameter (in)' : 'Inner diameter (cm)'} type="number" value={dia} onChange={(e) => setDia(e.target.value)} />
        <div className="flex items-end">
          <button onClick={() => setUnit(unit === 'in' ? 'cm' : 'in')} className="w-full h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Switch units</button>
        </div>
      </div>
      <ResultGrid>
        <Result label="Internal volume" value={`${volFt3.toFixed(2)} ft³`} tone="good" />
        <Result label="Gallons (US)" value={`${gallons.toFixed(1)} gal`} tone="good" />
        <Result label="Liters" value={`${liters.toFixed(1)} L`} />
        <Result label="Water weight" value={`${weight.toFixed(1)} lb`} />
      </ResultGrid>
    </div>
  )
}