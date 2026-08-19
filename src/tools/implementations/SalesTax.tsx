import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

export default function SalesTax() {
  const [price, setPrice] = useState('100')
  const [rate, setRate] = useState('8.25')
  const [mode, setMode] = useState('add')

  const p = parseFloat(price) || 0
  const r = parseFloat(rate) || 0

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Field label="Tax rate %" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        <Select label="Mode" value={mode} onChange={setMode} options={[{ v: 'add', label: 'Add tax to price' }, { v: 'remove', label: 'Reverse: remove tax' }]} />
      </div>
      {mode === 'add' ? (
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <Result label="Subtotal" value={`$${p.toFixed(2)}`} />
            <Result label="Tax amount" value={`$${(p * r / 100).toFixed(2)}`} tone="warn" />
            <Result label="Total" value={`$${(p * (1 + r / 100)).toFixed(2)}`} tone="good" />
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <Result label="Price includes tax" value={`$${p.toFixed(2)}`} />
            <Result label="Pre-tax price" value={`$${(p / (1 + r / 100)).toFixed(2)}`} tone="good" />
            <Result label="Tax included" value={`$${(p - p / (1 + r / 100)).toFixed(2)}`} tone="warn" />
          </div>
        </>
      )}
    </div>
  )
}