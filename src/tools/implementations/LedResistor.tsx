import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function LedResistor() {
  const [v, setV] = useState('5')
  const [ledV, setLedV] = useState('2.0')
  const [current, setCurrent] = useState('20')
  const [count, setCount] = useState('1')

  const V = parseFloat(v) || 0
  const LV = parseFloat(ledV) || 0
  const mA = parseFloat(current) || 20
  const N = parseInt(count) || 1

  const seriesV = LV * N
  const r = (V - seriesV) / (mA / 1000)
  const p = ((V - seriesV) / (mA / 1000)) * (mA / 1000)
  const nearest = nearestStd(r)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Supply voltage (V)" type="number" value={v} onChange={(e) => setV(e.target.value)} />
        <Field label="LED forward V" type="number" value={ledV} onChange={(e) => setLedV(e.target.value)} />
        <Field label="LED current (mA)" type="number" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <Field label="LEDs in series" type="number" value={count} onChange={(e) => setCount(e.target.value)} />
      </div>
      {r > 0 ? (
        <ResultGrid>
          <Result label="Resistor value" value={`${r.toFixed(1)} Ω`} tone="good" />
          <Result label="Nearest E12 value" value={`${nearest} Ω`} tone="good" />
          <Result label="Resistor power" value={`${(p * 2).toFixed(2)} W (2× safety)`} tone={p > 0.5 ? 'warn' : 'default'} />
        </ResultGrid>
      ) : (
        <p className="text-sm font-semibold text-rose-600">Supply voltage must exceed the total LED forward voltage — add more LEDs or raise the supply.</p>
      )}
    </div>
  )
}

function nearestStd(r: number): number {
  const e12 = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2]
  const scale = Math.pow(10, Math.floor(Math.log10(r)))
  let best = e12[0] * scale
  for (const v of e12) {
    const cand = v * scale
    if (Math.abs(cand - r) < Math.abs(best - r)) best = cand
  }
  return Math.round(best * 10) / 10
}