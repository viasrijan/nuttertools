import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const METALS = [
  { v: 'copper', label: 'Copper', k: 12.9, coeff: 3.93e-3 },
  { v: 'aluminum', label: 'Aluminum', k: 21.2, coeff: 4.03e-3 },
]

export default function VoltageDrop() {
  const [v, setV] = useState('240')
  const [i, setI] = useState('20')
  const [len, setLen] = useState('100')
  const [awg, setAwg] = useState('10')
  const [metal, setMetal] = useState('copper')
  const [phase, setPhase] = useState('single')

  const V = parseFloat(v) || 0
  const I = parseFloat(i) || 0
  const L = parseFloat(len) || 0
  const m = METALS.find((x) => x.v === metal)!
  const mm2 = awgToMm2(parseInt(awg))
  const rPerM = m.k / mm2
  const lengthM = L * 0.3048
  const factor = phase === 'three' ? Math.sqrt(3) : 2
  const drop = factor * I * rPerM * lengthM
  const dropPct = V ? (drop / V) * 100 : 0

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Supply voltage" type="number" value={v} onChange={(e) => setV(e.target.value)} />
        <Field label="Current (A)" type="number" value={i} onChange={(e) => setI(e.target.value)} />
        <Field label="One-way length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Select label="Wire gauge (AWG)" value={awg} onChange={setAwg} options={['14', '12', '10', '8', '6', '4', '2', '1', '1/0', '2/0', '3/0', '4/0'].map((a) => ({ v: a, label: a + ' AWG' }))} />
        <Select label="Conductor" value={metal} onChange={setMetal} options={METALS} />
        <Select label="Phase" value={phase} onChange={setPhase} options={[{ v: 'single', label: 'Single-phase' }, { v: 'three', label: 'Three-phase' }]} />
      </div>
      <ResultGrid>
        <Result label="Voltage drop" value={`${drop.toFixed(2)} V`} tone={dropPct <= 3 ? 'good' : 'warn'} />
        <Result label="Drop percentage" value={`${dropPct.toFixed(2)}%`} tone={dropPct <= 3 ? 'good' : 'warn'} />
        <Result label="Load voltage" value={`${(V - drop).toFixed(1)} V`} />
        <Result label="Wire resistance" value={`${(rPerM * lengthM * factor).toFixed(4)} Ω`} />
      </ResultGrid>
      {dropPct > 3 && <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Drop exceeds 3% — consider a thicker wire (lower AWG).</p>}
    </div>
  )
}

function awgToMm2(awg: number): number {
  const names: Record<string, number> = { '14': 2.08, '12': 3.31, '10': 5.26, '8': 8.37, '6': 13.3, '4': 21.2, '2': 33.6, '1': 42.4, '0': 53.5, '-1': 67.4, '-2': 85.0, '-3': 107.2 }
  return names[String(awg)] || 5.26
}