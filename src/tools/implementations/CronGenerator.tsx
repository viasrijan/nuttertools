import { useState } from 'react'

const EXPLAIN: Record<string, string> = {
  '0': 'Sunday (0) or month names',
  '1': 'January (1) or Monday (1)',
  '2': 'February (2) or Tuesday (2)',
  '3': 'March (3) or Wednesday (3)',
  '4': 'April (4) or Thursday (4)',
  '5': 'May (5) or Friday (5)',
  '6': 'June (6) or Saturday (6)',
  '7': 'July (7) or Sunday (7)',
  '*': 'Every value',
  '?': 'No specific value',
}

export default function CronGenerator() {
  const [fields, setFields] = useState({ min: '*', hour: '*', dom: '*', mon: '*', dow: '*' })
  const [input, setInput] = useState('*/5 * * * *')

  const cron = () => `${fields.min} ${fields.hour} ${fields.dom} ${fields.mon} ${fields.dow}`

  const describe = () => {
    const [m, h, dom, mon, dow] = cron().split(/\s+/).map(s => s.trim())
    const parts: string[] = []
    if (dow !== '*' && dow !== '?') parts.push(`on ${dow === '0' || dow === '7' ? 'Sunday' : dow === '1' ? 'Monday' : dow === '2' ? 'Tuesday' : dow === '3' ? 'Wednesday' : dow === '4' ? 'Thursday' : dow === '5' ? 'Friday' : dow === '6' ? 'Saturday' : `day ${dow}`}`)
    if (dom !== '*' && dom !== '?') parts.push(`on day ${dom} of month`)
    if (mon !== '*') parts.push(`in month ${mon}`)
    const time: string[] = []
    if (h === '*') time.push('every hour')
    else if (h.startsWith('*/')) time.push(`every ${h.slice(2)} hours`)
    else time.push(`at hour ${h}`)
    if (m === '*') time.push('every minute')
    else if (m.startsWith('*/')) time.push(`every ${m.slice(2)} minutes`)
    else time.push(`at minute ${m}`)
    return `Runs ${time.join(', ')}${parts.length ? ' ' + parts.join(', ') : ''}.`
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <p className="text-sm font-semibold mb-2">Fields (minute hour day-of-month month day-of-week)</p>
        <div className="grid grid-cols-5 gap-2">
          {(['min', 'hour', 'dom', 'mon', 'dow'] as const).map(k => (
            <label key={k} className="block text-center">
              <input value={fields[k]} onChange={e => setFields({ ...fields, [k]: e.target.value })} className="w-full border px-2 h-10 text-center font-mono text-sm" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{k}</span>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {['*', '0', '5', '10', '15', '30', '*/5', '*/15', '?', '1-5', '1,15'].map(v => (
            <button key={v} onClick={() => setFields({ ...fields, dow: v === '?' || /^\d$|^\d-\d|,/.test(v) && /^\d$|^\d-\d|,/.test(v) ? v : fields.dow })} className="px-2 h-7 border text-xs font-mono">{v}</button>
          ))}
        </div>
      </div>
      <div className="border p-4 bg-zinc-50 dark:bg-zinc-800">
        <code className="font-mono text-lg">{cron()}</code>
        <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-300">{describe()}</p>
      </div>
      <div>
        <label className="text-sm font-semibold">Decode a cron expression</label>
        <input value={input} onChange={e => setInput(e.target.value)} className="w-full border px-3 h-10 font-mono text-sm mt-1" placeholder="*/5 * * * *" />
        <button onClick={() => { const p = input.split(/\s+/); if (p.length === 5) setFields({ min: p[0], hour: p[1], dom: p[2], mon: p[3], dow: p[4] }) }} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm mt-2">Decode</button>
      </div>
    </div>
  )
}
