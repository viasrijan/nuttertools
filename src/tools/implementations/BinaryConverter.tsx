import { useState } from 'react'

function toBase(n: number, base: number) { return n.toString(base).toUpperCase() }

export default function BinaryConverter() {
  const [input, setInput] = useState('255')
  const [from, setFrom] = useState<'dec' | 'hex' | 'oct' | 'bin'>('dec')
  const [error, setError] = useState('')

  const parsed = (() => {
    setError('')
    if (!input.trim()) return NaN
    const radix = from === 'dec' ? 10 : from === 'hex' ? 16 : from === 'oct' ? 8 : 2
    const n = parseInt(input.trim(), radix)
    if (isNaN(n) || /[^0-9a-fA-F]/.test(input) && from === 'hex') { if (isNaN(n)) setError(`Invalid ${from} value`) }
    return n
  })()

  const rows: [string, () => string][] = [
    ['Decimal', () => String(parsed)],
    ['Hexadecimal', () => '0x' + toBase(parsed, 16)],
    ['Octal', () => '0o' + toBase(parsed, 8)],
    ['Binary', () => '0b' + toBase(parsed, 2)],
  ]

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-wrap gap-2 items-center">
        <select value={from} onChange={e => setFrom(e.target.value as any)} className="border px-3 h-9 text-sm bg-transparent">
          <option value="dec">Decimal</option><option value="hex">Hexadecimal</option><option value="oct">Octal</option><option value="bin">Binary</option>
        </select>
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 min-w-[180px] border px-3 h-9 font-mono text-sm" placeholder="Enter a value" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!isNaN(parsed) && (
        <div className="space-y-2">
          {rows.map(([label, fn]) => (
            <div key={label} className="border p-3 flex items-center gap-3">
              <span className="w-28 text-sm font-bold">{label}</span>
              <code className="flex-1 font-mono text-sm break-all">{fn()}</code>
              <button onClick={() => navigator.clipboard.writeText(fn())} className="text-xs border px-2 py-1">Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
