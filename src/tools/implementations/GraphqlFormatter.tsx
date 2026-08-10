import { useMemo, useState } from 'react'

type Tok = { type: 'name' | 'string' | 'comment' | 'punct' | 'num', v: string }

function tokenize(input: string): Tok[] {
  const out: Tok[] = []
  const s = input
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (/\s/.test(c)) { i++; continue }
    if (c === '#') { const j = s.indexOf('\n', i); const line = s.slice(i, j === -1 ? s.length : j); out.push({ type: 'comment', v: line }); i += line.length; continue }
    if (c === '"') {
      let j = i + 1, esc = false
      while (j < s.length && (esc || s[j] !== '"')) { if (s[j] === '\\' && !esc) esc = true; else esc = false; j++ }
      out.push({ type: 'string', v: s.slice(i, Math.min(j + 1, s.length)) }); i = Math.min(j + 1, s.length); continue
    }
    if (/[a-zA-Z_]/.test(c)) { let j = i; while (j < s.length && /[a-zA-Z0-9_\-]/.test(s[j])) j++; out.push({ type: 'name', v: s.slice(i, j) }); i = j; continue }
    if (/[0-9]/.test(c)) { let j = i; while (j < s.length && /[0-9.\-]/.test(s[j])) j++; out.push({ type: 'num', v: s.slice(i, j) }); i = j; continue }
    out.push({ type: 'punct', v: c }); i++
  }
  return out
}

function formatGraphql(input: string): string {
  const toks = tokenize(input)
  let out = '', indent = 0
  const nl = () => { out = out.replace(/[ ]+$/, ''); out += '\n' + '  '.repeat(indent) }
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k]
    if (t.type === 'comment') { out += '# ' + t.v.slice(1).trim(); nl(); continue }
    if (t.type === 'string') { out += t.v; continue }
    if (t.type === 'punct') {
      if (t.v === '{') { out += ' {'; indent++; nl() }
      else if (t.v === '}') { indent = Math.max(0, indent - 1); nl(); out += '}' }
      else if (t.v === ')' && out.trimEnd().endsWith('(')) out = out.trimEnd() + ')'
      else if (t.v === ')' ) out += ')'
      else if (t.v === '(') out += '('
      else if (t.v === ':') out += ': '
      else if (t.v === ',') out = out.replace(/[ ]+$/, '') + ','
      else if (t.v === '=') out += ' = '
      else out += t.v
      continue
    }
    const prev = toks[k - 1]
    if (t.type === 'name' && prev && prev.type === 'name') { out = out.replace(/[ ]+$/, ''); out += ' ' }
    if (t.type === 'num' && prev && prev.type === 'punct' && prev.v === '(') { out += t.v; continue }
    out += t.v
  }
  return out.trim()
}

export default function GraphqlFormatter() {
  const [input, setInput] = useState('query getUser($id:ID!){user(id:$id){id name posts{title}}}')
  const out = useMemo(() => formatGraphql(input), [input])

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste GraphQL query / SDL…" className="w-full h-[240px] border p-3 text-sm font-mono" />
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(out)} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Format & copy</button>
        <button onClick={() => setInput(out)} className="px-5 h-10 border text-sm">Use output</button>
      </div>
      <pre className="border p-3 text-xs max-h-[300px] overflow-auto whitespace-pre-wrap">{out}</pre>
    </div>
  )
}
