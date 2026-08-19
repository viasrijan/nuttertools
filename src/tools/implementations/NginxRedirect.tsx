import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result } from '../../components/ui/Result'

export default function NginxRedirect() {
  const [pairs, setPairs] = useState('/old-page-1 /new-page-1\n/old-page-2 /new-page-2\n/special-article')
  const [code, setCode] = useState('301')
  const [base, setBase] = useState('https://example.com')

  const lines = pairs.split('\n').map((l) => l.trim()).filter(Boolean)
  const rules = lines.map((l) => {
    const [from, to] = l.split(/\s+/)
    if (!from?.startsWith('/')) return null
    const dest = to ? (to.startsWith('http') ? to : base.replace(/\/$/, '') + to) : base.replace(/\/$/, '') + from
    return `location ${from} {\n    return ${code} ${dest};\n}`
  }).filter(Boolean)

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Redirect code" value={code} onChange={(e) => setCode(e.target.value)} hint="301 = permanent, 302 = temporary" />
        <Field label="Destination base URL" value={base} onChange={(e) => setBase(e.target.value)} hint="Used for paths without a destination" />
      </div>
      <div className="space-y-1.5">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Redirects — one per line: "old-path new-path" (or just old-path)</span>
        <textarea value={pairs} onChange={(e) => setPairs(e.target.value)} rows={8} className="w-full p-3 font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">nginx configuration</span>
          <button onClick={() => navigator.clipboard?.writeText(rules.join('\n\n'))} className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline">Copy all</button>
        </div>
        <pre className="p-3 bg-zinc-100 dark:bg-zinc-800 font-mono text-[12px] leading-relaxed overflow-auto whitespace-pre-wrap">{rules.join('\n\n') || 'Add at least one redirect.'}</pre>
      </div>
      <Result label="Rules generated" value={rules.length} />
    </div>
  )
}