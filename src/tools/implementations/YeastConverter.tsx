import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

export default function YeastConverter() {
  const [qty, setQty] = useState('7')
  const [from, setFrom] = useState('active-dry')
  const [to, setTo] = useState('instant')

  const Q = parseFloat(qty) || 0
  const EQUIV: Record<string, number> = { 'fresh': 3, 'active-dry': 1, 'instant': 0.75 }

  const converted = Q * (EQUIV[to] / EQUIV[from])
  const liquid = from === 'instant' || from === 'active-dry' ? 1 : 0

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Amount (g)" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
        <Select label="From" value={from} onChange={setFrom} options={[{ v: 'fresh', label: 'Fresh (compressed)' }, { v: 'active-dry', label: 'Active dry' }, { v: 'instant', label: 'Instant / rapid rise' }]} />
        <Select label="To" value={to} onChange={setTo} options={[{ v: 'fresh', label: 'Fresh (compressed)' }, { v: 'active-dry', label: 'Active dry' }, { v: 'instant', label: 'Instant / rapid rise' }]} />
      </div>
      {from !== to && (
        <ResultGrid>
          <Result label="Use instead" value={`${converted.toFixed(1)} g`} tone="good" />
          <Result label="Liquid adjustment" value={liquid > 0 ? 'Reduce recipe liquid by ~15 g per 5 g yeast' : 'None'} />
        </ResultGrid>
      )}
    </div>
  )
}