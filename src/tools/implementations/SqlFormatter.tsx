import { useState } from 'react'

function formatSql(sql: string): string {
  const lines = sql
    .replace(/;\s*$/g, ';')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
  const parts = lines.split(/\s+/)
  const out: string[] = []
  let inString = false
  for (const p of parts) {
    const up = p.toUpperCase()
    const isKeyword = /^(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|CREATE|TABLE|ALTER|DROP|INDEX|PRIMARY|KEY|NOT|NULL|UNIQUE|DEFAULT|AS|IN|EXISTS|BETWEEN|LIKE|CASE|WHEN|THEN|ELSE|END|UNION|ALL|DISTINCT|ASC|DESC|RETURNING|INTO|BEGIN|COMMIT|ROLLBACK)$/i.test(p)
    if (isKeyword && out.length && !inString) out.push('\n' + up)
    else out.push(p)
    if (p.includes("'") && (p.match(/'/g) || []).length % 2 === 1) inString = !inString
  }
  let depth = 0
  return out.join(' ').replace(/\n\s*/g, m => {
    if (m.includes('WHERE') || m.includes('AND') || m.includes('OR') || m.includes('ON') || m.includes('THEN') || m.includes('ELSE')) return '\n  ' + '  '.repeat(depth) + '  '
    if (/JOIN|VALUES|SET|FROM|HAVING|ORDER|GROUP/.test(m)) return '\n' + '  '.repeat(depth)
    return '\n' + '  '.repeat(Math.max(0, depth))
  })
}

export default function SqlFormatter() {
  const [input, setInput] = useState(`SELECT u.name, COUNT(o.id) as orders FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE u.active = 1 GROUP BY u.id ORDER BY orders DESC LIMIT 10;`)
  const output = formatSql(input)
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy formatted</button>
        <button onClick={() => navigator.clipboard.writeText(input.replace(/\s+/g, ' ').trim())} className="px-4 h-9 border text-sm">Copy minified</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-semibold mb-1">Input</p>
          <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-96 border p-3 font-mono text-xs" spellCheck={false} />
        </div>
        <div>
          <p className="text-sm font-semibold mb-1">Formatted</p>
          <textarea value={output} readOnly className="w-full h-96 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}
