import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function TvDistance() {
  const [size, setSize] = useState('65')
  const [res, setRes] = useState('4k')

  const s = parseFloat(size) || 0
  const factor = res === '4k' ? 1.5 : res === '1080p' ? 2.5 : 4
  const min = s * factor
  const max = s * factor * 1.5
  const min1080 = s * 4

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="TV size (diagonal, in)" type="number" value={size} onChange={(e) => setSize(e.target.value)} />
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Resolution</span>
          <select value={res} onChange={(e) => setRes(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
            <option value="4k">4K UHD</option>
            <option value="1080p">1080p HD</option>
            <option value="720p">720p</option>
          </select>
        </div>
      </div>
      <ResultGrid>
        <Result label="Recommended range" value={`${min.toFixed(1)} – ${max.toFixed(1)} ft`} tone="good" />
        <Result label="Min distance (1080p)" value={`${min1080.toFixed(1)} ft`} />
        <Result label="Viewing angle (≈30°)" value={`${(s * 1.2).toFixed(1)} ft`} />
      </ResultGrid>
    </div>
  )
}