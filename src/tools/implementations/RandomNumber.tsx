import { useState } from 'react'

import { Button } from '../../components/ui/Button'

export default function RandomNumber() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(1)
  const [unique, setUnique] = useState(false)
  const [list, setList] = useState<number[]>([])

  const gen = () => {
    const n = Math.min(count, 100)
    if (unique) {
      const range = max - min + 1
      const size = Math.min(n, Math.max(0, range))
      const pool = Array.from({ length: range }, (_, i) => min + i)
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]] }
      setList(pool.slice(0, size))
    } else {
      setList(Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min))
    }
  }

  const dice = [1, 2, 3, 4, 5, 6]
  const [die, setDie] = useState<number | null>(null)
  const roll = () => setDie(dice[Math.floor(Math.random() * 6)])

  const [coin, setCoin] = useState<string | null>(null)
  const flip = () => setCoin(Math.random() < 0.5 ? 'Heads' : 'Tails')

  return (
    <div className="space-y-5 max-w-lg">
      <div className="border p-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Random number</p>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-sm">Min<input type="number" value={min} onChange={e => setMin(parseInt(e.target.value) || 0)} className="w-full border px-2 h-9 mt-1" /></label>
          <label className="text-sm">Max<input type="number" value={max} onChange={e => setMax(parseInt(e.target.value) || 0)} className="w-full border px-2 h-9 mt-1" /></label>
          <label className="text-sm">Count<input type="number" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} className="w-full border px-2 h-9 mt-1" /></label>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} />No repeats</label>
        <Button variant="secondary" onClick={gen}>Generate</Button>
        <div className="flex flex-wrap gap-2.5">
          {list.map((n, i) => <span key={i} className="px-3 py-1.5 border font-mono text-sm font-bold">{n}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Dice</p>
          <div className={`text-4xl font-bold h-12 ${die !== null ? '' : 'text-zinc-300'}`}>{die ?? '?'}</div>
          <Button variant="secondary" onClick={roll} className="mt-3">Roll</Button>
        </div>
        <div className="border p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Coin flip</p>
          <div className={`text-2xl font-bold h-12 ${coin !== null ? '' : 'text-zinc-300'}`}>{coin ?? '…'}</div>
          <Button variant="secondary" onClick={flip} className="mt-3">Flip</Button>
        </div>
      </div>
    </div>
  )
}
