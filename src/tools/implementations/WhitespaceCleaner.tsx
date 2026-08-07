import { useState } from 'react'

export default function WhitespaceCleaner() {
  const [input, setInput] = useState('Hello    world!\n\n\n  \tline with tabs\t  \n\nmultiple   spaces')
  const [opts, setOpts] = useState({ collapse: true, trimLines: true, removeEmpty: true, tabsToSpaces: true, trailing: true })

  const clean = () => {
    let s = input
    if (opts.tabsToSpaces) s = s.replace(/\t/g, '  ')
    if (opts.trailing) s = s.replace(/[ \t]+$/gm, '')
    if (opts.collapse) s = s.replace(/[ \t]{2,}/g, ' ')
    let lines = s.split('\n')
    if (opts.trimLines) lines = lines.map(l => l.trim())
    if (opts.removeEmpty) lines = lines.filter(l => l.trim() !== '')
    return lines.join('\n')
  }

  const before = input.length
  const after = clean().length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={opts.collapse} onChange={e => setOpts({ ...opts, collapse: e.target.checked })} />Collapse spaces</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={opts.trimLines} onChange={e => setOpts({ ...opts, trimLines: e.target.checked })} />Trim lines</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={opts.removeEmpty} onChange={e => setOpts({ ...opts, removeEmpty: e.target.checked })} />Remove empty lines</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={opts.tabsToSpaces} onChange={e => setOpts({ ...opts, tabsToSpaces: e.target.checked })} />Tabs → spaces</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={opts.trailing} onChange={e => setOpts({ ...opts, trailing: e.target.checked })} />Strip trailing spaces</label>
      </div>
      <p className="text-xs font-medium text-zinc-500">Saved {Math.max(0, before - after)} characters ({before} → {after})</p>
      <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-40 border p-3 font-mono text-xs" />
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(clean())} className="px-4 h-9 bg-zinc-900 text-white text-sm">Copy cleaned</button>
      </div>
      <div className="border p-3 font-mono text-xs whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800">{clean()}</div>
    </div>
  )
}
