import { useState } from 'react'

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
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-32 border p-3 text-sm" />
      <div className="flex flex-wrap gap-2">
        {trans.map(([label], i) => (
          <button key={label} onClick={() => setActive(i)}
            className={`px-3 h-9 text-sm border ${active === i ? 'bg-zinc-900 text-white' : ''}`}>{label}</button>
        ))}
      </div>
      <div className="border p-4 bg-zinc-50 dark:bg-zinc-800 min-h-[80px] font-mono text-sm whitespace-pre-wrap break-words">
        {trans[active][1](text) || '…'}
      </div>
      <button onClick={() => navigator.clipboard.writeText(trans[active][1](text))} className="px-4 h-9 bg-zinc-900 text-white text-sm">Copy result</button>
    </div>
  )
}
