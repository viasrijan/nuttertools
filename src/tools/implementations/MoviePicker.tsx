import { useState } from 'react'

import { Button } from '../../components/ui/Button'

const TITLES = [
  'The Shawshank Redemption', 'Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction',
  'The Godfather', 'Forrest Gump', 'The Matrix', 'Fight Club', 'The Lord of the Rings',
  'Star Wars', 'Back to the Future', 'Jurassic Park', 'Titanic', 'Avatar',
  'Avengers: Endgame', 'Spider-Man', 'Black Panther', 'Toy Story', 'Finding Nemo',
  'The Lion King', 'Frozen', 'The Incredibles', 'Coco', 'Spirited Away',
  'Howl\u2019s Moving Castle', 'La La Land', 'Whiplash', 'Parasite', 'The Grand Budapest Hotel',
  'The Social Network', 'Gladiator', 'The Prestige', 'Shutter Island', 'Gone Girl',
  'Mad Max: Fury Road', 'Dune', 'Arrival', 'The Martian', 'Knives Out',
  'Stranger Things', 'Breaking Bad', 'The Office', 'Friends', 'Game of Thrones',
]

export default function MoviePicker() {
  const [pool, setPool] = useState(TITLES)
  const [custom, setCustom] = useState('')
  const [pick, setPick] = useState('')
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const all = [...pool, ...custom.split('\n').map((s) => s.trim()).filter(Boolean)]

  const reroll = () => {
    if (all.length === 0) return
    setRolling(true)
    setTimeout(() => {
      const chosen = all[Math.floor(Math.random() * all.length)]
      setPick(chosen)
      setHistory((h) => [chosen, ...h].slice(0, 5))
      setRolling(false)
    }, 500)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <button onClick={reroll} disabled={all.length === 0 || rolling}
        className={`w-full h-40 border border-dashed border-zinc-300 dark:border-zinc-700 text-lg font-semibold transition ${rolling ? 'animate-pulse' : 'hover:border-green-500'}`}>
        {rolling ? 'Rolling…' : pick ? `🎬 ${pick}` : 'Pick a movie or show for me'}
      </button>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{all.length} titles in the pool</span>
        <Button variant="subtle" size="sm" onClick={() => { setPick(''); setHistory([]) }}>Reset</Button>
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Add your own titles (one per line)</label>
        <textarea value={custom} onChange={(e) => setCustom(e.target.value)} rows={3} spellCheck={false}
          placeholder={'Breaking Bad\nSpirited Away'}
          className="w-full border bg-transparent p-3 text-[13px] text-zinc-900 dark:text-white outline-none focus:border-indigo-600" />
      </div>
      {history.length > 0 && (
        <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          {history.map((h, i) => (
            <div key={i} className="flex justify-between px-3 py-2">
              <span>{h}</span>
              <span className="text-zinc-400 font-bold">#{history.length - i}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
