import { useMemo, useState } from 'react'

const NAMED: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', copy: '©', reg: '®', trade: '™',
  hellip: '…', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  laquo: '«', raquo: '»', euro: '€', pound: '£', yen: '¥', cent: '¢', deg: '°', plusmn: '±',
  times: '×', divide: '÷', middot: '·', bull: '•', rarr: '→', larr: '←', uarr: '↑', darr: '↓',
}

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState('<h1>Hello & welcome!</h1>\n<p>Café → 100% privacy</p>')
  const [mode, setMode] = useState<'special' | 'all'>('special')

  const encoded = useMemo(() => {
    const nbsp = input.replace(/\u00a0/g, '&nbsp;')
    const special = nbsp.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    if (mode === 'special') return special
    return special.replace(/[^\x00-\x7F]/g, c => '&#' + c.codePointAt(0) + ';')
  }, [input, mode])

  const decoded = useMemo(() => {
    return input
      .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
      .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, name) => NAMED[name] ?? m)
  }, [input])

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste HTML or text…" className="w-full h-[160px] border p-3 text-sm font-mono" />
      <div className="flex flex-wrap gap-2 text-sm">
        <button onClick={() => setMode('special')} className={`px-4 h-9 border ${mode === 'special' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>Encode &lt; &gt; " '</button>
        <button onClick={() => setMode('all')} className={`px-4 h-9 border ${mode === 'all' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>Encode non-ASCII</button>
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Encoded</label>
          <pre className="border p-3 text-xs font-mono mt-1 max-h-[200px] overflow-auto whitespace-pre-wrap break-all">{encoded}</pre>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Decoded</label>
          <pre className="border p-3 text-xs font-mono mt-1 max-h-[200px] overflow-auto whitespace-pre-wrap break-all">{decoded}</pre>
        </div>
      </div>
      <button onClick={() => navigator.clipboard.writeText(encoded)} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy encoded</button>
    </div>
  )
}
