import { useState } from 'react'
import { Result } from '../../components/ui/Result'

export default function CoinFlip() {
  const [history, setHistory] = useState<string[]>([])
  const [count, setCount] = useState('1')

  const flip = () => {
    const n = Math.max(1, Math.min(50, parseInt(count) || 1))
    const next: string[] = []
    for (let i = 0; i < n; i++) next.push(Math.random() < 0.5 ? 'Heads' : 'Tails')
    setHistory((h) => [...next, ...h].slice(0, 100))
  }

  const heads = history.filter((x) => x === 'Heads').length
  const tails = history.length - heads

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">Flips</span>
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(e.target.value)} className="w-28 h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </label>
        <button onClick={flip} className="px-6 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Flip coin{parseInt(count) > 1 ? 's' : ''}</button>
        {history.length > 0 && (
          <button onClick={() => setHistory([])} className="px-4 h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Reset</button>
        )}
      </div>
      {history.length > 0 && (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            <Result label="Heads" value={`${heads} (${Math.round((heads / history.length) * 100)}%)`} tone="good" />
            <Result label="Tails" value={`${tails} (${Math.round((tails / history.length) * 100)}%)`} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <span key={i} className={`px-2.5 py-1 text-[11px] font-bold uppercase ${h === 'Heads' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white'}`}>{h}</span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}