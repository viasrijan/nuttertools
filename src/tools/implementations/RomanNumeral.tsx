import { useState } from 'react'

import { Button } from '../../components/ui/Button'

const ROMAN = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
] as const

function toRoman(n: number): string {
  let v = n
  let out = ''
  for (const [num, sym] of ROMAN) {
    while (v >= num) { out += sym; v -= num }
  }
  return out
}

function fromRoman(s: string): number {
  const upper = s.trim().toUpperCase()
  if (!upper) throw new Error('Enter a roman numeral')
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  for (let i = 0; i < upper.length; i++) {
    const cur = map[upper[i]]
    const next = map[upper[i + 1]]
    if (!cur) throw new Error(`Invalid character "${upper[i]}"`)
    total += cur < next ? -cur : cur
  }
  if (toRoman(total) !== upper) throw new Error(`"${upper}" is not a valid roman numeral`)
  return total
}

export default function RomanNumeral() {
  const [mode, setMode] = useState<'toRoman' | 'fromRoman'>('toRoman')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    setError('')
    setResult('')
    try {
      if (mode === 'toRoman') {
        const n = Math.floor(Number(input))
        if (!Number.isFinite(n)) throw new Error('Enter a valid number')
        if (n < 1 || n > 3999) throw new Error('Number must be between 1 and 3999')
        setResult(toRoman(n))
      } else {
        setResult(String(fromRoman(input)))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid input')
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex gap-2.5">
        {(['toRoman', 'fromRoman'] as const).map((m) => (
          <Button variant="outline" key={m} onClick={() => setMode(m)} className={`px-4 h-10 text-sm font-semibold ${mode === m ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : 'ring-1 ring-zinc-200 dark:ring-zinc-800'}`}>
            {m === 'toRoman' ? 'Number → Roman' : 'Roman → Number'}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2.5">
        <input value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false}
          placeholder={mode === 'toRoman' ? 'e.g. 1984' : 'e.g. MCMLXXXIV'}
          onKeyDown={(e) => e.key === 'Enter' && convert()}
          className="flex-1 min-w-[180px] border px-3 py-2.5 font-mono text-zinc-900 dark:text-white bg-transparent outline-none focus:border-indigo-600" />
        <Button variant="secondary" onClick={convert}>Convert</Button>
      </div>
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      {result && (
        <div className="flex items-center justify-between border p-5 gap-3">
          <span className="text-3xl font-black tracking-tight break-all">{result}</span>
          <Button variant="secondary" onClick={copy} className="text-xs shrink-0">Copy</Button>
        </div>
      )}
    </div>
  )
}
