import { useEffect, useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')

export default function HmacGenerator() {
  const [msg, setMsg] = useState('The quick brown fox jumps over the lazy dog')
  const [key, setKey] = useState('secret-key')
  const [hash, setHash] = useState('SHA-256')
  const [format, setFormat] = useState<'hex' | 'b64'>('hex')
  const [out, setOut] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const enc = new TextEncoder()
        const keyBuf = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash }, false, ['sign'])
        const sig = await crypto.subtle.sign('HMAC', keyBuf, enc.encode(msg))
        if (!alive) return
        setOut(format === 'hex' ? toHex(sig) : btoa(String.fromCharCode(...new Uint8Array(sig))))
      } catch { if (alive) setOut('Error generating HMAC') }
    })()
    return () => { alive = false }
  }, [msg, key, hash, format])

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Message</label>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} className="w-full h-[120px] border p-3 text-sm mt-1" />
      </div>
      <div>
        <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Secret key</label>
        <input value={key} onChange={e => setKey(e.target.value)} className="w-full border px-3 py-2 text-sm mt-1" />
      </div>
      <div className="flex flex-wrap gap-2 text-sm items-center">
        <label className="font-semibold text-zinc-900 dark:text-white">Algorithm</label>
        {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(h => (
          <Button variant="outline" key={h} onClick={() => setHash(h)} className={`px-3 h-9 text-xs  ${hash === h ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{h}</Button>
        ))}
        <label className="font-semibold text-zinc-900 dark:text-white ml-2">Output</label>
        {(['hex', 'b64'] as const).map(f => (
          <Button variant="outline" key={f} onClick={() => setFormat(f)} className={`px-3 h-9 text-xs  ${format === f ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{f === 'hex' ? 'Hex' : 'Base64'}</Button>
        ))}
      </div>
      <pre className="border p-3 text-xs break-all whitespace-pre-wrap font-mono">{out || 'Generating…'}</pre>
      <CopyButton value={out} />
    </div>
  )
}
