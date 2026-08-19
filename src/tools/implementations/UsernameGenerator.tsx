import { useState } from 'react'

import { Button } from '../../components/ui/Button'

const ADJ = ['Swift', 'Clever', 'Brave', 'Cosmic', 'Fuzzy', 'Neon', 'Silent', 'Mighty', 'Quirky', 'Lucky', 'Wild', 'Gentle', 'Bold', 'Crimson', 'Golden', 'Rapid', 'Noble', 'Vivid', 'Lunar', 'Solar', 'Sneaky', 'Cheerful', 'Mellow', 'Prickly', 'Zesty', 'Frosty', 'Jolly', 'Shiny', 'Turbo', 'Epic']
const NOUN = ['Tiger', 'Panda', 'Falcon', 'Dolphin', 'Wolf', 'Fox', 'Otter', 'Hawk', 'Lynx', 'Orca', 'Raven', 'Badger', 'Coyote', 'Heron', 'Koi', 'Lion', 'Moose', 'Owl', 'Puma', 'Quail', 'Salmon', 'Toucan', 'Viper', 'Walrus', 'Zebra', 'Bison', 'Crane', 'Gecko', 'Ibex', 'Jaguar']

const caseMap = (s: string, mode: string) =>
  mode === 'upper' ? s.toUpperCase() : mode === 'lower' ? s.toLowerCase() : s

export default function UsernameGenerator() {
  const [count, setCount] = useState(8)
  const [numbers, setNumbers] = useState(true)
  const [separator, setSeparator] = useState('')
  const [caseMode, setCaseMode] = useState('title')
  const [keyword, setKeyword] = useState('')
  const [names, setNames] = useState<string[]>([])
  const [copied, setCopied] = useState('')

  const generate = () => {
    const out: string[] = []
    const base = keyword.trim()
    while (out.length < count) {
      const a = ADJ[Math.floor(Math.random() * ADJ.length)]
      const n = NOUN[Math.floor(Math.random() * NOUN.length)]
      const num = numbers ? String(Math.floor(Math.random() * 900) + 100) : ''
      let un: string
      if (base) {
        const stem = base.replace(/\s+/g, separator || '').toLowerCase()
        un = caseMap(stem + separator + n + num, caseMode)
      } else {
        un = caseMap(a + separator + n + num, caseMode)
        if (separator === '') un = a.toLowerCase() + n.charAt(0).toUpperCase() + n.slice(1) + num
      }
      if (!out.includes(un)) out.push(un)
    }
    setNames(out)
  }

  const copy = async (name: string) => {
    await navigator.clipboard.writeText(name)
    setCopied(name)
    setTimeout(() => setCopied(''), 1200)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap gap-4 text-sm">
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
          placeholder="Your word (optional)…" className="flex-1 min-w-[160px] h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        <label className="flex items-center gap-2 font-medium">
          Count
          <input type="number" min="1" max="25" value={count} onChange={(e) => setCount(Math.min(25, Math.max(1, +e.target.value)))}
            className="border px-2 py-1.5 w-16 bg-transparent text-zinc-900 dark:text-white" />
        </label>
        <label className="flex items-center gap-2 font-medium">
          <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} className="accent-green-600" />
          Numbers
        </label>
        <label className="flex items-center gap-2 font-medium">
          Separator
          <select value={separator} onChange={(e) => setSeparator(e.target.value)}
            className="border px-2 py-1.5 bg-transparent text-zinc-900 dark:text-white">
            <option value="">None</option>
            <option value="-">dash</option>
            <option value="_">underscore</option>
            <option value=".">dot</option>
          </select>
        </label>
        <label className="flex items-center gap-2 font-medium">
          Style
          <select value={caseMode} onChange={(e) => setCaseMode(e.target.value)}
            className="border px-2 py-1.5 bg-transparent text-zinc-900 dark:text-white">
            <option value="title">Title case</option>
            <option value="lower">lowercase</option>
            <option value="upper">UPPERCASE</option>
          </select>
        </label>
        <Button variant="secondary" onClick={generate} className="font-semibold ml-auto">Generate</Button>
      </div>
      {names.length > 0 && (
        <div className="border divide-y divide-zinc-200 dark:divide-zinc-800">
          {names.map((n) => (
            <div key={n} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="font-mono font-semibold text-zinc-900 dark:text-white">{n}</span>
              <Button variant="ghost" size="sm" className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0">{copied === n ? 'Copied!' : 'Copy'}</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
