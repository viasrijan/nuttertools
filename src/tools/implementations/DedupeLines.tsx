import { useState } from 'react'

export default function DedupeLines() {
  const [input, setInput] = useState('apple\nbanana\napple\ncherry\nBanana\napple\n')
  const [sort, setSort] = useState(true)
  const [ignoreCase, setIgnoreCase] = useState(true)
  const [trim, setTrim] = useState(true)
  const [out, setOut] = useState('')

  const run = () => {
    let lines = input.split('\n')
    if (trim) lines = lines.map(l => l.trim())
    const seen = new Set<string>()
    const res: string[] = []
    for (const l of lines) {
      const key = ignoreCase ? l.toLowerCase() : l
      if (!seen.has(key)) { seen.add(key); res.push(l) }
    }
    if (sort) res.sort((a, b) => (ignoreCase ? a.toLowerCase() : a).localeCompare(ignoreCase ? b.toLowerCase() : b))
    setOut(res.join('\n'))
  }

  const stats = () => {
    const lines = input.split('\n').filter(l => l.trim() !== '')
    const uniq = new Set(ignoreCase ? lines.map(l => l.trim().toLowerCase()) : lines.map(l => l.trim()))
    return { total: lines.length, uniq: uniq.size, removed: lines.length - uniq.size }
  }

  const s = stats()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Stat label="Lines" value={s.total} />
        <Stat label="Unique" value={s.uniq} />
        <Stat label="Duplicates" value={s.removed} />
        <Stat label="Saved" value={`${s.removed ? Math.round((1 - s.uniq / s.total) * 100) : 0}%`} />
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={sort} onChange={e => setSort(e.target.checked)} />Sort A–Z</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={ignoreCase} onChange={e => setIgnoreCase(e.target.checked)} />Ignore case</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={trim} onChange={e => setTrim(e.target.checked)} />Trim spaces</label>
        <button onClick={run} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Dedupe</button>
        {out && <button onClick={() => navigator.clipboard.writeText(out)} className="px-4 h-9 border text-sm">Copy</button>}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-64 border p-3 font-mono text-xs" />
        <textarea value={out} readOnly className="w-full h-64 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" placeholder="Result" />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string, value: string | number }) {
  return <div className="border p-3 text-center"><div className="text-xl font-bold">{value}</div><div className="text-[11px] font-semibold text-zinc-500">{label}</div></div>
}
