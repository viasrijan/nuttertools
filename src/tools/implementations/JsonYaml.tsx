import { useState } from 'react'
import * as yaml from 'js-yaml'

export default function JsonYaml() {
  const [input, setInput] = useState('{"name": "NutterTools", "free": true, "tags": ["privacy", "offline"], "rating": 4.9}')
  const [mode, setMode] = useState<'auto' | 'j2y' | 'y2j'>('auto')
  const [error, setError] = useState('')

  const convert = () => {
    try {
      setError('')
      if (mode === 'j2y') return yaml.dump(JSON.parse(input), { indent: 2 })
      if (mode === 'y2j') return JSON.stringify(yaml.load(input), null, 2)
      const t = input.trim()
      if (t.startsWith('{') || t.startsWith('[')) return yaml.dump(JSON.parse(input), { indent: 2 })
      return JSON.stringify(yaml.load(input), null, 2)
    } catch (e: any) {
      setError('Invalid input: ' + e.message)
      return ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-sm">
        {([['auto', 'Auto detect'], ['j2y', 'JSON → YAML'], ['y2j', 'YAML → JSON']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setMode(k)} className={`px-4 h-9 text-sm border ${mode === k ? 'bg-zinc-900 text-white' : ''}`}>{l}</button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON or YAML…" className="w-full h-[200px] border p-3 text-sm font-mono" />
      <button onClick={() => navigator.clipboard.writeText(convert())} className="px-5 h-10 bg-zinc-900 text-white text-sm">Convert & copy</button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!error && <pre className="border p-3 text-xs max-h-[260px] overflow-auto whitespace-pre-wrap">{convert()}</pre>}
    </div>
  )
}
