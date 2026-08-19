import { useEffect, useRef, useState } from 'react'

export default function Stopwatch() {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const lastRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!running) return
    lastRef.current = performance.now()
    const tick = () => {
      setMs((m) => m + (performance.now() - lastRef.current))
      lastRef.current = performance.now()
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  const fmt = (m: number) => {
    const h = Math.floor(m / 3600000)
    const min = Math.floor((m % 3600000) / 60000)
    const s = Math.floor((m % 60000) / 1000)
    const c = Math.floor((m % 1000) / 10)
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 max-w-xl">
      <p className="text-[56px] md:text-[72px] font-extrabold tabular-nums tracking-tight text-center text-zinc-900 dark:text-white">{fmt(ms)}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => { if (running) { setLaps((l) => [ms, ...l]); return } setRunning(true) }} className={`px-6 h-11 font-bold text-xs uppercase tracking-wider transition-colors ${running ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
          {running ? 'Lap' : 'Start'}
        </button>
        <button onClick={() => setRunning(false)} className="px-6 h-11 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Pause</button>
        <button onClick={() => { setRunning(false); setMs(0); setLaps([]) }} className="px-6 h-11 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Reset</button>
      </div>
      {laps.length > 0 && (
        <div className="space-y-1 max-h-60 overflow-auto">
          {laps.map((l, i) => (
            <div key={i} className="flex justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-sm font-bold tabular-nums">
              <span className="text-zinc-500 dark:text-zinc-400">Lap {laps.length - i}</span>
              <span>{fmt(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}