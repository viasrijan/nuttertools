import { useState } from 'react'

import { Button } from '../../components/ui/Button'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const RANGES = { minute: [0, 59], hour: [0, 23], dom: [1, 31], month: [1, 12], dow: [0, 7] } as const
const FIELD_NAMES = ['Minute', 'Hour', 'Day of month', 'Month', 'Day of week']
const PRESETS: { label: string, expr: string }[] = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every 5 minutes', expr: '*/5 * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every Monday at 9am', expr: '0 9 * * 1' },
  { label: 'First of month at 6am', expr: '0 6 1 * *' },
  { label: 'Every year', expr: '0 0 1 1 *' },
  { label: 'Weekdays at 8:30am', expr: '30 8 * * 1-5' },
]

function expandField(field: string, min: number, max: number): Set<number> | null {
  const out = new Set<number>()
  const parts = field.split(',')
  for (const part of parts) {
    const step = part.split('/')
    const stepN = step.length > 1 ? Number(step[1]) : 1
    const range = step[0].split('-')
    if (!Number.isFinite(stepN) || stepN < 1) return null
    let from = min
    let to = max
    if (range[0] !== '*') {
      const f = Number(range[0])
      if (!Number.isFinite(f)) return null
      from = f
      to = range[1] ? Number(range[1]) : f
      if (!Number.isFinite(to)) return null
    }
    if (range[0] !== '*' && step.length === 2 && !range[1]) { to = max }
    if (from > to) return null
    for (let i = from; i <= to; i += stepN) out.add(i)
  }
  return out
}

function nameField(field: string): string | null {
  const upper = field.toUpperCase()
  const m = MONTHS.indexOf(upper)
  if (m >= 0) return String(m + 1)
  const d = DAYS.indexOf(upper)
  if (d >= 0) return String(d)
  return null
}

function parseExpr(expr: string) {
  const fields = expr.trim().split(/\s+/)
  if (fields.length !== 5) return { error: 'Expected 5 fields: minute hour day-of-month month day-of-week' }
  const sets: (Set<number> | null)[] = []
  for (let i = 0; i < 5; i++) {
    const named = nameField(fields[i])
    const f = named ?? fields[i]
    const [min, max] = [RANGES.minute, RANGES.hour, RANGES.dom, RANGES.month, RANGES.dow][i]
    const s = expandField(f, min, max)
    if (!s) return { error: `Invalid "${fields[i]}" in ${FIELD_NAMES[i]} field` }
    if (i === 4 && s.has(7)) s.add(0)
    sets.push(s)
  }
  return { fields: sets, error: null }
}

function matches(date: Date, sets: Set<number>[]): boolean {
  const dow = date.getDay()
  return sets[0].has(date.getMinutes())
    && sets[1].has(date.getHours())
    && sets[2].has(date.getDate())
    && sets[3].has(date.getMonth() + 1)
    && sets[4].has(dow)
}

function nextRuns(expr: string, count: number): Date[] | null {
  const parsed = parseExpr(expr)
  if (parsed.error || !parsed.fields) return null
  const runs: Date[] = []
  const d = new Date()
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() + 1)
  const limit = new Date(d)
  limit.setFullYear(limit.getFullYear() + 2)
  while (runs.length < count && d <= limit) {
    if (parsed.fields.every(Boolean) && matches(d, parsed.fields as Set<number>[])) runs.push(new Date(d))
    d.setMinutes(d.getMinutes() + 1)
  }
  return runs
}

export default function CronParser() {
  const [expr, setExpr] = useState('*/15 * * * *')
  const [copied, setCopied] = useState(false)

  const parsed = parseExpr(expr)
  const runs = parsed.error ? null : nextRuns(expr, 5)

  const copy = async () => {
    if (!runs) return
    await navigator.clipboard.writeText(runs.map((d) => d.toLocaleString()).join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap gap-2.5">
        <input value={expr} onChange={(e) => setExpr(e.target.value)} spellCheck={false}
          className="flex-1 min-w-[200px] border px-3 py-2.5 font-mono text-zinc-900 dark:text-white bg-transparent outline-none focus:border-indigo-600" />
        <select onChange={(e) => { if (e.target.value) setExpr(e.target.value) }} value=""
          className="border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none text-sm">
          <option value="">Presets…</option>
          {PRESETS.map((p) => <option key={p.label} value={p.expr}>{p.label}</option>)}
        </select>
      </div>
      {parsed.error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{parsed.error}</p>}
      {parsed.fields && (
        <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-[13px]">
          {parsed.fields.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">{FIELD_NAMES[i]}</span>
              <span className="font-mono text-zinc-900 dark:text-white">{s ? [...s].sort((a, b) => a - b).slice(0, 14).join(', ') : '—'}{s && s.size > 14 ? ' …' : ''}</span>
            </div>
          ))}
        </div>
      )}
      {runs && (
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400">Next 5 runs (your local time)</div>
          <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 font-mono text-[13px]">
            {runs.map((d, i) => (
              <div key={i} className="flex justify-between px-3 py-2">
                <span>{d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span className="font-bold">{d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" onClick={copy}>{copied ? 'Copied!' : 'Copy schedule'}</Button>
        </div>
      )}
    </div>
  )
}
