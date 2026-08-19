import { useState } from 'react'

import { Button } from '../../components/ui/Button'

export default function SlugGenerator() {
  const [text, setText] = useState('Hello, World! This is a Slug')
  const [sep, setSep] = useState('-')

  const slug = () => text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, sep)

  const [encode, setEncode] = useState('')
  const [decode, setDecode] = useState('')

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-semibold">Text</label>
        <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-3 h-24 text-sm mt-1" />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm">Separator</span>
          {['-', '_', ''].map(s => (
            <Button variant="outline" key={s || 'none'} onClick={() => setSep(s)} className={`px-3 h-8  text-sm ${sep === s ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{s || 'none'}</Button>
          ))}
          <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(slug())} className="ml-auto">Copy slug</Button>
        </div>
        <div className="mt-2 border p-3 font-mono text-sm bg-zinc-50 dark:bg-zinc-800">{slug() || '…'}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold">URL Encode</label>
          <textarea value={encode} onChange={e => setEncode(e.target.value)} className="w-full border p-3 h-24 text-sm mt-1" placeholder="Hello world!" />
          <div className="mt-2 border p-3 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800">{encode ? encodeURIComponent(encode) : ''}</div>
        </div>
        <div>
          <label className="text-sm font-semibold">URL Decode</label>
          <textarea value={decode} onChange={e => setDecode(e.target.value)} className="w-full border p-3 h-24 text-sm mt-1" placeholder="Hello%20world!" />
          <div className="mt-2 border p-3 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800">{decode ? (() => { try { return decodeURIComponent(decode) } catch { return 'Invalid encoding' } })() : ''}</div>
        </div>
      </div>
    </div>
  )
}
