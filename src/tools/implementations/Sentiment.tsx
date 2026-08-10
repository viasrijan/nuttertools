import { useState } from 'react'
import { aiText } from '../../lib/ai'

type Sentiment = { label: string, score: number, emoji: string }

const POSITIVE = ['good', 'great', 'love', 'awesome', 'happy', 'excellent', 'amazing', 'best', 'wonderful', 'nice', 'enjoy', 'glad', 'fantastic', 'perfect']
const NEGATIVE = ['bad', 'hate', 'terrible', 'awful', 'worst', 'sad', 'angry', 'disappoint', 'poor', 'horrible', 'sucks', 'annoying', 'ugly', 'boring', 'worried', 'fear']

export function heuristicSentiment(text: string): Sentiment {
  const words = text.toLowerCase().split(/\W+/)
  let p = 0, n = 0
  words.forEach(w => { if (POSITIVE.includes(w)) p++; if (NEGATIVE.includes(w)) n++ })
  if (p === n) return { label: 'Neutral', score: 0.5, emoji: '😐' }
  if (p > n) return { label: 'Positive', score: 0.5 + 0.3 * (p / (p + n)), emoji: '😊' }
  return { label: 'Negative', score: 0.5 - 0.3 * (n / (p + n)), emoji: '😞' }
}

export default function Sentiment() {
  const [text, setText] = useState('')
  const [res, setRes] = useState<Sentiment | null>(null)
  const [busy, setBusy] = useState(false)
  const [usedAI, setUsedAI] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!text.trim()) return
    setBusy(true); setError(''); setUsedAI(false)
    try {
      const out = await aiText(`Analyze the sentiment of this text. Reply with exactly one word: positive, negative, or neutral.\n\nText: ${text}`, { system: 'You are a sentiment analyzer.' })
      const w = out.toLowerCase()
      let label: Sentiment['label'] = 'Neutral'
      if (w.includes('positive')) label = 'Positive'
      else if (w.includes('negative')) label = 'Negative'
      const base = heuristicSentiment(text)
      setRes({ label, score: label === 'Neutral' ? 0.5 : base.score, emoji: label === 'Positive' ? '😊' : label === 'Negative' ? '😞' : '😐' })
      setUsedAI(true)
    } catch (e: any) {
      setRes(heuristicSentiment(text))
      setError('AI offline — used keyword fallback: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-3 h-32 text-sm" placeholder="How does this text feel?…" />
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Analyzing…' : 'Analyze'}</button>
      {error && <p className="text-xs text-zinc-500">{error}</p>}
      {res && (
        <div className="border p-4 flex items-center gap-4">
          <span className="text-4xl">{res.emoji}</span>
          <div>
            <p className="text-lg font-bold">{res.label}</p>
            <p className="text-sm text-zinc-500">Confidence {(res.score > 0.5 ? res.score : 1 - res.score).toFixed(0)}%{usedAI ? ' · AI' : ' · fallback'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
