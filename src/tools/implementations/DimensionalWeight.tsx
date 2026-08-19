import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function DimensionalWeight() {
  const [l, setL] = useState('40')
  const [w, setW] = useState('30')
  const [h, setH] = useState('20')
  const [actual, setActual] = useState('10')
  const [carrier, setCarrier] = useState('fedex')

  const L = parseFloat(l) || 0
  const W = parseFloat(w) || 0
  const H = parseFloat(h) || 0
  const A = parseFloat(actual) || 0

  const divisor = carrier === 'fedex' ? 139 : carrier === 'ups' ? 139 : 166
  const dim = (L * W * H) / divisor
  const billable = Math.max(dim, A)
  const isDim = dim > A

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field label="Length (in)" type="number" value={l} onChange={(e) => setL(e.target.value)} />
        <Field label="Width (in)" type="number" value={w} onChange={(e) => setW(e.target.value)} />
        <Field label="Height (in)" type="number" value={h} onChange={(e) => setH(e.target.value)} />
        <Field label="Actual (lb)" type="number" value={actual} onChange={(e) => setActual(e.target.value)} />
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Carrier</span>
          <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
            <option value="fedex">FedEx (139)</option>
            <option value="ups">UPS (139)</option>
            <option value="usps">USPS (166)</option>
          </select>
        </div>
      </div>
      <ResultGrid>
        <Result label="Dimensional weight" value={`${dim.toFixed(1)} lb`} />
        <Result label="Billable weight" value={`${billable.toFixed(1)} lb`} tone="good" />
        <Result label="Verdict" value={isDim ? 'Billed by dimension' : 'Billed by actual weight'} tone={isDim ? 'warn' : 'good'} />
      </ResultGrid>
    </div>
  )
}