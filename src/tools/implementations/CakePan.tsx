import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const SHAPES = ['Round 9" (23 cm)', 'Square 9" (23 cm)', 'Round 8" (20 cm)', 'Round 6" (15 cm)', 'Sheet 9×13" (33×23 cm)', 'Tube/bundt 10" (25 cm)']

const AREAS: Record<string, number> = { 'Round 9" (23 cm)': Math.PI * 9 * 9 / 4, 'Square 9" (23 cm)': 81, 'Round 8" (20 cm)': Math.PI * 8 * 8 / 4, 'Round 6" (15 cm)': Math.PI * 6 * 6 / 4, 'Sheet 9×13" (33×23 cm)': 117, 'Tube/bundt 10" (25 cm)': 78 }

export default function CakePan() {
  const [from, setFrom] = useState('Round 9" (23 cm)')
  const [to, setTo] = useState('Sheet 9×13" (33×23 cm)')

  const f = AREAS[from] ?? 63.6
  const t = AREAS[to] ?? 117
  const factor = t / f
  const timeFactor = Math.sqrt(factor)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="From pan" value={from} onChange={setFrom} options={SHAPES.map((s) => ({ v: s, label: s }))} />
        <Select label="To pan" value={to} onChange={setTo} options={SHAPES.map((s) => ({ v: s, label: s }))} />
      </div>
      <ResultGrid>
        <Result label="Scale factor" value={`× ${factor.toFixed(2)}`} tone="good" />
        <Result label="Every ingredient" value={`× ${factor.toFixed(2)}`} tone="good" />
        <Result label="Bake time change" value={`× ${timeFactor.toFixed(2)}`} />
      </ResultGrid>
      <p className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">Multiply each ingredient by the scale factor. Baking time roughly scales by the square root — check doneness earlier than the usual time.</p>
    </div>
  )
}