import { useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'

import * as yaml from 'js-yaml'

export default function JsonYaml() {
  const [input, setInput] = useState('{"name": "NutterTools", "free": true, "tags": ["privacy", "offline"], "rating": 4.9}')
  const [mode, setMode] = useState<'auto' | 'j2y' | 'y2j'>('auto')

  const converted = useMemo(() => {
    try {
      if (mode === 'j2y') return { ok: true as const, text: yaml.dump(JSON.parse(input), { indent: 2 }) }
      if (mode === 'y2j') return { ok: true as const, text: JSON.stringify(yaml.load(input), null, 2) }
      const t = input.trim()
      if (t.startsWith('{') || t.startsWith('[')) return { ok: true as const, text: yaml.dump(JSON.parse(input), { indent: 2 }) }
      return { ok: true as const, text: JSON.stringify(yaml.load(input), null, 2) }
    } catch (e: any) {
      return { ok: false as const, msg: 'Invalid input: ' + e.message }
    }
  }, [input, mode])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 text-sm">
        {([['auto', 'Auto detect'], ['j2y', 'JSON → YAML'], ['y2j', 'YAML → JSON']] as const).map(([k, l]) => (
          <Button variant="outline" key={k} onClick={() => setMode(k)} className={`px-4 h-9 text-sm  ${mode === k ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{l}</Button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON or YAML…" className="w-full h-[200px] border p-3 text-sm font-mono" />
      <Button variant="secondary" onClick={() => navigator.clipboard.writeText(converted.ok ? converted.text : '')}>Convert & copy</Button>
      {converted.ok
        ? <pre className="border p-3 text-xs max-h-[260px] overflow-auto whitespace-pre-wrap">{converted.text}</pre>
        : <p className="text-sm text-red-600">{converted.msg}</p>}
    </div>
  )
}
