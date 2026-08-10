import { useState } from 'react'

function format(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.getElementsByTagName('parsererror').length) throw new Error('Invalid XML')
  const out: string[] = []
  const walk = (n: Node, depth: number) => {
    const pad = '  '.repeat(depth)
    if (n.nodeType === 1) {
      const el = n as Element
      const kids = Array.from(el.childNodes)
      const textKids = kids.filter((k) => k.nodeType === 3 && k.textContent?.trim())
      if (textKids.length === kids.length && kids.length > 0) {
        out.push(`${pad}<${el.tagName}>${el.textContent?.trim() ?? ''}</${el.tagName}>`)
        return
      }
      if (kids.length === 0) {
        out.push(`${pad}<${el.tagName}/>`)
        return
      }
      out.push(`${pad}<${el.tagName}>`)
      kids.forEach((k) => walk(k, depth + 1))
      out.push(`${pad}</${el.tagName}>`)
    } else if (n.nodeType === 4 || n.nodeType === 8) {
      out.push(`${pad}${n.textContent}`)
    }
  }
  walk(doc.documentElement, 0)
  return out.join('\n')
}

function minify(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.getElementsByTagName('parsererror').length) throw new Error('Invalid XML')
  return new XMLSerializer().serializeToString(doc).replace(/>\s+</g, '><').trim()
}

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const run = (mode: 'format' | 'minify') => {
    try {
      setOutput(mode === 'format' ? format(input) : minify(input))
      setError('')
    } catch (e) {
      setOutput('')
      setError(e instanceof Error ? e.message : 'Invalid XML')
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          spellCheck={false}
          placeholder="Paste your XML here…"
          className="w-full border bg-transparent p-3 font-mono text-[13px] text-zinc-900 dark:text-white outline-none focus:border-indigo-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => run('format')} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold">Format</button>
        <button onClick={() => run('minify')} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold">Minify</button>
        <button onClick={() => { setInput(''); setOutput(''); setError('') }} className="px-5 h-10 text-sm font-semibold ring-1 ring-zinc-200 dark:ring-zinc-800">Clear</button>
      </div>
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      {output && (
        <div className="space-y-2">
          <textarea value={output} readOnly rows={10} spellCheck={false}
            className="w-full border bg-transparent p-3 font-mono text-[13px] text-zinc-900 dark:text-white outline-none" />
          <button onClick={copy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold">{copied ? 'Copied!' : 'Copy result'}</button>
        </div>
      )}
    </div>
  )
}
