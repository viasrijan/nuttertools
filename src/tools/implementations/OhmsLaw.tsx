import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function OhmsLaw() {
  const [v, setV] = useState('12')
  const [i, setI] = useState('2')
  const [r, setR] = useState('')

  const V = parseFloat(v) || 0
  const I = parseFloat(i) || 0
  const R = parseFloat(r) || 0
  const any2 = [V, I, R].filter((x) => x > 0).length

  const calc = (): { V: number, I: number, R: number, P: number } => {
    if (V > 0 && I > 0) return { V, I, R: V / I, P: V * I }
    if (V > 0 && R > 0) return { V, I: V / R, R, P: (V * V) / R }
    if (I > 0 && R > 0) return { V: I * R, I, R, P: I * I * R }
    return { V, I, R, P: 0 }
  }

  const c = calc()

  return (
    <div className="space-y-6 max-w-xl">
      <p className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">Enter any <b>two</b> of voltage (V), current (I) and resistance (R) — the rest is calculated.</p>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Voltage (V)" type="number" value={v} onChange={(e) => setV(e.target.value)} />
        <Field label="Current (A)" type="number" value={i} onChange={(e) => setI(e.target.value)} />
        <Field label="Resistance (Ω)" type="number" value={r} onChange={(e) => setR(e.target.value)} />
      </div>
      {any2 >= 2 && (
        <ResultGrid>
          <Result label="Voltage" value={`${c.V.toFixed(2)} V`} tone="good" />
          <Result label="Current" value={`${c.I.toFixed(3)} A`} tone="good" />
          <Result label="Resistance" value={`${c.R.toFixed(2)} Ω`} tone="good" />
          <Result label="Power" value={`${c.P.toFixed(2)} W`} tone="good" />
        </ResultGrid>
      )}
    </div>
  )
}