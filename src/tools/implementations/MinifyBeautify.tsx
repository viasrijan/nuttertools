import { useState } from 'react'

const TYPES = ['json', 'html', 'css', 'javascript'] as const

function minifyJson(s: string) { return JSON.stringify(JSON.parse(s)) }
function beautifyJson(s: string) { return JSON.stringify(JSON.parse(s), null, 2) }

function minifyHtml(s: string) {
  return s.replace(/\s+/g, ' ').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim()
}
function beautifyHtml(s: string) {
  let depth = 0
  return minifyHtml(s).replace(/<\/?[\w][^>]*>/g, tag => {
    if (/^<\//.test(tag)) depth--
    const out = '\n' + '  '.repeat(Math.max(0, depth)) + tag
    if (!/^<\//.test(tag) && !/\/>$/.test(tag)) depth++
    return out
  })
}

function minifyJs(s: string) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim()
}

export default function MinifyBeautify() {
  const [type, setType] = useState<(typeof TYPES)[number]>('json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const run = (action: 'minify' | 'beautify') => {
    setError('')
    try {
      let out = ''
      if (type === 'json') out = action === 'minify' ? minifyJson(input) : beautifyJson(input)
      else if (type === 'html') out = action === 'minify' ? minifyHtml(input) : beautifyHtml(input)
      else if (type === 'css') out = action === 'minify' ? input.replace(/\s+/g, ' ').trim() : input
      else out = action === 'minify' ? minifyJs(input) : input
      setOutput(out)
    } catch (e: any) { setError(e.message) }
  }

  const stats = {
    in: input.length,
    out: output.length,
    saved: Math.max(0, input.length - output.length),
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TYPES.map(t => (
          <button key={t} onClick={() => { setType(t); setOutput('') }} className={`px-3 h-9 text-sm border ${type === t ? 'bg-zinc-900 text-white' : ''}`}>{t}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => run('minify')} className="px-4 h-9 bg-zinc-900 text-white text-sm">Minify</button>
        <button onClick={() => run('beautify')} className="px-4 h-9 border text-sm">Beautify</button>
        {output && (
          <>
            <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 h-9 border text-sm">Copy</button>
            <span className="text-xs font-medium self-center text-zinc-500">{stats.in} → {stats.out} chars ({stats.saved} saved)</span>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-80 border p-3 font-mono text-xs" placeholder="Paste input" />
        <textarea value={output} readOnly className="w-full h-80 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" placeholder="Output" />
      </div>
    </div>
  )
}
