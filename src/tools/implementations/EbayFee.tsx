import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function EbayFee() {
  const [price, setPrice] = useState('80')
  const [shipping, setShipping] = useState('10')
  const [cost, setCost] = useState('25')

  const p = parseFloat(price) || 0
  const s = parseFloat(shipping) || 0
  const c = parseFloat(cost) || 0
  const total = p + s

  const insertion = p > 100 ? 0 : 0.35
  const finalValue = total * 0.1325
  const payment = total * 0.029 + 0.3
  const fees = insertion + finalValue + payment
  const profit = total - fees - c

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Item price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Field label="Shipping charged" type="number" value={shipping} onChange={(e) => setShipping(e.target.value)} />
        <Field label="Item cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Insertion fee" value={`$${insertion.toFixed(2)}`} tone="warn" />
        <Result label="Final value fee (13.25%)" value={`$${finalValue.toFixed(2)}`} tone="warn" />
        <Result label="Payment processing (2.9% + 30¢)" value={`$${payment.toFixed(2)}`} tone="warn" />
        <Result label="Total fees" value={`$${fees.toFixed(2)}`} tone="warn" />
        <Result label="Net profit" value={`$${profit.toFixed(2)}`} tone={profit >= 0 ? 'good' : 'warn'} />
        <Result label="Profit margin" value={`${total ? Math.round((profit / total) * 100) : 0}%`} tone="good" />
      </ResultGrid>
    </div>
  )
}