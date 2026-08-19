import { useMemo, useState } from 'react'

const SAMPLE = 'Name,Role,City\nAda,Engineer,London\nGrace,Admiral,New York\nAlan,Cryptanalyst,Princeton'

export default function CsvViewer() {
  const [csv, setCsv] = useState(SAMPLE)

  const parsed = useMemo(() => {
    const rows: string[][] = []
    let cur = ''
    let row: string[] = []
    let inQ = false
    for (let i = 0; i < csv.length; i++) {
      const ch = csv[i]
      if (inQ) {
        if (ch === '"') { if (csv[i + 1] === '"') { cur += '"'; i++ } else inQ = false }
        else cur += ch
      } else if (ch === '"') inQ = true
      else if (ch === ',') { row.push(cur); cur = '' }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = '' }
      else cur += ch
    }
    row.push(cur)
    rows.push(row)
    return rows.filter((r) => r.some((c) => c.trim() !== ''))
  }, [csv])

  const header = parsed[0] || []
  const body = parsed.slice(1)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-1.5">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">CSV text</span>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={6} className="w-full p-3 font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" spellCheck={false} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-zinc-900 dark:bg-white">
              {header.map((h, i) => <th key={i} className="px-3 py-2 text-left text-white dark:text-zinc-900 font-bold whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {body.map((r, i) => (
              <tr key={i} className={i % 2 ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-transparent'}>
                {header.map((_, j) => <td key={j} className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700 whitespace-nowrap">{r[j] ?? ''}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">{body.length.toLocaleString()} data rows × {header.length} columns</p>
    </div>
  )
}