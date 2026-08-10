import { useMemo, useState } from 'react'

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

const esc = (s: string) => `'${s.replace(/'/g, "''")}'`
const ident = (s: string) => (s.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[0-9]/, 'c_') || 'col')

export default function CsvSql() {
  const [csv, setCsv] = useState('name,age,city\nAlice,30,New York\nBob,25,London\nCarol,29,"Paris, France"')
  const [table, setTable] = useState('users')

  const sql = useMemo(() => {
    try {
      const rows = parseCsv(csv)
      if (!rows.length) return '/* Empty input */'
      const headers = rows[0]
      const data = rows.slice(1)
      const cols = headers.map((h, i) => {
        const isNum = data.length > 0 && data.every(r => r[i] !== undefined && r[i] !== '' && !isNaN(Number(r[i])))
        return `${ident(h)} ${isNum ? 'NUMERIC' : 'TEXT'}`
      })
      const create = `CREATE TABLE ${ident(table)} (\n  ${cols.join(',\n  ')}\n);`
      const inserts = data.map(r => `INSERT INTO ${ident(table)} (${headers.map(ident).join(', ')}) VALUES (${headers.map((_, i) => r[i] === undefined || r[i] === '' ? 'NULL' : esc(r[i])).join(', ')});`)
      return `${create}\n\n${inserts.join('\n')}`
    } catch (e: any) { return '/* Error: ' + e.message + ' */' }
  }, [csv, table])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Table name</label>
        <input value={table} onChange={e => setTable(e.target.value)} className="border px-2 py-2 w-40" />
      </div>
      <textarea value={csv} onChange={e => setCsv(e.target.value)} placeholder="Paste CSV (first row = headers)…" className="w-full h-[200px] border p-3 text-sm font-mono" />
      <button onClick={() => navigator.clipboard.writeText(sql)} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy SQL</button>
      <pre className="border p-3 text-xs max-h-[300px] overflow-auto whitespace-pre">{sql}</pre>
    </div>
  )
}
