import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const TABS = [
  { v: 'percent', label: 'Percentage of a number' },
  { v: 'change', label: 'Percentage change' },
  { v: 'gst', label: 'Add / remove tax' },
  { v: 'emi', label: 'Loan EMI' },
]

export default function PercentCalc() {
  const [tab, setTab] = useState('percent')
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

  return (
    <div className="space-y-6 max-w-xl">
      <div className="max-w-[280px]">
        <Select label="Calculation" value={tab} onChange={setTab} options={TABS} />
      </div>
      {tab === 'percent' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Value" type="number" value={a} onChange={(e) => setA(e.target.value)} />
            <Field label="Percent %" type="number" value={b} onChange={(e) => setB(e.target.value)} />
          </div>
          <ResultGrid>
            <Result label={`${b}% of ${a}`} value={(pct * pctOf / 100).toFixed(2)} tone="good" />
            <Result label={`${a} + ${b}%`} value={(pct + pct * pctOf / 100).toFixed(2)} />
            <Result label={`${a} − ${b}%`} value={(pct - pct * pctOf / 100).toFixed(2)} />
          </ResultGrid>
        </div>
      )}
      {tab === 'change' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="From" type="number" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Field label="To" type="number" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <ResultGrid>
            <Result label="Percentage change" value={`${(((parseFloat(to) - parseFloat(from)) / parseFloat(from)) * 100).toFixed(2)}%`} tone="good" />
          </ResultGrid>
        </div>
      )}
      {tab === 'gst' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Field label="Tax %" type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} />
          </div>
          <ResultGrid>
            <Result label="Tax amount" value={(parseFloat(price) * parseFloat(gstRate) / 100).toFixed(2)} />
            <Result label="Total (incl. tax)" value={(parseFloat(price) * (1 + parseFloat(gstRate) / 100)).toFixed(2)} tone="good" />
            <Result label="Pre-tax amount" value={(parseFloat(price) / (1 + parseFloat(gstRate) / 100)).toFixed(2)} />
          </ResultGrid>
        </div>
      )}
      {tab === 'emi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Loan amount" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
            <Field label="Annual %" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
            <Field label="Months" type="number" value={months} onChange={(e) => setMonths(e.target.value)} />
          </div>
          <ResultGrid>
            <Result label="Monthly EMI" value={isFinite(emi) ? emi.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'} tone="good" />
            <Result label="Total interest" value={isFinite(emi) ? (emi * (parseInt(months) || 1) - parseFloat(principal)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'} />
          </ResultGrid>
        </div>
      )}
    </div>
  )
}