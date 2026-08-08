import { useState } from 'react'

const DIE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function DiceRoller() {
  const [count, setCount] = useState(2)
  const [sides, setSides] = useState(6)
  const [rolls, setRolls] = useState<number[]>([])
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState<{ sum: number, values: number[] }[]>([])

  const roll = () => {
    setRolling(true)
    const values = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides))
    setTimeout(() => {
      setRolls(values)
      setHistory(prev => [{ sum: values.reduce((a, b) => a + b, 0), values }, ...prev].slice(0, 10))
      setRolling(false)
    }, 350)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex flex-wrap gap-2 text-sm items-center">
        <label className="font-semibold text-zinc-900 dark:text-white">Dice</label>
        <input type="number" min="1" max="12" value={count} onChange={e => setCount(Math.min(12, Math.max(1, +e.target.value)))} className="border px-2 py-2 w-20" />
        <label className="font-semibold text-zinc-900 dark:text-white ml-2">Sides</label>
        {[4, 6, 8, 10, 12, 20].map(s => (
          <button key={s} onClick={() => setSides(s)} className={`px-3 h-9 text-xs border font-mono ${sides === s ? 'bg-zinc-900 text-white' : ''}`}>d{s}</button>
        ))}
        <button onClick={roll} disabled={rolling} className={`px-5 h-10 bg-zinc-900 text-white text-sm ml-auto ${rolling ? 'opacity-60' : ''}`}>{rolling ? 'Rolling…' : 'Roll'}</button>
      </div>
      {rolls.length > 0 && (
        <div className={`border p-6 text-center ${rolling ? 'animate-pulse' : ''}`}>
          <div className="text-4xl tracking-widest">{rolls.map(r => sides === 6 ? DIE_FACES[r - 1] : r).join(' ')}</div>
          <div className="mt-3 text-lg font-bold">Total: <span className="text-2xl">{rolls.reduce((a, b) => a + b, 0)}</span></div>
        </div>
      )}
      {history.length > 0 && (
        <div className="border text-xs divide-y">
          {history.map((h, i) => (
            <div key={i} className="flex justify-between p-2">
              <span className="font-mono">{h.values.join(' + ')}</span>
              <span className="font-bold">{h.sum}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
