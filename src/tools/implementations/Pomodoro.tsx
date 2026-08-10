import { useEffect, useRef, useState } from 'react'

const WORK = 25 * 60, SHORT = 5 * 60, LONG = 15 * 60

export default function Pomodoro() {
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work')
  const [left, setLeft] = useState(WORK)
  const [running, setRunning] = useState(false)
  const [rounds, setRounds] = useState(0)
  const [tasks, setTasks] = useState<string[]>(['Plan the day', 'Deep work on NutterTools'])
  const [task, setTask] = useState('')
  const intervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setLeft(l => {
          if (l <= 1) {
            setRunning(false)
            setRounds(r => r + 1)
            playChime()
            if (mode === 'work') setMode(rounds % 4 === 3 ? 'long' : 'short')
            return mode === 'work' ? (rounds % 4 === 3 ? LONG : SHORT) : WORK
          }
          return l - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode, rounds])

  const playChime = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAAAAAAAAAQ=='
    }
    audioRef.current.play().catch(() => {})
  }

  const switchMode = (m: typeof mode) => { setMode(m); setLeft(m === 'work' ? WORK : m === 'short' ? SHORT : LONG); setRunning(false) }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const pct = ((mode === 'work' ? WORK : mode === 'short' ? SHORT : LONG) - left) / (mode === 'work' ? WORK : mode === 'short' ? SHORT : LONG) * 100

  return (
    <div className="space-y-5 max-w-lg">
      <div className="flex gap-2">
        <button onClick={() => switchMode('work')} className={`px-4 h-9 text-sm border ${mode === 'work' ? 'bg-red-600 text-white' : ''}`}>Work 25</button>
        <button onClick={() => switchMode('short')} className={`px-4 h-9 text-sm border ${mode === 'short' ? 'bg-emerald-600 text-white' : ''}`}>Short 5</button>
        <button onClick={() => switchMode('long')} className={`px-4 h-9 text-sm border ${mode === 'long' ? 'bg-sky-600 text-white' : ''}`}>Long 15</button>
      </div>
      <div className="border p-8 text-center">
        <div className="relative w-44 h-44 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-zinc-200 dark:stroke-zinc-700" />
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 283} 283`}
              className={mode === 'work' ? 'stroke-red-500' : 'stroke-emerald-500'} />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div>
              <div className="text-4xl font-bold font-mono tabular-nums">{fmt(left)}</div>
              <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">{mode}</div>
            </div>
          </div>
        </div>
        <button onClick={() => setRunning(!running)} className={`mt-6 px-8 h-12 text-sm font-semibold ${running ? 'bg-zinc-700 text-white' : 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600'}`}>
          {running ? 'Pause' : left === (mode === 'work' ? WORK : mode === 'short' ? SHORT : LONG) ? 'Start' : 'Resume'}
        </button>
        <button onClick={() => { setLeft(mode === 'work' ? WORK : mode === 'short' ? SHORT : LONG); setRunning(false) }} className="px-4 h-12 border text-sm ml-2">Reset</button>
        <p className="mt-3 text-sm font-medium text-zinc-500">Completed pomodoros: <b className="text-zinc-900 dark:text-white">{rounds}</b> 🍅</p>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Tasks</p>
        <div className="flex gap-2 mb-2">
          <input value={task} onChange={e => setTask(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && task.trim()) { setTasks([...tasks, task.trim()]); setTask('') } }} className="flex-1 border px-3 h-9 text-sm" placeholder="Add a task…" />
          <button onClick={() => { if (task.trim()) { setTasks([...tasks, task.trim()]); setTask('') } }} className="px-4 h-9 border text-sm">Add</button>
        </div>
        <ul className="space-y-1">
          {tasks.map((t, i) => (
            <li key={i} className="flex items-center gap-2 border px-3 py-2 text-sm">
              <input type="checkbox" className="accent-emerald-500" />
              <span className="flex-1">{t}</span>
              <button onClick={() => setTasks(tasks.filter((_, x) => x !== i))} className="text-xs text-zinc-400 hover:text-red-500">✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
