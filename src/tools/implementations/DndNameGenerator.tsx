import { useMemo, useState } from 'react'

const FIRST = ['Aria', 'Borin', 'Caelum', 'Draven', 'Elowen', 'Fenris', 'Gwendol', 'Haldir', 'Isolde', 'Jorvan', 'Kael', 'Lyra', 'Morrigan', 'Nyx', 'Orin', 'Prydwen', 'Quinn', 'Riven', 'Sylas', 'Thorne', 'Ursa', 'Vael', 'Wren', 'Xander', 'Ysmir', 'Zephyr']
const LAST = ['Ashvale', 'Blackthorn', 'Copperfield', 'Duskbane', 'Emberfall', 'Frostwood', 'Grimsbane', 'Hollowmere', 'Ironheart', 'Jadecrest', 'Kestrel', 'Lunara', 'Mistborne', 'Nightwind', 'Oakenfeld', 'Palehoof', 'Quicksilver', 'Ravenshade', 'Silverbark', 'Thunderpeak', 'Umbra', 'Vexley', 'Wildmere', 'Xenith', 'Yewholm', 'Zephyra']
const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Tiefling', 'Gnome', 'Half-Orc', 'Aasimar', 'Warforged']

export default function DndNameGenerator() {
  const [race, setRace] = useState('Human')
  const [count, setCount] = useState('10')

  const names = useMemo(() => {
    const n = Math.min(50, parseInt(count) || 10)
    const out: string[] = []
    for (let i = 0; i < n; i++) {
      const first = FIRST[Math.floor(Math.random() * FIRST.length)]
      const last = race === 'Elf' ? '· ' + ['Lorien', 'Silvanus', 'Faelind'][Math.floor(Math.random() * 3)] : race === 'Dwarf' ? ' son of ' + ['Barak', 'Durin', 'Thorin'][Math.floor(Math.random() * 3)] : ' ' + LAST[Math.floor(Math.random() * LAST.length)]
      out.push(first + last)
    }
    return out
  }, [race, count])

  const copy = () => navigator.clipboard?.writeText(names.join('\n')).catch(() => {})

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Race</span>
          <select value={race} onChange={(e) => setRace(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
            {RACES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <label className="block">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">Names</span>
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setCount((c) => c)} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Generate</button>
        <button onClick={copy} className="px-5 h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Copy all</button>
      </div>
      <div className="space-y-1">
        {names.map((n, i) => (
          <div key={i} className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 font-bold text-sm">{n}</div>
        ))}
      </div>
    </div>
  )
}