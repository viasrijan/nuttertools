import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

const CYCLE = 90

function shiftTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = (h * 60 + m + minutes + 1440) % 1440
  const H = String(Math.floor(total / 60)).padStart(2, '0')
  const M = String(total % 60).padStart(2, '0')
  return `${H}:${M}`
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

export default function SleepCycleCalculator() {
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake')
  const [time, setTime] = useState('07:00')

  const cycles = [6, 5, 4, 3].map((n) => n * CYCLE)
  const times = cycles.map((m) => ({ minutes: m, time: shiftTime(time, mode === 'wake' ? -m : m) }))
  const labels = ['Best (6 cycles)', 'Good (5 cycles)', 'Okay (4 cycles)', 'Minimal (3 cycles)']

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex gap-2.5">
        {([['wake', 'I wake up at…'], ['sleep', 'I go to bed at…']] as const).map(([m, label]) => (
          <Button variant="outline" key={m} onClick={() => setMode(m)} className={`px-4 h-10 text-sm font-semibold ${mode === m ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : 'ring-1 ring-zinc-200 dark:ring-zinc-800'}`}>
            {label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
          className="border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none focus:border-indigo-600 text-lg" />
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{mode === 'wake' ? 'Waking at' : 'Falling asleep at'} {formatTime(time)}</span>
      </div>
      <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
        {times.map((t, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="font-bold text-lg">{formatTime(t.time)}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{labels[i]} · {t.minutes / 60} hrs sleep</div>
            </div>
            <CopyButton value={t.time} />
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Based on the average 90-minute sleep cycle. Aim to wake at the end of a cycle, not during deep sleep. Timings are estimates, not medical advice.</p>
    </div>
  )
}
