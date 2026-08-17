import { useEffect, useState } from 'react'

import { Button } from '../../components/ui/Button'

const CURRENCIES: [string, string][] = [
  ['USD', 'US Dollar'], ['EUR', 'Euro'], ['GBP', 'British Pound'], ['JPY', 'Japanese Yen'],
  ['INR', 'Indian Rupee'], ['AUD', 'Australian Dollar'], ['CAD', 'Canadian Dollar'],
  ['CHF', 'Swiss Franc'], ['CNY', 'Chinese Yuan'], ['BRL', 'Brazilian Real'], ['ZAR', 'South African Rand'],
  ['MXN', 'Mexican Peso'], ['SGD', 'Singapore Dollar'], ['NZD', 'New Zealand Dollar'],
  ['HKD', 'Hong Kong Dollar'], ['KRW', 'South Korean Won'], ['SEK', 'Swedish Krona'],
  ['NOK', 'Norwegian Krone'], ['DKK', 'Danish Krone'], ['PLN', 'Polish Zloty'],
  ['TRY', 'Turkish Lira'], ['AED', 'UAE Dirham'], ['RUB', 'Russian Ruble'], ['THB', 'Thai Baht'],
]

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [rates, setRates] = useState<Record<string, number> | null>(null)
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const load = async () => {
    setStatus('loading')
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=EUR')
      if (!res.ok) throw new Error('bad response')
      const data = await res.json()
      setRates(data.rates)
      setDate(data.date)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => { load() }, [])

  const a = Number(amount)
  const rFrom = rates?.[from]
  const rTo = rates?.[to]
  let result: number | null = null
  if (rates && Number.isFinite(a) && a >= 0 && rFrom && rTo) {
    const eur = a / rFrom
    result = eur * rTo
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Amount</label>
          <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none focus:border-indigo-600" />
        </div>
        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}
            className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none">
            {CURRENCIES.map(([c, n]) => <option key={c} value={c}>{c} — {n}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)}
            className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none">
            {CURRENCIES.map(([c, n]) => <option key={c} value={c}>{c} — {n}</option>)}
          </select>
        </div>
      </div>
      {status === 'loading' && <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Fetching live exchange rates…</p>}
      {status === 'error' && (
        <div className="flex items-center gap-3 text-sm font-medium text-red-600 dark:text-red-400">
          <span>Couldn't load rates. Check your connection.</span>
          <Button variant="secondary" size="sm" onClick={load}>Retry</Button>
        </div>
      )}
      {status === 'ready' && result !== null && (
        <div className="border p-5">
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {a} {from} = <span className="sr-only">→</span>
          </div>
          <div className="mt-1 text-3xl font-black tracking-tight">
            {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
          </div>
          <div className="mt-1 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            1 {from} = {(rTo! / rFrom!).toFixed(4)} {to} · rates from {date}
          </div>
        </div>
      )}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Live rates via the free Frankfurter API (ECB reference data). For display only — always confirm with your bank before transferring money.</p>
    </div>
  )
}
