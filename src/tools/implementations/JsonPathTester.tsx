import { useState } from 'react'

export default function JsonPathTester() {
  const [json, setJson] = useState('{\n  "store": {\n    "book": [\n      { "title": "A", "price": 8.95 },\n      { "title": "B", "price": 12.99 }\n    ]\n  }\n}')
  const [path, setPath] = useState('$.store.book[*].title')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const evaluate = () => {
    setError(''); setResult('')
    let data: any
    try { data = JSON.parse(json) } catch (e: any) { setError('Invalid JSON: ' + e.message); return }
    try {
      const matches = evalJsonPath(data, path.trim())
      setResult(JSON.stringify(matches, null, 2))
    } catch (e: any) { setError('Path error: ' + e.message) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-1.5">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">JSON document</span>
        <textarea value={json} onChange={(e) => setJson(e.target.value)} rows={8} className="w-full p-3 font-mono text-[13px] leading-relaxed bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
      </div>
      <div className="space-y-1.5">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">JSONPath expression</span>
        <div className="flex flex-wrap gap-2">
          <input value={path} onChange={(e) => setPath(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && evaluate()} className="flex-1 min-w-[200px] h-10 px-3 font-mono text-sm bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" placeholder="$..book[?(@.price<10)].title" />
          <button onClick={evaluate} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Run query</button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['$', '..', '.*', '[*]', '[?(@.price<10)]'].map((s) => (
            <button key={s} onClick={() => setPath((p) => p + s)} className="px-2.5 h-7 text-[11px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">{s}</button>
          ))}
        </div>
      </div>
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
      {result && (
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Matches ({result === '[]' ? 0 : 1} node{result === '[]' ? '' : ' set'})</span>
          <pre className="p-3 bg-zinc-100 dark:bg-zinc-800 font-mono text-[12.5px] leading-relaxed overflow-auto max-h-72 whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
}

const isObj = (v: any) => v !== null && typeof v === 'object'

function evalJsonPath(root: any, path: string): any[] {
  const s = path.replace(/^\$/, '').trim()
  let nodes: any[] = [root]
  let i = 0
  while (i < s.length && nodes.length) {
    const c = s[i]
    if (c === '.') {
      if (s[i + 1] === '.') {
        i += 2
        const name = readName(s, i)
        i += name.length
        const all: any[] = []
        for (const n of nodes) collectChildren(n, all)
        nodes = name === '*' ? all.filter((x) => !isObj(x)) : all.map((n) => n?.[name])
      } else {
        i++
        const name = readName(s, i)
        i += name.length
        nodes = nodes.map((n) => (isObj(n) ? n[name] : undefined))
      }
      continue
    }
    if (c === '[') {
      const end = s.indexOf(']', i)
      if (end < 0) throw new Error('unbalanced brackets')
      const inner = s.slice(i + 1, end).trim()
      i = end + 1
      const next: any[] = []
      for (const n of nodes) {
        if (!Array.isArray(n)) continue
        if (inner === '*') { next.push(...n); continue }
        for (const part of inner.split(',').map((x) => x.trim())) {
          if (/^\d+$/.test(part)) next.push(n[parseInt(part)])
          else if (part.startsWith('?(') && part.endsWith(')')) {
            const expr = part.slice(2, -1)
            n.forEach((item, idx) => {
              try {
                const fn = new Function('v', 'i', `with (v ?? {}) { return !!(${expr}) }`)
                if (fn(item, idx)) next.push(item)
              } catch { /* invalid filter */ }
            })
          } else if (/^-?\d+:-?\d*$/.test(part)) {
            const [a, b] = part.split(':')
            const slice = n.slice(parseInt(a), b ? parseInt(b) : undefined)
            next.push(...slice)
          }
        }
      }
      nodes = next
      continue
    }
    throw new Error(`unexpected token "${c}"`)
  }
  return nodes.filter((n) => n !== undefined)
}

function readName(s: string, i: number): string {
  let j = i
  while (j < s.length && /[A-Za-z0-9_$]/.test(s[j])) j++
  return s.slice(i, j) || '*'
}

function collectChildren(v: any, out: any[]): void {
  if (Array.isArray(v)) for (const x of v) { out.push(x); collectChildren(x, out) }
  else if (isObj(v)) for (const k of Object.keys(v)) { out.push(v[k]); collectChildren(v[k], out) }
}