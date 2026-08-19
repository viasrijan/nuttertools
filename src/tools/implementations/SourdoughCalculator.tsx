import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const HYDRATIONS = ['50% (stiff)', '70% (classic)', '80% (sourdough)', '100% (liquid)']
const PCTS = { '50% (stiff)': 0.5, '70% (classic)': 0.7, '80% (sourdough)': 0.8, '100% (liquid)': 1 }

export default function SourdoughCalculator() {
  const [flour, setFlour] = useState('1000')
  const [hydration, setHydration] = useState('80% (sourdough)')
  const [starter, setStarter] = useState('200')
  const [salt, setSalt] = useState('20')

  const F = parseFloat(flour) || 0
  const S = parseFloat(starter) || 0
  const saltG = parseFloat(salt) || 0
  const h = PCTS[hydration] ?? 0.8

  const starterFlour = S / (1 + h)
  const starterWater = S - starterFlour
  const addedWater = F * h - starterWater
  const totalFlour = F + starterFlour
  const saltPct = totalFlour ? (saltG / totalFlour) * 100 : 0
  const dough = F + S + addedWater + saltG
  const bulkMin = Math.round(totalFlour * (hydration.includes('100') ? 4 : 4.5))

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Flour (g)" type="number" value={flour} onChange={(e) => setFlour(e.target.value)} />
        <Select label="Hydration" value={hydration} onChange={setHydration} options={HYDRATIONS.map((s) => ({ v: s, label: s }))} />
        <Field label="Starter (g)" type="number" value={starter} onChange={(e) => setStarter(e.target.value)} />
        <Field label="Salt (g)" type="number" value={salt} onChange={(e) => setSalt(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Add water" value={`${Math.max(0, addedWater).toFixed(0)} g`} tone="good" />
        <Result label="Starter in recipe" value={`${starterFlour.toFixed(0)} g flour / ${starterWater.toFixed(0)} g water`} />
        <Result label="Salt %" value={`${saltPct.toFixed(2)}%`} />
        <Result label="Total dough" value={`${dough.toFixed(0)} g`} />
        <Result label="Bulk ferment" value={`≈ ${bulkMin} min at 74°F`} />
      </ResultGrid>
    </div>
  )
}