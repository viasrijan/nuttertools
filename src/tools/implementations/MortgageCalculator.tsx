import { useMemo, useState } from 'react'

export default function MortgageCalculator() {
  const [price, setPrice] = useState(350000)
  const [down, setDown] = useState(20)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)

  const res = useMemo(() => {
    const P = price * (1 - down / 100)
    const r = rate / 100 / 12
    const n = years * 12
    const payment = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const total = payment * n
    const interest = total - P
    const afford = rate === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    return { P, payment, total, interest, afford: afford }
  }, [price, down, rate, years])

  const amort = useMemo(() => {
    const P = res.P
    const r = rate / 100 / 12
    const n = years * 12
    const pmt = res.payment
    const out: { year: number, paid: number, interest: number, balance: number }[] = []
    let bal = P
    for (let y = 1; y <= years; y++) {
      let interest = 0
      for (let m = 0; m < 12 && bal > 0; m++) {
        const i = bal * r
        interest += i
        bal = bal + i - pmt
      }
      out.push({ year: y, paid: pmt * 12, interest, balance: Math.max(0, bal) })
    }
    return out
  }, [res.P, rate, years, res.payment])

  const money = (v: number) => '$' + Math.round(v).toLocaleString()

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Home price</label><input type="number" value={price} onChange={e => setPrice(+e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Down payment %</label><input type="number" value={down} onChange={e => setDown(+e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Rate % / yr</label><input type="number" step="0.05" value={rate} onChange={e => setRate(+e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Term (years)</label>
          <select value={years} onChange={e => setYears(+e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200">
            <option value={10}>10</option><option value={15}>15</option><option value={20}>20</option><option value={30}>30</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
        <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 transition-all duration-200 hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)]"><div className="text-lg font-bold">{money(res.payment)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Monthly payment</div></div>
        <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 transition-all duration-200 hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)]"><div className="text-lg font-bold">{money(res.P)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Loan amount</div></div>
        <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 transition-all duration-200 hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)]"><div className="text-lg font-bold text-red-600">{money(res.interest)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Total interest</div></div>
        <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 transition-all duration-200 hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)]"><div className="text-lg font-bold">{money(res.total)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Total cost</div></div>
      </div>
      <div className="border text-xs max-h-[280px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-900"><tr className="border-b text-left"><th className="p-2 font-semibold">Year</th><th className="p-2 font-semibold">Paid</th><th className="p-2 font-semibold">Interest</th><th className="p-2 font-semibold">Balance</th></tr></thead>
          <tbody>{amort.map(r => <tr key={r.year} className="border-b last:border-0"><td className="p-2">{r.year}</td><td className="p-2">{money(r.paid)}</td><td className="p-2">{money(r.interest)}</td><td className="p-2 font-semibold">{money(r.balance)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
