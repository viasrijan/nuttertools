import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function BatteryRuntime() {
  const [v, setV] = useState('12')
  const [ah, setAh] = useState('100')
  const [load, setLoad] = useState('50')
  const [dod, setDod] = useState('50')

  const V = parseFloat(v) || 0
  const AH = parseFloat(ah) || 0
  const W = parseFloat(load) || 0
  const usable = AH * ((parseFloat(dod) || 50) / 100)
  const hours = W > 0 ? (usable * V) / W : 0

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Voltage (V)" type="number" value={v} onChange={(e) => setV(e.target.value)} />
        <Field label="Capacity (Ah)" type="number" value={ah} onChange={(e) => setAh(e.target.value)} />
        <Field label="Load (W)" type="number" value={load} onChange={(e) => setLoad(e.target.value)} />
        <Field label="DoD %" type="number" value={dod} onChange={(e) => setDod(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Usable energy" value={`${(usable * V).toFixed(0)} Wh`} />
        <Result label="Runtime" value={`${hours.toFixed(1)} hours`} tone="good" />
        <Result label="Total energy" value={`${(AH * V).toFixed(0)} Wh / ${(AH * V / 1000).toFixed(2)} kWh`} />
      </ResultGrid>
    </div>
  )
}