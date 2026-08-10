import { useState } from 'react'

export default function MarkdownTableGenerator() {
  const [cols, setCols] = useState(3)
  const [rows, setRows] = useState(3)
  const [cells, setCells] = useState<string[][]>(() =>
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => '')))

  const setCell = (r: number, c: number, v: string) => {
    setCells((prev) => prev.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? v : cell) : row))
  }

  const setSize = (type: 'cols' | 'rows', n: number) => {
    const cc = type === 'cols' ? n : cols
    const rr = type === 'rows' ? n : rows
    const next = Array.from({ length: rr }, (_, r) =>
      Array.from({ length: cc }, (_, c) => cells[r]?.[c] ?? ''))
    setCells(next)
    if (type === 'cols') setCols(n)
    else setRows(n)
  }

  const build = () => {
    if (cols === 0 || rows === 0) return ''
    const header = cells[0] ?? Array(cols).fill('')
    const body = cells.slice(1)
    const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ')
    const line = (row: string[]) => `| ${row.map(esc).join(' | ')} |`
    const sep = `| ${header.map(() => '---').join(' | ')} |`
    return [line(header), sep, ...body.map(line)].join('\n')
  }

  const copy = async () => {
    await navigator.clipboard.writeText(build())
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const [copied, setCopied] = useState(false)

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-wrap gap-3 text-sm items-center">
        <label className="font-medium">Columns
          <input type="number" min="1" max="10" value={cols} onChange={(e) => setSize('cols', Math.min(10, Math.max(1, +e.target.value)))}
            className="border px-2 py-1.5 w-16 ml-2 bg-transparent text-zinc-900 dark:text-white" />
        </label>
        <label className="font-medium">Data rows
          <input type="number" min="1" max="20" value={rows} onChange={(e) => setSize('rows', Math.min(20, Math.max(1, +e.target.value)))}
            className="border px-2 py-1.5 w-16 ml-2 bg-transparent text-zinc-900 dark:text-white" />
        </label>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">First row becomes the header</span>
      </div>
      <div className="overflow-x-auto border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-100/60 dark:bg-zinc-800/40">
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} className="p-1.5">
                  <input value={cells[0]?.[c] ?? ''} onChange={(e) => setCell(0, c, e.target.value)} placeholder={`Header ${c + 1}`}
                    className="w-full bg-transparent px-2 py-1.5 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.max(0, rows - 1) }, (_, r) => (
              <tr key={r} className="border-b last:border-b-0">
                {Array.from({ length: cols }, (_, c) => (
                  <td key={c} className="p-1.5">
                    <input value={cells[r + 1]?.[c] ?? ''} onChange={(e) => setCell(r + 1, c, e.target.value)} placeholder={`Row ${r + 2}`}
                      className="w-full bg-transparent px-2 py-1.5 outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <textarea value={build()} readOnly rows={Math.min(12, rows + 2)} spellCheck={false}
        className="w-full border bg-transparent p-3 font-mono text-[13px] text-zinc-900 dark:text-white outline-none" />
      <button onClick={copy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold">{copied ? 'Copied!' : 'Copy markdown'}</button>
    </div>
  )
}
