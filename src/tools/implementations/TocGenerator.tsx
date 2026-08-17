import { useMemo, useState } from 'react'

import { Button } from '../../components/ui/Button'

export default function TocGenerator() {
  const [text, setText] = useState('# My Article\n\nIntro paragraph.\n\n## Getting Started\n\nStuff.\n\n### Installation\n\nMore stuff.\n\n## Advanced Usage\n\nDetails.\n\n### FAQ\n\nQuestions.')

  const toc = useMemo(() => {
    const lines = text.split('\n')
    const out: { level: number, title: string, anchor: string }[] = []
    for (const l of lines) {
      const m = l.match(/^(#{1,6})\s+(.+)$/)
      if (m) out.push({ level: m[1].length, title: m[2], anchor: m[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') })
    }
    return out
  }, [text])

  const md = toc.map(t => '  '.repeat(t.level - 1) + `- [${t.title}](#${t.anchor})`).join('\n')
  const html = `<ul>\n` + toc.map(t => `${'  '.repeat(t.level - 1)}<li><a href="#${t.anchor}">${t.title}</a></li>`).join('\n') + `\n</ul>`

  return (
    <div className="space-y-5">
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste markdown with headings (#, ##, …)" className="w-full h-[220px] border p-3 text-sm font-mono" />
      {toc.length === 0 && <p className="text-xs text-zinc-500">No headings found — use # level headings in your markdown.</p>}
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Markdown TOC</label>
          <pre className="border p-3 text-xs mt-1 max-h-[240px] overflow-auto whitespace-pre-wrap">{md}</pre>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">HTML TOC</label>
          <pre className="border p-3 text-xs mt-1 max-h-[240px] overflow-auto whitespace-pre-wrap break-all">{html}</pre>
        </div>
      </div>
      <div className="flex gap-2.5">
        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(md)}>Copy Markdown</Button>
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(html)}>Copy HTML</Button>
      </div>
    </div>
  )
}
