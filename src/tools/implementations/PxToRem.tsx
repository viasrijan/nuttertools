import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result } from '../../components/ui/Result'

export default function PxToRem() {
  const [px, setPx] = useState('16')
  const [rem, setRem] = useState('1')
  const [root, setRoot] = useState('16')
  const [direction, setDirection] = useState<'px' | 'rem'>('px')

  const rootN = parseFloat(root) || 16
  const pxN = parseFloat(px) || 0
  const remN = parseFloat(rem) || 0

  const table = [8, 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 64].map((v) => ({
    px: v,
    rem: +(v / rootN).toFixed(4),
  }))

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Root font size (px)" value={root} onChange={(e) => setRoot(e.target.value)} />
        <Field label={direction === 'px' ? 'Pixels' : 'REM'} value={direction === 'px' ? px : rem} onChange={(e) => (direction === 'px' ? setPx(e.target.value) : setRem(e.target.value))} />
      </div>
      <div className="flex flex-wrap gap-2">
        {(['px', 'rem'] as const).map((d) => (
          <button key={d} onClick={() => setDirection(d)} className={`px-4 h-9 text-xs font-bold uppercase tracking-wider ${direction === d ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'} transition-colors`}>
            Convert {d.toUpperCase()} → {d === 'px' ? 'REM' : 'PX'}
          </button>
        ))}
      </div>
      <div className="grid gap-2 max-w-md">
        {direction === 'px' ? (
          <>
            <Result label={`${pxN}px with ${rootN}px root`} value={`${(pxN / rootN).toFixed(4)}rem`} tone="good" />
            <Result label={`${pxN}px with 16px root`} value={`${(pxN / 16).toFixed(4)}rem`} />
          </>
        ) : (
          <>
            <Result label={`${remN}rem with ${rootN}px root`} value={`${(remN * rootN).toFixed(1)}px`} tone="good" />
            <Result label={`${remN}rem with 16px root`} value={`${(remN * 16).toFixed(1)}px`} />
          </>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full max-w-md text-sm">
          <thead>
            <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2 pr-4">Pixels</th>
              <th className="py-2">REM (root {rootN}px)</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r) => (
              <tr key={r.px} className="border-b border-zinc-100 dark:border-zinc-800/60">
                <td className="py-2 pr-4 font-bold text-zinc-900 dark:text-white">{r.px}px</td>
                <td className="py-2 font-semibold text-zinc-600 dark:text-zinc-300">{r.rem}rem</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}