import { useState } from 'react'
import { aiText } from '../../lib/ai'

export default function Summarizer() {
  const [text, setText] = useState('')
  const [res, setRes] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [fallback, setFallback] = useState(false)

  const run = async () => {
    if (text.trim().split(/\s+/).length < 20) { setError('Please paste at least 20 words to summarize.'); return }
    setBusy(true); setError(''); setRes(''); setFallback(false)
    try {
      setRes(await aiText(`Summarize the following text in 3-4 concise sentences. Preserve key facts.\n\n${text}`, { system: 'You are a summarization assistant.' }))
    } catch (e: any) {
      setError('AI offline — showing extractive fallback: ' + e.message)
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
      const scored = sentences.map((s, i) => ({ s, score: s.split(/\s+/).length }))
      setRes(scored.sort((a, b) => b.score - a.score).slice(0, 3).sort((a, b) => sentences.indexOf(a.s) - sentences.indexOf(b.s)).map(x => x.s.trim()).join(' '))
      setFallback(true)
    }
    setBusy(false)
  }

  const count = text.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-4 max-w-xl">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-3 h-48 text-sm" placeholder="Paste a long article or document…" />
      <p className="text-xs text-zinc-500">{count} words</p>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Summarizing…' : 'Summarize'}</button>
      {error && <p className="text-xs text-zinc-500">{error}</p>}
      {res && (
        <div className="space-y-2">
          <p className="text-sm border p-3">{res}</p>
          {fallback && <p className="text-[11px] text-zinc-400">Extractive summary (top 3 sentences by length).</p>}
        </div>
      )}
    </div>
  )
}
