import { useState } from 'react'

import { Button } from '../../components/ui/Button'

const ANSWERS = ['Yes', 'No', 'Maybe']

export default function YesNo() {
  const [answer, setAnswer] = useState('')
  const [flipping, setFlipping] = useState(false)
  const [stats, setStats] = useState({ Yes: 0, No: 0, Maybe: 0 })

  const ask = () => {
    setFlipping(true)
    setAnswer('')
    setTimeout(() => {
      const a = ANSWERS[Math.floor(Math.random() * ANSWERS.length)]
      setAnswer(a)
      setStats((s) => ({ ...s, [a]: s[a as keyof typeof s] + 1 }))
      setFlipping(false)
    }, 600)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <button onClick={ask} disabled={flipping}
        className={`w-full h-40 border border-dashed border-zinc-300 dark:border-zinc-700 text-lg font-semibold transition ${flipping ? 'animate-pulse' : 'hover:border-green-500'}`}>
        {flipping ? 'Deciding…' : 'Ask the oracle'}
      </button>
      {answer && (
        <div className="border p-8 text-center">
          <div className={`text-5xl font-black tracking-tight ${answer === 'Yes' ? 'text-green-600 dark:text-green-400' : answer === 'No' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {answer}
          </div>
        </div>
      )}
      {(stats.Yes > 0 || stats.No > 0 || stats.Maybe > 0) && (
        <div className="flex gap-2 text-xs font-bold">
          {ANSWERS.map((a) => (
            <div key={a} className="flex-1 border px-3 py-2 text-center">
              <div>{a}</div>
              <div className="text-lg">{stats[a as keyof typeof stats]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
