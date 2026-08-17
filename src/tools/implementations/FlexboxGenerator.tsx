import { useState } from 'react'

import { Button } from '../../components/ui/Button'

const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse']
const JUSTIFY = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']
const ALIGN = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline']
const WRAP = ['nowrap', 'wrap', 'wrap-reverse']
const COLORS = ['#6366f1', '#f97316', '#10b981', '#ec4899', '#14b8a6', '#f59e0b']

export default function FlexboxGenerator() {
  const [direction, setDirection] = useState('row')
  const [justify, setJustify] = useState('flex-start')
  const [align, setAlign] = useState('stretch')
  const [wrap, setWrap] = useState('nowrap')
  const [gap, setGap] = useState(8)
  const [count, setCount] = useState(3)
  const [copied, setCopied] = useState(false)

  const css = `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}`

  const copy = async () => {
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const sel = (label: string, value: string, set: (v: string) => void, options: string[]) => (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}
        className="w-full border px-2 py-2 bg-transparent text-zinc-900 dark:text-white outline-none text-sm">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )

  return (
    <div className="space-y-5 max-w-2xl omni-rise">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sel('Direction', direction, setDirection, DIRECTIONS)}
        {sel('Justify content', justify, setJustify, JUSTIFY)}
        {sel('Align items', align, setAlign, ALIGN)}
        {sel('Flex wrap', wrap, setWrap, WRAP)}
        <label className="block">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">Gap</span>
          <input type="number" min="0" max="64" value={gap} onChange={(e) => setGap(Math.min(64, Math.max(0, +e.target.value)))}
            className="w-full border px-2 py-2 bg-transparent text-zinc-900 dark:text-white outline-none text-sm" />
        </label>
        <label className="block">
          <span className="block text-[11px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">Items</span>
          <input type="number" min="1" max="8" value={count} onChange={(e) => setCount(Math.min(8, Math.max(1, +e.target.value)))}
            className="w-full border px-2 py-2 bg-transparent text-zinc-900 dark:text-white outline-none text-sm" />
        </label>
      </div>
      <div className="border p-4 bg-[#ececec] dark:bg-[#1a1a1a]">
        <div className="border border-dashed border-zinc-300 dark:border-zinc-700 p-4 min-h-[180px]"
          style={{ display: 'flex', flexDirection: direction as React.CSSProperties['flexDirection'], justifyContent: justify, alignItems: align, flexWrap: wrap as React.CSSProperties['flexWrap'], gap }}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="w-16 h-16 grid place-items-center text-white font-bold"
              style={{ background: COLORS[i % COLORS.length] }}>{i + 1}</div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-start">
        <textarea value={css} readOnly rows={7} spellCheck={false}
          className="flex-1 min-w-[220px] border bg-transparent p-3 font-mono text-[13px] text-zinc-900 dark:text-white outline-none" />
        <Button variant="secondary" onClick={copy}>{copied ? 'Copied!' : 'Copy CSS'}</Button>
      </div>
    </div>
  )
}
