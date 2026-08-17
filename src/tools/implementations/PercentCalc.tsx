import { useState } from 'react'

import { Button } from '../../components/ui/Button'

export default function PercentCalc() {
  const [tab, setTab] = useState<'percent' | 'change' | 'gst' | 'emi'>('percent')
  const [a, setA] = useState('200')
  const [b, setB] = useState('15')
  const [from, setFrom] = useState('100')
  const [to, setTo] = useState('150')
  const [principal, setPrincipal] = useState('100000')
  const [rate, setRate] = useState('7')
  const [months, setMonths] = useState('36')
  const [price, setPrice] = useState('1000')
  const [gstRate, setGstRate] = useState('18')

  const pct = parseFloat(a), pctOf = parseFloat(b)
  const emi = (() => {
    const P = parseFloat(principal), r = parseFloat(rate) / 1200, n = parseInt(months) || 1
    if (!P || !r) return 0
    return P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  })()

  const Field = ({ v, set, label }: { v: string, set: (s: string) => void, label: string }) => (
    <label className="block text-sm font-semibold">{label}<input type="number" value={v} onChange={e => set(e.target.value)} className="w-full border px-3 h-9 mt-1" /></label>
  )

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap gap-2.5">
        {(['percent', 'change', 'gst', 'emi'] as const).map(t => (
          <Button variant="outline" key={t} onClick={() => setTab(t)} className={`px-3 h-9 text-sm border capitalize ${tab === t ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{t}</Button>
        ))}
      </div>
      {tab === 'percent' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field v={a} set={setA} label="Value" />
            <Field v={b} set={setB} label="Percent %" />
          </div>
          <div className="space-y-3">
            <Result label={`${b}% of ${a}`} value={(pct * pctOf / 100).toFixed(2)} />
            <Result label={`${a} + ${b}% =`} value={(pct + pct * pctOf / 100).toFixed(2)} />
            <Result label={`${a} − ${b}% =`} value={(pct - pct * pctOf / 100).toFixed(2)} />
          </div>
        </>
      )}
      {tab === 'change' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field v={from} set={setFrom} label="From" />
            <Field v={to} set={setTo} label="To" />
          </div>
          <Result label="Percentage change" value={`${(((parseFloat(to) - parseFloat(from)) / parseFloat(from)) * 100).toFixed(2)}%`} />
        </>
      )}
      {tab === 'gst' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field v={price} set={setPrice} label="Price" />
            <Field v={gstRate} set={setGstRate} label="GST %" />
          </div>
          <div className="space-y-3">
            <Result label="GST amount" value={(parseFloat(price) * parseFloat(gstRate) / 100).toFixed(2)} />
            <Result label="Total (incl. GST)" value={(parseFloat(price) * (1 + parseFloat(gstRate) / 100)).toFixed(2)} />
            <Result label="Exclusive amount" value={(parseFloat(price) / (1 + parseFloat(gstRate) / 100)).toFixed(2)} />
          </div>
        </>
      )}
      {tab === 'emi' && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Field v={principal} set={setPrincipal} label="Loan amount" />
            <Field v={rate} set={setRate} label="Annual %" />
            <Field v={months} set={setMonths} label="Months" />
          </div>
          <Result label="Monthly EMI" value={`${isFinite(emi) ? emi.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}`} />
          {isFinite(emi) && <Result label="Total interest" value={`${(emi * (parseInt(months) || 1) - parseFloat(principal)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />}
        </>
      )}
    </div>
  )
}

function Result({ label, value }: { label: string, value: string }) {
  return <div className="flex items-center justify-between border p-3"><span className="text-sm font-medium">{label}</span><b className="text-base">{value}</b></div>
}
