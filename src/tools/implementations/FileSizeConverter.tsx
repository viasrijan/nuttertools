import { useState } from 'react'

const DECIMAL: [string, number][] = [['KB', 1000], ['MB', 1000 ** 2], ['GB', 1000 ** 3], ['TB', 1000 ** 4], ['PB', 1000 ** 5]]
const BINARY: [string, number][] = [['KiB', 1024], ['MiB', 1024 ** 2], ['GiB', 1024 ** 3], ['TiB', 1024 ** 4], ['PiB', 1024 ** 5]]
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']

function fmt(n: number): string {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  if (n >= 100) return n.toFixed(1)
  if (n >= 10) return n.toFixed(2)
  return n.toFixed(3)
}

export default function FileSizeConverter() {
  const [value, setValue] = useState('1')
  const [unit, setUnit] = useState('GB')

  const v = Number(value)
  let bytes = NaN
  if (Number.isFinite(v)) {
    const mult = DECIMAL.find(([u]) => u === unit) ? DECIMAL.find(([u]) => u === unit)![1] : BINARY.find(([u]) => u === unit)![1]
    bytes = v * mult
  }
  const valid = Number.isFinite(bytes) && bytes >= 0

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Value</label>
          <input type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)}
            className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none focus:border-indigo-600" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}
            className="border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none">
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      {valid && (
        <>
          <div className="border p-4 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Exact size: </span>
            <span className="font-mono font-bold">{fmt(bytes)} bytes</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {DECIMAL.map(([u, m]) => (
              <div key={u} className="border px-3 py-2.5 flex items-baseline justify-between gap-2">
                <span className="font-mono font-bold">{fmt(bytes / m)}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{u}</span>
              </div>
            ))}
            {BINARY.map(([u, m]) => (
              <div key={u} className="border px-3 py-2.5 flex items-baseline justify-between gap-2">
                <span className="font-mono font-bold">{fmt(bytes / m)}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{u}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">KB/MB/GB use powers of 1000 (storage). KiB/MiB/GiB use powers of 1024 (memory, e.g. RAM).</p>
        </>
      )}
    </div>
  )
}
