import { useState } from 'react'

import { Button } from '../../components/ui/Button'

export default function DiscountCalculator() {
  const [mode, setMode] = useState<'percent' | 'flat' | 'reverse'>('percent')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [finalPrice, setFinalPrice] = useState('')
  const [tax, setTax] = useState('')

  const p = Number(price)
  const d = Number(discount)
  const f = Number(finalPrice)
  const t = Number(tax) || 0

  const calc = () => {
    if (mode === 'percent' && Number.isFinite(p) && Number.isFinite(d)) {
      const saved = (p * d) / 100
      const after = p - saved
      const withTax = after + (after * t) / 100
      return { saved, after, withTax, percent: d }
    }
    if (mode === 'flat' && Number.isFinite(p) && Number.isFinite(d)) {
      const saved = Math.min(d, p)
      const after = p - saved
      const withTax = after + (after * t) / 100
      return { saved, after, withTax, percent: p > 0 ? (saved / p) * 100 : 0 }
    }
    if (mode === 'reverse' && Number.isFinite(p) && Number.isFinite(f)) {
      const saved = p - f
      return { saved, after: f, withTax: f, percent: p > 0 ? (saved / p) * 100 : 0 }
    }
    return null
  }

  const r = calc()

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap gap-2.5">
        {([['percent', '% off'], ['flat', 'Flat amount'], ['reverse', 'Find discount %']] as const).map(([m, label]) => (
          <Button variant="outline" key={m} onClick={() => setMode(m)} className={`px-4 h-10 text-sm font-semibold ${mode === m ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : 'ring-1 ring-zinc-200 dark:ring-zinc-800'}`}>
            {label}
          </Button>
        ))}
      </div>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="w-40 text-sm font-semibold text-zinc-900 dark:text-white">Original price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="0"
            className="flex-1 min-w-[140px] border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none focus:border-indigo-600" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="w-40 text-sm font-semibold text-zinc-900 dark:text-white">{mode === 'reverse' ? 'Final price' : mode === 'percent' ? 'Discount %' : 'Discount amount'}</label>
          <input value={mode === 'reverse' ? finalPrice : discount} onChange={(e) => mode === 'reverse' ? setFinalPrice(e.target.value) : setDiscount(e.target.value)} type="number" placeholder="0"
            className="flex-1 min-w-[140px] border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none focus:border-indigo-600" />
        </div>
        {mode !== 'reverse' && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="w-40 text-sm font-semibold text-zinc-900 dark:text-white">Tax % (optional)</label>
            <input value={tax} onChange={(e) => setTax(e.target.value)} type="number" placeholder="0"
              className="flex-1 min-w-[140px] border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none focus:border-indigo-600" />
          </div>
        )}
      </div>
      {r && (
        <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <div className="flex justify-between px-4 py-2.5"><span className="text-zinc-500 dark:text-zinc-400">You save</span><span className="font-bold text-green-600 dark:text-green-400">{r.saved.toFixed(2)}</span></div>
          <div className="flex justify-between px-4 py-2.5"><span className="text-zinc-500 dark:text-zinc-400">Discount</span><span className="font-bold">{r.percent.toFixed(1)}%</span></div>
          {mode !== 'reverse' && t > 0 && (
            <div className="flex justify-between px-4 py-2.5"><span className="text-zinc-500 dark:text-zinc-400">After tax</span><span className="font-bold">{r.withTax.toFixed(2)}</span></div>
          )}
          <div className="flex justify-between px-4 py-3 bg-green-600/5"><span className="font-semibold">Final price</span><span className="font-bold text-lg">{r.after.toFixed(2)}</span></div>
        </div>
      )}
    </div>
  )
}
