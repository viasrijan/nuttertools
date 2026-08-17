import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

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
    <div className="space-y-5">
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
        <Button variant="secondary" size="sm" onClick={run}>Dedupe</Button>
        {out && <CopyButton value={out} />}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-64 border p-3 font-mono text-xs" />
        <textarea value={out} readOnly className="w-full h-64 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" placeholder="Result" />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string, value: string | number }) {
  return <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 text-center transition-all duration-200"><div className="text-xl font-bold">{value}</div><div className="text-[11px] font-semibold text-zinc-500">{label}</div></div>
}
