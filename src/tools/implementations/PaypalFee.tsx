import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function PaypalFee() {
  const [amount, setAmount] = useState('120')
  const [currency, setCurrency] = useState('USD')
  const [mode, setMode] = useState<'standard' | 'gross'>('standard')

  const a = parseFloat(amount) || 0
  const fixed: Record<string, number> = { USD: 0.49, EUR: 0.35, GBP: 0.3, INR: 3 }
  const fee = a * 0.029 + (fixed[currency] ?? 0.4)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label={mode === 'standard' ? 'Amount charged to buyer' : 'Amount you need to receive'} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
            {['USD', 'EUR', 'GBP', 'INR'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input type="checkbox" checked={mode === 'gross'} onChange={(e) => setMode(e.target.checked ? 'gross' : 'standard')} className="w-4 h-4 accent-indigo-600" />
            I need to receive this exact amount
          </label>
        </div>
      </div>
      {mode === 'standard' ? (
        <ResultGrid>
          <Result label="PayPal fee (2.9% + fixed)" value={`${fee.toFixed(2)} ${currency}`} tone="warn" />
          <Result label="You receive" value={`${(a - fee).toFixed(2)} ${currency}`} tone="good" />
        </ResultGrid>
      ) : (
        <ResultGrid>
          <Result label="Gross amount to charge" value={`${(a + fee).toFixed(2)} ${currency}`} tone="good" />
          <Result label="PayPal fee" value={`${fee.toFixed(2)} ${currency}`} tone="warn" />
        </ResultGrid>
      )}
    </div>
  )
}