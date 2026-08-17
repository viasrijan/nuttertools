import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

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
    <div className="space-y-5 max-w-3xl omni-rise">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-24 w-full  border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 p-3 text-sm transition-all duration-200" />
      <Button variant="secondary" onClick={run}>Hash</Button>
      <div className="space-y-3">
        {rows.map(([name, value, desc]) => (
          <div key={name} className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 transition-all duration-200 hover:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold">{name} <span className="text-[11px] font-medium text-zinc-500">{desc}</span></span>
              {value && <CopyButton value={value} />}
            </div>
            <code className="block mt-1.5 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800 p-2">{value || '—'}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
