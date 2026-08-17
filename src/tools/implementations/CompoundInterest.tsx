import { useMemo, useState } from 'react'

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState(10000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(10)
  const [contribution, setContribution] = useState(200)
  const [freq, setFreq] = useState<'monthly' | 'yearly' | 'quarterly'>('monthly')

  const n = freq === 'monthly' ? 12 : freq === 'quarterly' ? 4 : 1

  const rows = useMemo(() => {
    const r = rate / 100
    const out: { year: number, interest: number, balance: number }[] = []
    let balance = principal
    for (let y = 1; y <= years; y++) {
      let start = balance
      if (freq === 'yearly') balance = balance * (1 + r) + contribution
      else {
        for (let p = 0; p < n; p++) {
          balance = balance * (1 + r / n) + contribution
        }
      }
      out.push({ year: y, interest: balance - start - (freq === 'yearly' ? contribution : contribution * n), balance })
    }
    return out
  }, [principal, rate, years, contribution, freq, n])

  const totalContrib = principal + contribution * n * years
  const totalInterest = rows.length ? rows[rows.length - 1].balance - totalContrib : 0

  const money = (v: number) => '$' + Math.round(v).toLocaleString()

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Principal</label><input type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Rate % / yr</label><input type="number" step="0.1" value={rate} onChange={e => setRate(+e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Years</label><input type="number" value={years} onChange={e => setYears(+e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Contribution</label><input type="number" value={contribution} onChange={e => setContribution(+e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Frequency</label>
          <select value={freq} onChange={e => setFreq(e.target.value as typeof freq)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200">
            <option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 transition-all duration-200 hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)]"><div className="text-lg font-bold">{money(rows.length ? rows[rows.length - 1].balance : 0)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Final balance</div></div>
        <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 transition-all duration-200 hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)]"><div className="text-lg font-bold text-green-600">{money(totalInterest)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Total interest</div></div>
        <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 transition-all duration-200 hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)]"><div className="text-lg font-bold">{money(totalContrib)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Total invested</div></div>
      </div>
      <div className="border text-xs max-h-[280px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-900"><tr className="border-b text-left"><th className="p-2 font-semibold">Year</th><th className="p-2 font-semibold">Interest</th><th className="p-2 font-semibold">Balance</th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.year} className="border-b last:border-0"><td className="p-2">{r.year}</td><td className="p-2">{money(r.interest)}</td><td className="p-2 font-semibold">{money(r.balance)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
