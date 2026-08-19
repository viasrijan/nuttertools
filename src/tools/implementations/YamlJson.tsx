import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

import { load, dump } from 'js-yaml'

const SAMPLE_YAML = `name: NutterTools
version: 1.0.0
tools:
  - id: json-formatter
    implemented: true
  - id: video-compressor
    implemented: false
deploy:
  provider: github-pages
  branch: main
`

const SAMPLE_JSON = `{
  "name": "NutterTools",
  "version": "1.0.0",
  "tools": [
    { "id": "json-formatter", "implemented": true },
    { "id": "video-compressor", "implemented": false }
  ],
  "deploy": { "provider": "github-pages", "branch": "main" }
}`

export default function YamlJson() {
  const [y, setY] = useState(SAMPLE_YAML)
  const [j, setJ] = useState(SAMPLE_JSON)
  const [tab, setTab] = useState<'y2j' | 'j2y'>('y2j')
  const [error, setError] = useState('')

  const y2j = () => {
    setError('')
    try { setJ(JSON.stringify(load(y), null, 2)) } catch (e: any) { setError(e.message) }
  }
  const j2y = () => {
    setError('')
    try { setY(dump(JSON.parse(j), { indent: 2 })) } catch (e: any) { setError(e.message) }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2.5">
        <Button variant="outline" onClick={() => { setTab('y2j'); y2j() }} className={`px-4 h-9 text-sm ${tab === 'y2j' ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>YAML → JSON</Button>
        <Button variant="outline" onClick={() => { setTab('j2y'); j2y() }} className={`px-4 h-9 text-sm ${tab === 'j2y' ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>JSON → YAML</Button>
        <CopyButton value={tab === 'y2j' ? j : y} />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {tab === 'y2j' ? (
        <div className="grid md:grid-cols-2 gap-3">
          <textarea value={y} onChange={e => setY(e.target.value)} className="w-full h-96 border p-3 font-mono text-xs" spellCheck={false} />
          <textarea value={j} readOnly className="w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          <textarea value={j} onChange={e => setJ(e.target.value)} className="w-full h-96 border p-3 font-mono text-xs" spellCheck={false} />
          <textarea value={y} readOnly className="w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
        </div>
      )}
    </div>
  )
}
