import { useState } from 'react'

const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function parse(value: string, base: number): bigint {
  const v = value.trim().toUpperCase()
  if (!v) throw new Error('Enter a value')
  let n = 0n
  for (const ch of v) {
    const d = DIGITS.indexOf(ch)
    if (d < 0 || d >= base) throw new Error(`Invalid digit "${ch}" for base ${base}`)
    n = n * BigInt(base) + BigInt(d)
  }
  return n
}

function render(n: bigint, base: number): string {
  if (n === 0n) return '0'
  let out = ''
  let x = n
  while (x > 0n) {
    out = DIGITS[Number(x % BigInt(base))] + out
    x /= BigInt(base)
  }
  return out
}

export default function BaseConverter() {
  const [value, setValue] = useState('255')
  const [from, setFrom] = useState(10)
  const [to, setTo] = useState(16)
  const [error, setError] = useState('')

  let result = ''
  if (!error) {
    try {
      result = render(parse(value, from), to)
    } catch (e) {
      result = ''
    }
  }

  const setFromBase = (b: number) => {
    if (!error) {
      try { setValue(render(parse(value, from), b)) } catch { /* keep */ }
    }
    setFrom(b)
  }

  const setToBase = (b: number) => setTo(b)

  const otherBases = [2, 8, 10, 16].filter((b) => b !== to)

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Value</label>
          <input value={value} onChange={(e) => { setValue(e.target.value); setError('') }} spellCheck={false}
            className="w-full border px-3 py-2.5 font-mono text-zinc-900 dark:text-white bg-transparent outline-none focus:border-indigo-600" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">From base</label>
          <select value={from} onChange={(e) => setFromBase(+e.target.value)}
            className="border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none">
            {[2, 4, 8, 10, 12, 16, 20, 24, 32, 36].map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">To base</label>
          <select value={to} onChange={(e) => setToBase(+e.target.value)}
            className="border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none">
            {[2, 4, 8, 10, 12, 16, 20, 24, 32, 36].map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      <div className="border p-4">
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Result (base {to})</div>
        <div className="mt-1 text-2xl font-mono font-bold break-all">{result || '—'}</div>
      </div>
      <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-sm font-mono">
        {otherBases.map((b) => {
          let v = ''
          try { v = render(parse(value, from), b) } catch { v = '' }
          return (
            <div key={b} className="flex items-center justify-between px-3 py-2">
              <span className="text-zinc-500 dark:text-zinc-400">base {b}</span>
              <button onClick={() => setValue(v)} className="font-semibold text-zinc-900 dark:text-white hover:underline" title="Use as input">{v || '—'}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
