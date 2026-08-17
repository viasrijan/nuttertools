import { useState } from 'react'

import { Button } from '../../components/ui/Button'

function explainRegex(pattern: string): string {
  const tokens = pattern.match(/\(?<!?[=!]?\\?[A-Za-z0-9_^$\\.*+?()[\]{}|/-]+|./g) || []
  const parts: string[] = []
  for (const t of tokens) {
    if (t === '^') parts.push('start of string')
    else if (t === '$') parts.push('end of string')
    else if (t === '.') parts.push('any character')
    else if (t === '*') parts.push('zero or more of previous')
    else if (t === '+') parts.push('one or more of previous')
    else if (t === '?') parts.push('optional (zero or one)')
    else if (t.startsWith('\\d')) parts.push('a digit [0-9]')
    else if (t.startsWith('\\w')) parts.push('a word character [A-Za-z0-9_]')
    else if (t.startsWith('\\s')) parts.push('whitespace')
    else if (t.startsWith('\\b')) parts.push('word boundary')
    else if (t.startsWith('\\n')) parts.push('newline')
    else if (t.startsWith('\\t')) parts.push('tab')
    else if (t.startsWith('[')) parts.push(`character class ${t}`)
    else if (t.startsWith('(')) parts.push(`group ${t}`)
    else if (/^[A-Za-z0-9]/.test(t)) parts.push(`literal "${t}"`)
    else if (t) parts.push(`"${t}"`)
  }
  return parts.join(' → ') || 'no tokens'
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b')
  const [flags, setFlags] = useState('gi')
  const [text, setText] = useState('Contact me at john@example.com or mary@test.org today.')
  const [error, setError] = useState('')
  const [matches, setMatches] = useState<{ index: number, match: string, groups: string }[]>([])

  const test = () => {
    setError('')
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      const res: { index: number, match: string, groups: string }[] = []
      let m: RegExpExecArray | null
      while ((m = re.exec(text)) !== null) {
        res.push({ index: m.index, match: m[0], groups: m.slice(1).join(' | ') || '—' })
        if (m.index === re.lastIndex) re.lastIndex++
      }
      setMatches(res)
    } catch (e: any) { setError(e.message); setMatches([]) }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2.5">
        <input value={pattern} onChange={e => setPattern(e.target.value)} className="flex-1 min-w-[200px] border px-3 h-10 font-mono text-sm" placeholder="/pattern/flags" />
        <input value={flags} onChange={e => setFlags(e.target.value)} className="border px-3 h-10 font-mono text-sm w-16" placeholder="gi" />
        <Button variant="secondary" onClick={test}>Test</Button>
      </div>
      <div className="border p-3 text-xs bg-zinc-50 dark:bg-zinc-800">
        <span className="font-bold uppercase tracking-wider text-zinc-500 text-[10px]">Explanation · </span>
        {error ? <span className="text-red-500">{error}</span> : explainRegex(pattern)}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-32 border p-3 text-sm" />
      <div>
        <p className="text-sm font-semibold mb-2">{matches.length} match{matches.length === 1 ? '' : 'es'}</p>
        <div className="max-h-56 overflow-auto space-y-1">
          {matches.map((m, i) => (
            <div key={i} className="border px-3 py-2 text-sm flex gap-3">
              <span className="font-mono text-xs text-zinc-500 pt-0.5">@{m.index}</span>
              <code className="font-mono break-all">{m.match}</code>
              {m.groups !== '—' && <span className="text-xs text-zinc-500 pt-0.5">groups: {m.groups}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
