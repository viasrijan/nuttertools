import { useState } from 'react'
import { aiText } from '../../lib/ai'

const STYLES = ['Haiku', 'Sonnet', 'Free verse', 'Rhyming', 'Acrostic']

export default function PoemGenerator() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('Free verse')
  const [res, setRes] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!topic.trim()) { setError('Enter a topic first.'); return }
    setBusy(true); setError('')
    try {
      setRes(await aiText(`Write a ${style.toLowerCase()} poem about: ${topic}.`, { system: 'You are a creative poet.' }))
    } catch (e: any) {
      const words = topic.trim().split(/\s+/)
      setRes(`In lands of ${words[0] || 'thought'}, where dreams take flight,\nI wander through the quiet night.\nThe ${words.slice(-1)[0] || 'stillness'} whispers, soft and low,\nA gentle truth the heart should know.`)
      setError('AI offline — showing a fallback verse.')
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full border px-3 h-10 text-sm" placeholder="Topic, e.g. the sea at midnight" />
      <div className="flex flex-wrap gap-2">
        {STYLES.map(s => <button key={s} onClick={() => setStyle(s)} className={`px-3 h-9 text-sm border ${style === s ? 'bg-zinc-900 text-white' : ''}`}>{s}</button>)}
      </div>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Composing…' : 'Write poem'}</button>
      {error && <p className="text-xs text-zinc-500">{error}</p>}
      {res && <p className="text-sm whitespace-pre-wrap border p-4 leading-7">{res}</p>}
    </div>
  )
}
