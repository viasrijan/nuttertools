import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function SolarPanel() {
  const [watts, setWatts] = useState('400')
  const [count, setCount] = useState('6')
  const [sun, setSun] = useState('5')
  const [loss, setLoss] = useState('15')

  const W = parseFloat(watts) || 0
  const N = parseInt(count) || 0
  const S = parseFloat(sun) || 0
  const daily = W * N * S * (1 - (parseFloat(loss) || 15) / 100)
  const monthly = daily * 30
  const yearly = daily * 365
  const panels = Math.max(1, Math.ceil(30 / daily * 1000))

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Panel watts" type="number" value={watts} onChange={(e) => setWatts(e.target.value)} />
        <Field label="Panel count" type="number" value={count} onChange={(e) => setCount(e.target.value)} />
        <Field label="Peak sun hours" type="number" value={sun} onChange={(e) => setSun(e.target.value)} />
        <Field label="System loss %" type="number" value={loss} onChange={(e) => setLoss(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Daily output" value={`${daily.toFixed(1)} kWh`} tone="good" />
        <Result label="Monthly output" value={`${monthly.toFixed(0)} kWh`} />
        <Result label="Yearly output" value={`${yearly.toFixed(0)} kWh`} />
        <Result label="Panels for 1,000 kWh/mo" value={panels} />
        <Result label="System size" value={`${(W * N / 1000).toFixed(2)} kW`} />
      </ResultGrid>
    </div>
  )
}