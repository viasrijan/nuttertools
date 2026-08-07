import { useState } from 'react'
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
    <div className="space-y-4 max-w-xl">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-3 h-32 text-sm" placeholder="Text to translate…" />
      <div className="flex items-center gap-2">
        <select value={from} onChange={e => setFrom(e.target.value)} className="border px-2 h-9 text-sm bg-transparent flex-1">
          {LANGS.map(l => <option key={l[0]} value={l[0]}>{l[1]}</option>)}
        </select>
        <button onClick={swap} title="Swap languages" className="px-3 h-9 border text-sm">⇄</button>
        <select value={to} onChange={e => setTo(e.target.value)} className="border px-2 h-9 text-sm bg-transparent flex-1">
          {LANGS.filter(l => l[0] !== 'auto').map(l => <option key={l[0]} value={l[0]}>{l[1]}</option>)}
        </select>
      </div>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Translating…' : 'Translate'}</button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && (
        <div className="space-y-2">
          <p className="text-sm border p-3">{result}</p>
          <button onClick={() => navigator.clipboard.writeText(result)} className="px-4 h-9 border text-sm">Copy</button>
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Powered by Google's free translation endpoint.</p>
    </div>
  )
}
