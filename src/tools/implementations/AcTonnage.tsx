import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function AcTonnage() {
  const [area, setArea] = useState('800')
  const [zone, setZone] = useState('mild')

  const a = parseFloat(area) || 0
  const factor = zone === 'hot' ? 25 : zone === 'cool' ? 18 : 20
  const btu = a * factor
  const tons = btu / 12000

  const rec = (t: number) => {
    if (t <= 1.5) return '1.5'
    if (t <= 2) return '2'
    if (t <= 2.5) return '2.5'
    if (t <= 3) return '3'
    if (t <= 3.5) return '3.5'
    if (t <= 4) return '4'
    if (t <= 5) return '5'
    return '5+'
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Conditioned area (ft²)" type="number" value={area} onChange={(e) => setArea(e.target.value)} />
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Climate</span>
          <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
            <option value="mild">Mild</option>
            <option value="hot">Hot</option>
            <option value="cool">Cool</option>
          </select>
        </div>
      </div>
      <ResultGrid>
        <Result label="Cooling load" value={`${btu.toLocaleString()} BTU/hr`} />
        <Result label="Calculated tonnage" value={`${tons.toFixed(1)} tons`} tone="good" />
        <Result label="Recommended AC size" value={`${rec(tons)} tons`} tone="good" />
      </ResultGrid>
    </div>
  )
}