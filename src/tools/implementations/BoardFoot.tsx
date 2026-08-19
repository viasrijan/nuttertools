import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function BoardFoot() {
  const [lengths, setLengths] = useState('8\n10\n12')
  const [width, setWidth] = useState('6')
  const [thick, setThick] = useState('2')
  const [price, setPrice] = useState('4')

  const W = parseFloat(width) || 0
  const T = parseFloat(thick) || 0
  const P = parseFloat(price) || 0
  const rows = lengths.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => parseFloat(l) || 0)
  const pieces = rows.length
  const totalBdFt = rows.reduce((a, l) => a + (l * W * T) / 12, 0)
  const cost = totalBdFt * P

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Lengths (ft, one per line)</span>
          <textarea value={lengths} onChange={(e) => setLengths(e.target.value)} rows={4} className="w-full p-3 font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </div>
        <Field label="Width (in)" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
        <Field label="Thickness (in)" type="number" value={thick} onChange={(e) => setThick(e.target.value)} />
      </div>
      <div className="max-w-[200px]">
        <Field label="Price per board foot" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Pieces" value={pieces} />
        <Result label="Total board feet" value={`${totalBdFt.toFixed(1)} bd-ft`} tone="good" />
        <Result label="Total cost" value={`$${cost.toFixed(2)}`} />
      </ResultGrid>
    </div>
  )
}