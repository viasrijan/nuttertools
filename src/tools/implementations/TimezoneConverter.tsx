import { useMemo, useState } from 'react'

export default function TimezoneConverter() {
  const zones: string[] = useMemo(() => {
    try { return (Intl as any).supportedValuesOf('timeZone') as string[] } catch { return [] }
  }, [])

  const [from, setFrom] = useState(() => zones.includes('Asia/Kolkata') ? 'Asia/Kolkata' : zones[0] || 'UTC')
  const [to, setTo] = useState(() => zones.includes('America/New_York') ? 'America/New_York' : zones[1] || 'UTC')
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date()
    d.setSeconds(0, 0)
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
  })

  const res = useMemo(() => {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    const parts = (tz: string) => {
      const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', timeZoneName: 'short' })
      return fmt.formatToParts(d)
    }
    const pick = (tz: string, names: string[]) => {
      const p = parts(tz)
      const get = (n: string) => p.find(x => x.type === n)?.value || ''
      const h = +get('hour')
      return {
        date: `${get('weekday')} ${get('month')}/${get('day')}/${get('year')}`,
        time: (h === 24 ? '00' : String(h).padStart(2, '0')) + ':' + get('minute'),
        zone: get('timeZoneName'),
      }
    }
    return { a: pick(from, []), b: pick(to, []) }
  }, [from, to, dateStr])

  const offset = useMemo(() => {
    try {
      const d = new Date(dateStr)
      const fmt = (tz: string) => {
        const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false })
        const asUTC = new Date(f.format(d) + ':00Z')
        return (asUTC.getTime() - d.getTime()) / 3600000
      }
      const o = fmt(to) - fmt(from)
      return o >= 0 ? `+${o.toFixed(1)}h` : `${o.toFixed(1)}h`
    } catch { return '' }
  }, [from, to, dateStr])

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className="w-full border px-2 py-2 text-sm mt-1">
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">To</label>
          <select value={to} onChange={e => setTo(e.target.value)} className="w-full border px-2 py-2 text-sm mt-1">
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>
      <input type="datetime-local" value={dateStr} onChange={e => setDateStr(e.target.value)} className="w-full border px-3 py-2 text-sm" />
      {res && (
        <div className="border divide-y text-sm">
          <div className="p-3 flex justify-between items-center">
            <div><div className="font-semibold">{from}</div><div className="text-xs text-zinc-500">{res.a.date} · {res.a.zone}</div></div>
            <div className="text-xl font-bold font-mono">{res.a.time}</div>
          </div>
          <div className="p-2 text-center text-xs text-zinc-500 font-mono">difference {offset}</div>
          <div className="p-3 flex justify-between items-center">
            <div><div className="font-semibold">{to}</div><div className="text-xs text-zinc-500">{res.b.date} · {res.b.zone}</div></div>
            <div className="text-xl font-bold font-mono">{res.b.time}</div>
          </div>
        </div>
      )}
      {!res && <p className="text-xs text-red-600">Invalid date.</p>}
    </div>
  )
}
