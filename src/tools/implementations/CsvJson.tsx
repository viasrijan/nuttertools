import { useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import { saveBlob } from '../../lib/download'

function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let cur = '', row: string[] = [], inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++ } else inQ = false
      } else cur += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
    else if (c !== '\r') cur += c
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  return rows
}

function toCSV(arr: any[]): string {
  const esc = (v: any) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  if (arr.length && typeof arr[0] === 'object') {
    const keys = Object.keys(arr[0])
    return [keys.map(esc).join(','), ...arr.map(o => keys.map(k => esc((o as any)[k])).join(','))].join('\n')
  }
  return arr.map(esc).join(',')
}

export default function CsvJson() {
  const [dir, setDir] = useState<'csv-json' | 'json-csv'>('csv-json')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const convert = () => {
    setError('')
    try {
      if (dir === 'csv-json') {
        const rows = parseCSV(input)
        if (!rows.length) throw new Error('Empty CSV')
        const headers = rows[0]
        const json = rows.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])))
        setOutput(JSON.stringify(json, null, 2))
      } else {
        const parsed = JSON.parse(input)
        const arr = Array.isArray(parsed) ? parsed : [parsed]
        setOutput(toCSV(arr))
      }
    } catch (e: any) { setError(e.message) }
  }

  const onFile = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    const text = await f.text()
    setInput(text)
    setDir(f.name.endsWith('.json') ? 'json-csv' : 'csv-json')
    if (fileRef.current) fileRef.current.value = ''
  }

  const download = () => {
    const isJson = dir === 'csv-json'
    saveBlob(new Blob([output], { type: isJson ? 'application/json' : 'text/csv' }), isJson ? 'output.json' : 'output.csv')
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={() => setDir('csv-json')} className={`px-4 h-9 text-sm border ${dir === 'csv-json' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>CSV → JSON</Button>
        <Button variant="outline" onClick={() => setDir('json-csv')} className={`px-4 h-9 text-sm border ${dir === 'json-csv' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>JSON → CSV</Button>
      </div>
      <DropZone onFiles={onFile} accept=".csv,.json,.txt" multiple={false} label="Or drop a .csv / .json file" />
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={dir === 'csv-json' ? 'name,age\nAlice,30' : '{"name":"Alice","age":30}'} className="w-full border p-3 h-36 font-mono text-sm" />
      <Button variant="secondary" onClick={convert}>Convert ↓</Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {output && (
        <div className="space-y-3">
          <textarea readOnly value={output} className="w-full border p-3 h-44 font-mono text-sm" />
          <Button variant="outline" onClick={download}>Download</Button>
        </div>
      )}
    </div>
  )
}
