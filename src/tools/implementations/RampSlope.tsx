import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function RampSlope() {
  const [rise, setRise] = useState('12')
  const [unit, setUnit] = useState('in')

  const isIn = unit === 'in'
  const R = (parseFloat(rise) || 0) * (isIn ? 1 : 1 / 2.54)
  const ratio12 = R > 0 ? 12 * (60 / R) : 0
  const angle = (Math.atan2(R, ratio12 * 4) * 180) / Math.PI
  const run = (ratio12 / 12) * R * (isIn ? 12 : 2.54)
  const landings = Math.ceil(R / (isIn ? 30 : 76.2))

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label={isIn ? 'Total rise (in)' : 'Total rise (cm)'} type="number" value={rise} onChange={(e) => setRise(e.target.value)} />
        <div className="flex items-end">
          <button onClick={() => setUnit(unit === 'in' ? 'cm' : 'in')} className="w-full h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Switch units</button>
        </div>
      </div>
      <ResultGrid>
        <Result label="Recommended slope (ADA)" value={`1:${Math.max(1, ratio12).toFixed(1)}`} tone="good" />
        <Result label="Max slope (cars)" value={`1:${Math.max(1, ratio12 * 1.25).toFixed(1)}`} />
        <Result label="Angle" value={`${angle.toFixed(1)}°`} />
        <Result label="Required run" value={`${run.toFixed(1)} ${isIn ? 'in' : 'cm'}`} tone="good" />
        <Result label="Landing platforms" value={landings} />
      </ResultGrid>
    </div>
  )
}