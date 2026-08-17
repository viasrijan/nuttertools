import { useMemo, useState } from 'react'

import { Button } from '../../components/ui/Button'

export default function MemoWriter() {
  const [topic, setTopic] = useState('Q3 budget update')
  const [audience, setAudience] = useState('All staff')
  const [points, setPoints] = useState('Marketing budget increases 15%\nHiring freeze until October\nNew expense approval process from Monday')
  const [action, setAction] = useState('Please review your team budgets by Friday')

  const memo = useMemo(() => {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const items = points.split('\n').map(l => l.trim()).filter(Boolean).map(l => `- ${l}`).join('\n')
    return `MEMORANDUM\n\nTo: ${audience}\nFrom: NutterTools Team\nDate: ${date}\nRe: ${topic}\n\n${items}\n\nAction required: ${action}\n\nQuestions? Reply to this thread — answers will be shared team-wide.`
  }, [topic, audience, points, action])

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-2 text-sm">
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Subject</label><input value={topic} onChange={e => setTopic(e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">To</label><input value={audience} onChange={e => setAudience(e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
      </div>
      <div>
        <label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Key points — one per line</label>
        <textarea value={points} onChange={e => setPoints(e.target.value)} className="w-full h-[130px] border p-3 text-sm mt-1" />
      </div>
      <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Action required</label><input value={action} onChange={e => setAction(e.target.value)} className="w-full border px-2 py-2 text-sm mt-1" /></div>
      <pre className="border p-4 text-sm whitespace-pre-wrap">{memo}</pre>
      <div className="flex gap-2.5">
        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(memo)}>Copy memo</Button>
      </div>
    </div>
  )
}
