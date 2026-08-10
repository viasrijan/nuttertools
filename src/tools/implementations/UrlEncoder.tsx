import { useState } from 'react'

export default function UrlEncoder() {
  const [input, setInput] = useState('hello world & more? yes!')
  const [encode, setEncode] = useState('')
  const [decode, setDecode] = useState('')

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <label className="text-sm font-semibold">Original text</label>
        <textarea value={input} onChange={e => { setInput(e.target.value); setEncode(encodeURIComponent(e.target.value)); setDecode('') }} className="w-full border p-3 h-24 text-sm mt-1" />
        <div className="flex flex-wrap gap-2 mt-2">
          <button onClick={() => navigator.clipboard.writeText(encodeURIComponent(input))} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Encode</button>
          <button onClick={() => navigator.clipboard.writeText(encodeURIComponent(input))} className="px-4 h-9 border text-sm">Copy encoded</button>
        </div>
        <code className="block mt-3 border p-3 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800">{encodeURIComponent(input)}</code>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold">Decode</label>
          <textarea value={decode} onChange={e => setDecode(e.target.value)} className="w-full border p-3 h-24 text-sm mt-1" placeholder="hello%20world" />
          <div className="mt-2 border p-3 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800">
            {decode ? (() => { try { return decodeURIComponent(decode) } catch { return 'Invalid encoding' } })() : ''}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold">Component encode</label>
          <textarea value={encode} onChange={e => setEncode(e.target.value)} className="w-full border p-3 h-24 text-sm mt-1" />
          <div className="mt-2 border p-3 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800">{encode ? encodeURIComponent(encode) : ''}</div>
        </div>
      </div>
    </div>
  )
}
