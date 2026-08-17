import { useState } from 'react'

import { Button } from '../../components/ui/Button'

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = [], cur = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') inQ = false
      else cur += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
    else if (c !== '\r') cur += c
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  return rows.filter(r => r.some(c => c !== ''))
}

function toCsv(rows: string[][]): string {
  const esc = (s: string) => (s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s)
  return rows.map(r => r.map(esc).join(',')).join('\n')
}

export default function JsonCsv() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const toJson = () => {
    try {
      const rows = parseCsv(input)
      if (!rows.length) throw new Error('empty input')
      const headers = rows[0]
      const out = rows.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])))
      return JSON.stringify(out, null, 2)
    } catch (e: any) { setError('Invalid CSV: ' + e.message); return '' }
  }

  const toJsonRaw = () => {
    try {
      const rows = parseCsv(input)
      if (!rows.length) throw new Error('empty input')
      const headers = rows[0]
      const out = rows.slice(1).map(r => headers.map((h, i) => r[i] ?? ''))
      return JSON.stringify({ headers, rows: out }, null, 2)
    } catch (e: any) { setError('Invalid CSV: ' + e.message); return '' }
  }

  const fromJson = () => {
    try {
      const data: any = JSON.parse(input)
      let arr: any[] = Array.isArray(data) ? data : [data]
      if (!Array.isArray(data) && data && Array.isArray(data.rows) && Array.isArray(data.headers)) {
        arr = (data.rows as any[]).map((r: any[]) => Object.fromEntries((data.headers as string[]).map((h: string, j: number) => [h, r[j]])))
      }
      if (!arr.length) throw new Error('empty array')
      const keys: string[] = [...new Set(arr.flatMap((o: any) => Object.keys(o)))]
      const rowsOut = arr.map((o: Record<string, unknown>) => keys.map(k => String(o[k] ?? '')))
      return toCsv([keys, ...rowsOut])
    } catch (e: any) { setError('Invalid JSON: ' + e.message); return '' }
  }

  return (
    <div className="space-y-5">
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON (array of objects) or CSV with header row…" className="w-full h-[220px] border p-3 text-sm font-mono" />
      <div className="flex flex-wrap gap-2.5">
        <Button variant="secondary" onClick={() => { setError(''); navigator.clipboard.writeText(toJson()) }}>CSV → JSON</Button>
        <Button variant="secondary" onClick={() => { setError(''); navigator.clipboard.writeText(toJsonRaw()) }}>CSV → JSON (array)</Button>
        <Button variant="outline" onClick={() => { setError(''); navigator.clipboard.writeText(fromJson()) }}>JSON → CSV</Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!error && input.trim() && <pre className="border p-3 text-xs max-h-[220px] overflow-auto whitespace-pre-wrap">{(() => { try { return input.trim().startsWith('[') || input.trim().startsWith('{') ? fromJson() : toJson() } catch { return '' } })()}</pre>}
    </div>
  )
}
