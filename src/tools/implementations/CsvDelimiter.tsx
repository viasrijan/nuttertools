import { useState } from 'react'
import { Select } from '../../components/ui/Select'
import { Result } from '../../components/ui/Result'

const DELIMS = [
  { v: ',', label: 'Comma ,' },
  { v: '\\t', label: 'Tab \\t' },
  { v: ';', label: 'Semicolon ;' },
  { v: '|', label: 'Pipe |' },
  { v: '^', label: 'Caret ^' },
]

function parseCsv(text: string, delim: string): string[][] {
  const d = delim === '\\t' ? '\t' : delim
  const rows: string[][] = []
  let row: string[] = [], field = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQ = false
      } else field += ch
    } else if (ch === '"') inQ = true
    else if (ch === d) { row.push(field); field = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(field); field = ''
      if (row.some((f) => f.length > 0) || row.length > 1) rows.push(row)
      row = []
    } else field += ch
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

export default function CsvDelimiter() {
  const [input, setInput] = useState('name,age,city\n"Smith, John",30,"New York"\nDoe,25,Boston')
  const [from, setFrom] = useState(',')
  const [to, setTo] = useState('|')
  const [quote, setQuote] = useState(true)

  const rows = parseCsv(input, from)
  const out = rows.map((r) => r.map((f) => (quote ? `"${f.replace(/"/g, '""')}"` : f)).join(to === '\\t' ? '\t' : to)).join('\n')

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select label="From delimiter" value={from} onChange={setFrom} options={DELIMS} />
        <Select label="To delimiter" value={to} onChange={setTo} options={DELIMS} />
        <label className="flex items-end gap-2 pb-2.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
          <input type="checkbox" checked={quote} onChange={(e) => setQuote(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
          Quote all fields
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Input</span>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={9} className="w-full p-3 font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </div>
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Output</span>
          <textarea readOnly value={out} rows={9} className="w-full p-3 font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none" />
        </div>
      </div>
      <div className="grid gap-2 max-w-md">
        <Result label="Rows parsed" value={rows.length} />
        <Result label="Columns (first row)" value={rows[0]?.length ?? 0} />
      </div>
    </div>
  )
}