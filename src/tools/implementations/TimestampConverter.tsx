import { useState } from 'react'

import { Button } from '../../components/ui/Button'

function isValidDate(d: Date) {
  return !Number.isNaN(d.getTime())
}

export default function TimestampConverter() {
  const [unix, setUnix] = useState('')
  const [local, setLocal] = useState('')
  const [copied, setCopied] = useState('')

  const ms = unix.trim()
  const msNum = ms ? Number(ms) : NaN
  const date = Number.isFinite(msNum) ? new Date(msNum) : null

  const dateToUnix = (d: Date) => String(Math.floor(d.getTime() / 1000))

  const toDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(e.target.value)
    const v = e.target.value
    if (v) {
      const d = new Date(v)
      if (isValidDate(d)) setUnix(dateToUnix(d))
    }
  }

  const toLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnix(e.target.value)
    const n = Number(e.target.value)
    if (Number.isFinite(n)) {
      const d = new Date(n * 1000)
      if (isValidDate(d)) {
        const pad = (x: number) => String(x).padStart(2, '0')
        setLocal(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`)
      }
    }
  }

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 1200)
  }

  const now = () => {
    const s = dateToUnix(new Date())
    setUnix(s)
    const d = new Date()
    const pad = (x: number) => String(x).padStart(2, '0')
    setLocal(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`)
  }

  const rows: [string, string][] = date && isValidDate(date) ? [
    ['Unix seconds', String(Math.floor(date.getTime() / 1000))],
    ['Unix milliseconds', String(date.getTime())],
    ['UTC', date.toUTCString()],
    ['Local', date.toLocaleString()],
    ['ISO 8601', date.toISOString()],
    ['Date', date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    ['Time', date.toLocaleTimeString()],
  ] : []

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Unix timestamp (s or ms)</label>
          <input value={unix} onChange={toLocal} spellCheck={false} placeholder="1710000000"
            className="w-full border px-3 py-2.5 font-mono text-zinc-900 dark:text-white bg-transparent outline-none focus:border-indigo-600" />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Local date &amp; time</label>
          <input type="datetime-local" value={local} onChange={toDate}
            className="w-full border px-3 py-2.5 text-zinc-900 dark:text-white bg-transparent outline-none focus:border-indigo-600" />
        </div>
        <Button variant="secondary" onClick={now}>Now</Button>
      </div>
      {rows.length > 0 && (
        <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-[13px] font-mono">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="text-zinc-500 dark:text-zinc-400 shrink-0">{k}</span>
              <button onClick={() => copy(k, v)} className="font-semibold text-zinc-900 dark:text-white hover:underline text-right break-all">
                {copied === k ? 'Copied!' : v}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
