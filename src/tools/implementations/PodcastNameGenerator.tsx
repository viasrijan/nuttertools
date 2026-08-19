import { useState } from 'react'
import { Select } from '../../components/ui/Select'

const PRE = ['The', 'Beyond', 'Midnight', 'Story', 'Hidden', 'Weekly', 'Barely', 'About', 'Almost', 'Two']
const MID = ['Candidates', 'Tapes', 'Monologues', 'Podcasts', 'Questions', 'Fables', 'Takeaways', 'Rambles', 'Archives', 'Episodes']
const POST = ['with Friends', 'for Curious Minds', 'Show', 'Files', 'from the Basement', 'Hour', 'Club', 'and Chill', 'you didn\'t ask for', 'of Everything']

export default function PodcastNameGenerator() {
  const [count, setCount] = useState('8')

  const gen = () => {
    const n = Math.min(50, parseInt(count) || 8)
    const out: string[] = []
    for (let i = 0; i < n; i++) {
      const p = Math.random()
      const pre = PRE[Math.floor(Math.random() * PRE.length)]
      const mid = MID[Math.floor(Math.random() * MID.length)]
      const post = POST[Math.floor(Math.random() * POST.length)]
      out.push(p < 0.4 ? `${pre} ${mid}` : p < 0.7 ? `${pre} ${mid} ${post}` : `${mid} ${post}`)
    }
    return out
  }

  const [names, setNames] = useState(gen)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="max-w-[220px]">
        <label className="block">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">Names</span>
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setNames(gen())} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Generate</button>
        <button onClick={() => navigator.clipboard?.writeText(names.join('\n')).catch(() => {})} className="px-5 h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Copy all</button>
      </div>
      <div className="space-y-1">
        {names.map((n, i) => (
          <div key={i} className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 font-bold text-sm">{n}</div>
        ))}
      </div>
    </div>
  )
}