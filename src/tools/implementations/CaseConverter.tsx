import { useState } from 'react'
import { Select } from '../../components/ui/Select'

const trans: [string, (s: string) => string][] = [
  ['UPPERCASE', s => s.toUpperCase()],
  ['lowercase', s => s.toLowerCase()],
  ['Title Case', s => s.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase())],
  ['Sentence case', s => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase())],
  ['camelCase', s => s.toLowerCase().replace(/[\s_-]+(.)/g, (_, c) => c.toUpperCase())],
  ['snake_case', s => s.trim().replace(/[\s-]+/g, '_').toLowerCase()],
  ['kebab-case', s => s.trim().replace(/[\s_]+/g, '-').toLowerCase()],
  ['aLtErNaTiNg', s => s.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('')],
]

export default function CaseConverter() {
  const [text, setText] = useState('the quick brown fox jumps over the lazy dog')
  const [active, setActive] = useState(0)
  const converted = trans[active][1](text)
  return (
    <div className="space-y-5 max-w-2xl">
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-32 p-3 bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
      <div className="max-w-[280px]">
        <Select label="Case" value={active} onChange={(v) => setActive(Number(v))} options={trans.map(([label], i) => ({ v: String(i), label }))} />
      </div>
      <div className="p-4 bg-zinc-100 dark:bg-zinc-800 min-h-[80px] font-mono text-sm whitespace-pre-wrap break-words">
        {converted || '…'}
      </div>
      <button onClick={() => navigator.clipboard.writeText(converted)} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Copy result</button>
    </div>
  )
}