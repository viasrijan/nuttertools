import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function LoanCalculator() {
  const [amount, setAmount] = useState('20000')
  const [rate, setRate] = useState('6.5')
  const [years, setYears] = useState('5')

  const P = parseFloat(amount) || 0
  const r = (parseFloat(rate) || 0) / 100 / 12
  const n = (parseFloat(years) || 1) * 12
  const monthly = P && r ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n
  const total = monthly * n
  const interest = total - P

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Loan amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Field label="Annual interest %" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        <Field label="Term (years)" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Monthly payment" value={`$${fmt(monthly)}`} tone="good" />
        <Result label="Total paid" value={`$${fmt(total)}`} />
        <Result label="Total interest" value={`$${fmt(interest)}`} />
        <Result label="Interest share" value={`${P ? Math.round((interest / total) * 100) : 0}%`} />
      </ResultGrid>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <span>Principal ${fmt(Math.max(0, P))}</span>
          <span>Interest ${fmt(Math.max(0, interest))}</span>
        </div>
        <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div className="h-full bg-indigo-600" style={{ width: `${total ? (P / total) * 100 : 0}%` }} />
        </div>
      </div>
    </div>
  )
}