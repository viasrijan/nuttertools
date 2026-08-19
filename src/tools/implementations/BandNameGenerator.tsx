import { useState } from 'react'
import { Select } from '../../components/ui/Select'

const ADJ = ['Atomic', 'Velvet', 'Midnight', 'Electric', 'Golden', 'Neon', 'Broken', 'Silver', 'Lucky', 'Angry', 'Cosmic', 'Tiny', 'Wild', 'Frozen', 'Starlight', 'Dirty', 'Pretty', 'Giant']
const NOUN = ['Felines', 'Rabbits', 'Kings', 'Pigeons', 'Volcanoes', 'Slippers', 'Orchids', 'Pianos', 'Comets', 'Cheeseburgers', 'Umbrellas', 'Camels', 'Teapots', 'Fireflies', 'Biscuits', 'Wolves']
const SUFFIX = ['& the Misfits', 'and the Robots', 'Express', 'Club', 'Avenue', 'Wars', 'Parade', 'Inc.', 'Collective', 'Hour']

export default function BandNameGenerator() {
  const [style, setStyle] = useState('The ___')
  const [count, setCount] = useState('8')

  const gen = () => {
    const n = Math.min(50, parseInt(count) || 8)
    const out: string[] = []
    for (let i = 0; i < n; i++) {
      const a = ADJ[Math.floor(Math.random() * ADJ.length)]
      const b = NOUN[Math.floor(Math.random() * NOUN.length)]
      out.push(style === 'The ___' ? `The ${a} ${b}` : style === '___ and the ___' ? `${a} and the ${b}` : `${a} ${b} ${SUFFIX[Math.floor(Math.random() * SUFFIX.length)]}`)
    }
    return out
  }

  const [names, setNames] = useState(gen)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Select label="Style" value={style} onChange={setStyle} options={[{ v: 'The ___', label: 'The ___ ___' }, { v: '___ and the ___', label: '___ and the ___' }, { v: '___ ___ Club', label: '___ ___ Club' }]} />
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