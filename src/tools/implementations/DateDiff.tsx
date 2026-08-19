import { useState } from 'react'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function DateDiff() {
  const [from, setFrom] = useState(() => new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10))
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10))
  const [includeEnd, setIncludeEnd] = useState(false)

  const a = new Date(from + 'T00:00:00')
  const b = new Date(to + 'T00:00:00')
  const [y1, m1, d1] = [a.getFullYear(), a.getMonth(), a.getDate()]
  const [y2, m2, d2] = [b.getFullYear(), b.getMonth(), b.getDate()]
  let years = y2 - y1
  let months = m2 - m1
  let days = d2 - d1
  if (days < 0) { months--; days += new Date(y2, m2, 0).getDate() }
  if (months < 0) { years--; months += 12 }
  const totalDays = Math.round((b.getTime() - a.getTime()) / 86400000) + (includeEnd ? 1 : 0)
  const weeks = Math.floor(totalDays / 7)
  const hours = totalDays * 24
  const valid = !isNaN(totalDays) && totalDays >= 0

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">Start date</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </label>
        <label className="block">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">End date</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
        <input type="checkbox" checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
        Include end day in total
      </label>
      {valid && totalDays >= 0 ? (
        <>
          <ResultGrid>
            <Result label="Total duration" value={`${years}y ${months}m ${days}d`} tone="good" />
            <Result label="Total days" value={totalDays.toLocaleString()} />
            <Result label="Weeks" value={`${weeks.toLocaleString()}`} />
            <Result label="Hours" value={hours.toLocaleString()} />
            <Result label="Weekdays" value={`${weekdays(new Date(from), new Date(to)).toLocaleString()}`} />
            <Result label="Weekends" value={`${(totalDays - weekdays(new Date(from), new Date(to))).toLocaleString()}`} />
          </ResultGrid>
        </>
      ) : (
        <p className="text-sm font-semibold text-rose-600">End date must be after the start date.</p>
      )}
    </div>
  )
}

function weekdays(a: Date, b: Date): number {
  let n = 0
  const cur = new Date(a)
  while (cur <= b) {
    const d = cur.getDay()
    if (d !== 0 && d !== 6) n++
    cur.setDate(cur.getDate() + 1)
  }
  return n
}