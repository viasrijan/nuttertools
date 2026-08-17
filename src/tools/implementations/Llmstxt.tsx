import { useMemo, useState } from 'react'

import { Button } from '../../components/ui/Button'

export default function Llmstxt() {
  const [title, setTitle] = useState('NutterTools')
  const [desc, setDesc] = useState('Free internet tools for everyday tasks - images, PDFs, audio, video and more.')
  const [sections, setSections] = useState('Tools\n- PDF Tools: https://nutter.tools/tools/pdf-tools\n- Image Tools: https://nutter.tools/tools/image-tools\n- AI Tools: https://nutter.tools/tools/ai-tools\n\nAbout\n- About NutterTools: https://nutter.tools/about\n- Privacy: https://nutter.tools/privacy')

  const out = useMemo(() => {
    return `# ${title}\n\n> ${desc}\n\n${sections.split('\n\n').map(block => {
      const [head, ...lines] = block.split('\n')
      return `## ${head}\n\n${lines.join('\n')}`
    }).join('\n\n')}\n`
  }, [title, desc, sections])

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-3 gap-2 text-sm">
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Site title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div className="col-span-2"><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Description</label><input value={desc} onChange={e => setDesc(e.target.value)} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
      </div>
      <div>
        <label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Sections — one per blank line, first line = heading</label>
        <textarea value={sections} onChange={e => setSections(e.target.value)} className="w-full h-[220px] border p-3 text-sm font-mono mt-1" />
      </div>
      <pre className="border p-3 text-xs max-h-[260px] overflow-auto whitespace-pre-wrap">{out}</pre>
      <div className="flex gap-2.5">
        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(out)}>Copy llms.txt</Button>
        <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(out)}`} download="llms.txt" className="px-5 h-10 border text-sm inline-flex items-center">Download</a>
      </div>
      <p className="text-[11px] text-zinc-500">llms.txt tells AI crawlers (ChatGPT, Claude, Perplexity…) what your site is about. Host the file at the root of your domain.</p>
    </div>
  )
}
