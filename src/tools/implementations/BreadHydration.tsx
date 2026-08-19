import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function BreadHydration() {
  const [flour, setFlour] = useState('500')
  const [water, setWater] = useState('350')
  const [starter, setStarter] = useState('100')
  const [salt, setSalt] = useState('10')

  const F = parseFloat(flour) || 0
  const W = parseFloat(water) || 0
  const S = parseFloat(starter) || 0
  const saltW = parseFloat(salt) || 0

  const starterFlour = S * 0.5
  const starterWater = S * 0.5
  const totalFlour = F + starterFlour
  const totalWater = W + starterWater
  const hydration = totalFlour ? (totalWater / totalFlour) * 100 : 0
  const saltPct = totalFlour ? (saltW / totalFlour) * 100 : 0
  const doughWeight = F + W + S + saltW
  const description = hydration < 60 ? 'Stiff dough — good for bagels & buns' : hydration < 70 ? 'Classic country bread range' : hydration < 80 ? 'High hydration — open crumb, sticky dough' : 'Very high hydration — ciabatta territory, handle gently'

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Flour (g)" type="number" value={flour} onChange={(e) => setFlour(e.target.value)} />
        <Field label="Water (g)" type="number" value={water} onChange={(e) => setWater(e.target.value)} />
        <Field label="Starter (g)" type="number" value={starter} onChange={(e) => setStarter(e.target.value)} hint="100% hydration" />
        <Field label="Salt (g)" type="number" value={salt} onChange={(e) => setSalt(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Hydration" value={`${hydration.toFixed(1)}%`} tone="good" />
        <Result label="Baker's salt" value={`${saltPct.toFixed(2)}%`} />
        <Result label="Dough weight" value={`${doughWeight.toFixed(0)} g`} />
      </ResultGrid>
      <p className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  )
}