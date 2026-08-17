import { useMemo, useState } from 'react'

const STOP = new Set('the a an and or but if then else for of to in on at by with from as is are was were be been being it its this that these those i you he she we they them their his her our your my me us have has had do does did not no nor so too very just can will would should could may might must about into over under again more most other some such only own same than all any each few both also when where what who whom which why how up down out off above below between among through during before after once here there'.split(' '))

export default function KeywordDensity() {
  const [text, setText] = useState('')
  const [minLen, setMinLen] = useState(3)
  const [limit, setLimit] = useState(20)

  const stats = useMemo(() => {
    const words = text.toLowerCase().match(/[a-z0-9']+/g) || []
    const total = words.length
    const counts = new Map<string, number>()
    for (const w of words) {
      if (w.length < minLen || STOP.has(w)) continue
      counts.set(w, (counts.get(w) || 0) + 1)
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
    return { total, top, counts: top.length }
  }, [text, minLen, limit])

  const max = stats.top.length ? stats.top[0][1] : 1

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Min word length</label>
        <input type="number" value={minLen} onChange={e => setMinLen(Math.max(1, +e.target.value))} className="border px-2 py-2 w-20" />
        <label className="font-semibold text-zinc-900 dark:text-white">Show top</label>
        <input type="number" value={limit} onChange={e => setLimit(Math.max(1, Math.min(100, +e.target.value)))} className="border px-2 py-2 w-20" />
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste text to analyze keyword density…" className="w-full h-[200px] border p-3 text-sm" />
      {stats.total > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500">{stats.total} words · {stats.counts} unique keywords</p>
          {stats.top.map(([w, c]) => {
            const pct = c / stats.total * 100
            return (
              <div key={w} className="flex items-center gap-2 text-sm">
                <span className="w-36 truncate font-medium text-zinc-900 dark:text-white">{w}</span>
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-4  overflow-hidden">
                  <div className="h-full bg-zinc-900 dark:bg-white" style={{ width: `${c / max * 100}%` }} />
                </div>
                <span className="w-20 text-right text-xs font-mono">{c}× ({pct.toFixed(2)}%)</span>
              </div>
            )
          })}
          <p className="text-[11px] text-zinc-500">Good SEO practice: target keyword density of roughly 0.5–2.5%.</p>
        </div>
      )}
    </div>
  )
}
