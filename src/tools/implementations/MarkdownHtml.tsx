import { useMemo, useState } from 'react'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

export default function MarkdownHtml() {
  const [md, setMd] = useState('# Hello NutterTools\n\n**Bold** and *italic*, a [link](https://nutter.tools), a list:\n\n- item 1\n- item 2\n\n> Quote here\n\n`inline code` and:\n\n```js\nconsole.log("hi")\n```')

  const html = useMemo(() => {
    try { return marked.parse(md) as string } catch { return '' }
  }, [md])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Markdown</label>
          <textarea value={md} onChange={e => setMd(e.target.value)} className="w-full h-[320px] border p-3 text-sm font-mono mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">HTML output</label>
          <pre className="border p-3 text-xs font-mono mt-1 h-[320px] overflow-auto whitespace-pre-wrap break-all">{html}</pre>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(html)} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy HTML</button>
      </div>
    </div>
  )
}
