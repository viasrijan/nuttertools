import { useState } from 'react'
import * as CryptoJS from 'crypto-js'

export default function HashGenerator() {
  const [text, setText] = useState('NutterTools is awesome')
  const [md5, setMd5] = useState('')
  const [sha1, setSha1] = useState('')
  const [sha256, setSha256] = useState('')
  const [sha512, setSha512] = useState('')

  const run = () => {
    setMd5(CryptoJS.MD5(text).toString())
    setSha1(CryptoJS.SHA1(text).toString())
    setSha256(CryptoJS.SHA256(text).toString())
    setSha512(CryptoJS.SHA512(text).toString())
  }

  const rows: [string, string, string][] = [
    ['MD5', md5, '128-bit, fast, not secure for passwords'],
    ['SHA-1', sha1, '160-bit, legacy, avoid for security'],
    ['SHA-256', sha256, '256-bit, current standard'],
    ['SHA-512', sha512, '512-bit, strongest in the family'],
  ]

  return (
    <div className="space-y-4 max-w-3xl">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-3 h-24 text-sm" />
      <button onClick={run} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Hash</button>
      <div className="space-y-2">
        {rows.map(([name, value, desc]) => (
          <div key={name} className="border p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">{name} <span className="text-[11px] font-medium text-zinc-500">{desc}</span></span>
              {value && <button onClick={() => navigator.clipboard.writeText(value)} className="text-xs border px-2 py-1">Copy</button>}
            </div>
            <code className="block mt-1.5 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800 p-2">{value || '—'}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
