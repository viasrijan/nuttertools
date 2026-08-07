import { useState } from 'react'

function diff(birth: Date, target = new Date()) {
  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  let days = target.getDate() - birth.getDate()
  if (days < 0) { months--; days += new Date(target.getFullYear(), target.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }
  return { years, months, days, totalDays: Math.floor((target.getTime() - birth.getTime()) / 86400000) }
}

export default function AgeCalc() {
  const [dob, setDob] = useState('2000-01-15')
  const [target, setTarget] = useState(new Date().toISOString().slice(0, 10))
  const [mode, setMode] = useState<'age' | 'diff'>('age')

  const start = mode === 'age' ? dob : dob
  const a = new Date(start)
  const b = new Date(target)
  const valid = !isNaN(a.getTime()) && !isNaN(b.getTime()) && b >= a
  const r = valid ? diff(a, b) : null

  const nextBday = valid ? (() => {
    const next = new Date(b.getFullYear(), a.getMonth(), a.getDate())
    if (next <= b) next.setFullYear(next.getFullYear() + 1)
    return Math.ceil((next.getTime() - b.getTime()) / 86400000)
  })() : null

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex gap-2">
        <button onClick={() => setMode('age')} className={`px-4 h-9 text-sm border ${mode === 'age' ? 'bg-zinc-900 text-white' : ''}`}>Age</button>
        <button onClick={() => setMode('diff')} className={`px-4 h-9 text-sm border ${mode === 'diff' ? 'bg-zinc-900 text-white' : ''}`}>Date diff</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">{mode === 'age' ? 'Date of birth' : 'Start date'}<input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full border px-3 h-9 mt-1" /></label>
        <label className="text-sm font-semibold">Target date<input type="date" value={target} onChange={e => setTarget(e.target.value)} className="w-full border px-3 h-9 mt-1" /></label>
      </div>
      {r && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Stat v={r.years} l="Years" /><Stat v={r.months} l="Months" /><Stat v={r.days} l="Days" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat v={r.totalDays.toLocaleString()} l="Total days" />
            <Stat v={r.totalDays * 24} l="Total hours" />
          </div>
          {nextBday !== null && <div className="border p-3 text-sm font-medium">🎂 Next birthday in <b>{nextBday}</b> day{nextBday === 1 ? '' : 's'}</div>}
        </>
      )}
      {!valid && <p className="text-xs text-red-500">Target date must be after the start date.</p>}
    </div>
  )
}

function Stat({ v, l }: { v: number | string, l: string }) {
  return <div className="border p-4 text-center"><div className="text-2xl font-bold">{v}</div><div className="text-[11px] font-semibold text-zinc-500">{l}</div></div>
}
