import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function EtsyFee() {
  const [price, setPrice] = useState('45')
  const [shipping, setShipping] = useState('6')
  const [cost, setCost] = useState('15')
  const [qty, setQty] = useState('1')

  const p = parseFloat(price) || 0
  const s = parseFloat(shipping) || 0
  const c = parseFloat(cost) || 0
  const q = parseInt(qty) || 1

  const total = (p + s) * q
  const listing = 0.2 * q
  const transaction = total * 0.065
  const payment = (total * 0.03 + 0.25) * q
  const ads = total * 0.12
  const fees = listing + transaction + payment
  const profit = total - fees - c * q

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Item price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Field label="Shipping" type="number" value={shipping} onChange={(e) => setShipping(e.target.value)} />
        <Field label="Item cost" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        <Field label="Quantity" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Listing fees ($0.20 each)" value={`$${listing.toFixed(2)}`} tone="warn" />
        <Result label="Transaction fee (6.5%)" value={`$${transaction.toFixed(2)}`} tone="warn" />
        <Result label="Payment processing (3% + $0.25)" value={`$${payment.toFixed(2)}`} tone="warn" />
        <Result label="Offsite ads estimate (12%)" value={`$${ads.toFixed(2)}`} tone="warn" />
        <Result label="Total fees" value={`$${fees.toFixed(2)}`} tone="warn" />
        <Result label="Net profit" value={`$${profit.toFixed(2)}`} tone={profit >= 0 ? 'good' : 'warn'} />
        <Result label="Profit margin" value={`${total ? Math.round((profit / total) * 100) : 0}%`} tone="good" />
      </ResultGrid>
    </div>
  )
}