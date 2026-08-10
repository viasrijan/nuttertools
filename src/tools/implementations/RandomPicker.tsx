import { useState } from 'react'

export default function RandomPicker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [rolling, setRolling] = useState(false)

  const items = text.split('\n').map((s) => s.trim()).filter(Boolean)

  const pick = () => {
    if (items.length === 0) return
    setRolling(true)
    setResult('')
    setTimeout(() => {
      const chosen = items[Math.floor(Math.random() * items.length)]
      setResult(chosen)
      setHistory((h) => [chosen, ...h].slice(0, 8))
      setRolling(false)
    }, 450)
  }

  const clear = () => { setText(''); setResult(''); setHistory([]) }

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">List of choices (one per line)</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} spellCheck={false}
          placeholder={'Pizza\nSushi\nBurgers\nTacos'}
          className="w-full border bg-transparent p-3 font-mono text-[13px] text-zinc-900 dark:text-white outline-none focus:border-indigo-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={pick} disabled={items.length === 0 || rolling}
          className={`px-6 h-11 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold ${items.length === 0 ? 'opacity-40' : ''}`}>
          {rolling ? 'Picking…' : `Pick one of ${items.length}`}
        </button>
        <button onClick={clear} className="px-4 h-11 text-sm font-semibold ring-1 ring-zinc-200 dark:ring-zinc-800">Clear</button>
      </div>
      {result && (
        <div className={`border p-6 text-center ${rolling ? 'animate-pulse' : ''}`}>
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400">Result</div>
          <div className="mt-2 text-3xl font-black tracking-tight break-words">{result}</div>
        </div>
      )}
      {history.length > 0 && (
        <div className="border text-xs divide-y divide-zinc-200 dark:divide-zinc-800">
          {history.map((h, i) => (
            <div key={i} className="flex justify-between px-3 py-2">
              <span className="font-mono truncate">{h}</span>
              <span className="text-zinc-400 font-bold shrink-0">#{history.length - i}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
