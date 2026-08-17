import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'

export default function CaesarCipher() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog')
  const [shift, setShift] = useState(3)
  const [out, setOut] = useState('')

  const cipher = (s: string, n: number) => s.replace(/[a-zA-Z]/g, c => {
    const base = c === c.toLowerCase() ? 'a' : 'A'
    return String.fromCharCode(base.charCodeAt(0) + ((c.toLowerCase().charCodeAt(0) - 97 + n + 26) % 26))
  })

  const brute = () => Array.from({ length: 26 }, (_, i) => ({ shift: i, text: cipher(text, i) }))

  return (
    <div className="space-y-5 max-w-3xl omni-rise">
      <textarea value={text} onChange={e => { setText(e.target.value); setOut(cipher(e.target.value, shift)) }} className="w-full h-24 w-full  border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 p-3 text-sm transition-all duration-200" />
      <div className="flex items-center gap-3">
        <label className="text-sm">Shift</label>
        <input type="range" min={-25} max={25} value={shift} onChange={e => setShift(parseInt(e.target.value))} className="flex-1" />
        <span className="font-mono text-sm font-bold">{shift >= 0 ? `+${shift}` : shift}</span>
        <Button variant="secondary" size="sm" onClick={() => { setOut(cipher(text, shift)); setText(cipher(text, shift)) }}>Apply</Button>
        <CopyButton value={out} />
      </div>
      <textarea value={out} onChange={e => setOut(e.target.value)} className="w-full border p-3 h-24 text-sm bg-zinc-50 dark:bg-zinc-800" />
      <div>
        <p className="text-sm font-semibold mb-2">Brute force (all 26 shifts)</p>
        <div className="border divide-y divide-zinc-100 dark:divide-zinc-800 max-h-72 overflow-auto">
          {brute().map((r, i) => (
            <div key={i} className="px-3 py-1.5 text-sm flex gap-3">
              <span className="font-mono text-xs text-zinc-500 w-8 pt-0.5">{r.shift >= 0 ? `+${r.shift}` : r.shift}</span>
              <span className="font-mono text-xs">{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
