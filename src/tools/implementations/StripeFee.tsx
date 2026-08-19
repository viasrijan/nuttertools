import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const PLANS = [
  { v: 'standard', label: 'Standard 2.9% + 30¢' },
  { v: 'basic', label: 'Basic 3.4% + 30¢' },
  { v: 'plus', label: 'Plus 2.9% + 30¢' },
  { v: 'premium', label: 'Premium 2.9% + 30¢' },
  { v: 'integra', label: 'Integra 2.9% + 30¢' },
]

export default function StripeFee() {
  const [amount, setAmount] = useState('100')
  const [plan, setPlan] = useState('standard')

  const a = parseFloat(amount) || 0
  const pct = plan === 'basic' ? 0.034 : 0.029
  const fee = a * pct + 0.3

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Charge amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Select label="Pricing plan" value={plan} onChange={setPlan} options={PLANS} />
      </div>
      <ResultGrid>
        <Result label="Stripe fee" value={`$${fee.toFixed(2)}`} tone="warn" />
        <Result label="Net payout" value={`$${(a - fee).toFixed(2)}`} tone="good" />
        <Result label="Amount to charge for $100 net" value={`$${((100 + 0.3) / (1 - pct)).toFixed(2)}`} />
        <Result label="Effective rate" value={`${((fee / a) * 100).toFixed(2)}%`} />
      </ResultGrid>
    </div>
  )
}