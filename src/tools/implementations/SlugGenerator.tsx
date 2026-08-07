import { useState } from 'react'

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
            <button key={s || 'none'} onClick={() => setSep(s)} className={`px-3 h-8 border text-sm ${sep === s ? 'bg-zinc-900 text-white' : ''}`}>{s || 'none'}</button>
          ))}
          <button onClick={() => navigator.clipboard.writeText(slug())} className="px-4 h-9 bg-zinc-900 text-white text-sm ml-auto">Copy slug</button>
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
