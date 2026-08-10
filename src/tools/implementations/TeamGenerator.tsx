import { useState } from 'react'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TeamGenerator() {
  const [names, setNames] = useState('')
  const [teamCount, setTeamCount] = useState(2)
  const [teams, setTeams] = useState<string[][]>([])

  const list = names.split('\n').map((s) => s.trim()).filter(Boolean)

  const generate = () => {
    if (list.length === 0) return
    const shuffled = shuffle(list)
    const t: string[][] = Array.from({ length: teamCount }, () => [])
    shuffled.forEach((n, i) => t[i % teamCount].push(n))
    setTeams(t)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Names (one per line)</label>
        <textarea value={names} onChange={(e) => setNames(e.target.value)} rows={8} spellCheck={false}
          placeholder={'Alice\nBob\nCharlie\nDiana\nEve\nFrank'}
          className="w-full border bg-transparent p-3 font-mono text-[13px] text-zinc-900 dark:text-white outline-none focus:border-indigo-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold text-zinc-900 dark:text-white">Teams</label>
        <input type="number" min="1" max="10" value={teamCount} onChange={(e) => setTeamCount(Math.min(10, Math.max(1, +e.target.value)))}
          className="border px-3 py-2 w-20 bg-transparent text-zinc-900 dark:text-white" />
        <button onClick={generate} disabled={list.length === 0}
          className={`px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold ${list.length === 0 ? 'opacity-40' : ''}`}>
          Generate teams
        </button>
      </div>
      {teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teams.map((t, i) => (
            <div key={i} className="border p-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400">Team {i + 1} · {t.length}</div>
              <ul className="mt-2 space-y-1 text-sm font-medium">
                {t.map((n, j) => <li key={j}>{n}</li>)}
                {t.length === 0 && <li className="text-zinc-400 text-[13px]">Empty</li>}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
