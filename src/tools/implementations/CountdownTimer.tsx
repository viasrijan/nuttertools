import { useEffect, useRef, useState } from 'react'

export default function CountdownTimer() {
  const [total, setTotal] = useState(300)
  const [left, setLeft] = useState(300)
  const [running, setRunning] = useState(false)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const start = performance.now()
    const base = left
    const tick = () => {
      const rem = base - (performance.now() - start) / 1000
      if (rem <= 0) { setLeft(0); setRunning(false); return }
      setLeft(rem)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const done = left <= 0

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <p className={`text-[72px] md:text-[96px] font-extrabold tabular-nums tracking-tight text-center ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>{fmt(left)}</p>
      {done && <p className="text-center text-lg font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">Time's up!</p>}
      <div className="flex flex-wrap justify-center gap-3">
        {!running && !done && (
          <button onClick={() => setRunning(true)} className="px-6 h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Start</button>
        )}
        {running && (
          <button onClick={() => setRunning(false)} className="px-6 h-11 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Pause</button>
        )}
        <button onClick={() => { setRunning(false); setLeft(total) }} className="px-6 h-11 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Reset</button>
      </div>
      {!running && !done && (
        <label className="block text-center">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-2">Duration (minutes)</span>
          <input type="number" min={0.1} step={0.5} value={(total / 60).toFixed(1)} onChange={(e) => { const s = Math.max(1, (parseFloat(e.target.value) || 1) * 60); setTotal(s); setLeft(s) }} className="w-32 h-11 px-3 text-center text-lg font-bold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </label>
      )}
    </div>
  )
}