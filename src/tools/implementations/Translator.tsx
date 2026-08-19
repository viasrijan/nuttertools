import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

import { translateText } from '../../lib/ai'

const LANGS: [string, string][] = [
  ['auto', 'Auto-detect'], ['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['de', 'German'],
  ['it', 'Italian'], ['pt', 'Portuguese'], ['nl', 'Dutch'], ['ru', 'Russian'], ['zh', 'Chinese'],
  ['ja', 'Japanese'], ['ko', 'Korean'], ['ar', 'Arabic'], ['hi', 'Hindi'], ['tr', 'Turkish'],
  ['pl', 'Polish'], ['sv', 'Swedish'], ['id', 'Indonesian'], ['vi', 'Vietnamese'], ['th', 'Thai'],
]

export default function Translator() {
  const [text, setText] = useState('')
  const [from, setFrom] = useState('auto')
  const [to, setTo] = useState('es')
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!text.trim()) return
    setBusy(true); setError('')
    try {
      setResult(await translateText(text, from, to))
    } catch (e: any) { setError('Translation failed: ' + e.message) }
    setBusy(false)
  }

  const swap = () => { setFrom(to); setTo(from) }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-3 h-32 text-sm" placeholder="Text to translate…" />
      <div className="flex items-center gap-2">
        <select value={from} onChange={e => setFrom(e.target.value)} className="border px-2 h-9 text-sm bg-transparent flex-1">
          {LANGS.map(l => <option key={l[0]} value={l[0]}>{l[1]}</option>)}
        </select>
        <button onClick={swap} title="Swap languages" className="px-3 h-9 text-sm font-bold text-zinc-900 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_1px_2px_rgba(0,0,0,0.18),0_6px_16px_-6px_rgba(245,158,11,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95">⇄</button>
        <select value={to} onChange={e => setTo(e.target.value)} className="border px-2 h-9 text-sm bg-transparent flex-1">
          {LANGS.filter(l => l[0] !== 'auto').map(l => <option key={l[0]} value={l[0]}>{l[1]}</option>)}
        </select>
      </div>
      <Button variant="secondary" onClick={run} disabled={busy} isLoading={busy}>Translate</Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && (
        <div className="space-y-3">
          <p className="text-sm border p-3">{result}</p>
          <CopyButton value={result} />
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Powered by Google's free translation endpoint.</p>
    </div>
  )
}
