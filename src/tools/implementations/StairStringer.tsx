import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function StairStringer() {
  const [rise, setRise] = useState('105')
  const [run, setRun] = useState('280')
  const [tread, setTread] = useState('25')
  const [unit, setUnit] = useState('in')

  const isIn = unit === 'in'
  const R = (parseFloat(rise) || 0) * (isIn ? 1 : 1 / 2.54)
  const RUN = (parseFloat(run) || 0) * (isIn ? 1 : 1 / 2.54)
  const T = (parseFloat(tread) || 0) * (isIn ? 1 : 1 / 2.54)

  const ideal = 7
  let risers = Math.round(R / ideal)
  if (risers < 1) risers = 1
  const actualRise = R / risers
  const treads = risers - 1
  const totalRun = treads * T
  const stringerLen = Math.sqrt(Math.pow(actualRise * risers, 2) + Math.pow(totalRun, 2))
  const angle = (Math.atan2(actualRise * risers, totalRun) * 180) / Math.PI

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label={isIn ? 'Total rise (in)' : 'Total rise (cm)'} type="number" value={rise} onChange={(e) => setRise(e.target.value)} />
        <Field label={isIn ? 'Total run (in)' : 'Total run (cm)'} type="number" value={run} onChange={(e) => setRun(e.target.value)} />
        <Field label={isIn ? 'Tread depth (in)' : 'Tread depth (cm)'} type="number" value={tread} onChange={(e) => setTread(e.target.value)} />
        <div className="flex items-end">
          <button onClick={() => setUnit(unit === 'in' ? 'cm' : 'in')} className="w-full h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Switch units</button>
        </div>
      </div>
      <ResultGrid>
        <Result label="Risers" value={risers} tone="good" />
        <Result label="Actual rise per step" value={`${actualRise.toFixed(2)} ${isIn ? 'in' : 'cm'}`} />
        <Result label="Treads" value={treads} />
        <Result label="Total run" value={`${totalRun.toFixed(1)} ${isIn ? 'in' : 'cm'}`} />
        <Result label="Stringer length" value={`${(stringerLen / (isIn ? 12 : 100)).toFixed(2)} ${isIn ? 'ft' : 'm'}`} tone="good" />
        <Result label="Stair angle" value={`${angle.toFixed(1)}°`} />
      </ResultGrid>
    </div>
  )
}