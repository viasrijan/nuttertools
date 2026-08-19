import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const CUTS: Record<string, { f: number, rest: string, note: string }> = {
  'Whole chicken': { f: 350, rest: 'Rest 10–15 min', note: 'Breast reaches 165°F, thigh 175°F' },
  'Chicken breast': { f: 400, rest: 'Rest 5 min', note: 'Target 165°F' },
  'Chicken thighs': { f: 400, rest: 'Rest 5 min', note: 'Target 175°F' },
  'Beef steak': { f: 450, rest: 'Rest 5–10 min', note: 'Rare 125°F · Med 140°F · Well 160°F' },
  'Pork chop': { f: 425, rest: 'Rest 5 min', note: 'Target 145°F' },
  'Pork loin': { f: 375, rest: 'Rest 10 min', note: 'Target 145°F' },
  'Salmon fillet': { f: 400, rest: 'Rest 5 min', note: 'Target 130°F, flakes at 145°F' },
  'White fish': { f: 400, rest: 'Rest 3–5 min', note: 'Target 145°F' },
  'Lamb chops': { f: 450, rest: 'Rest 5 min', note: 'Medium 145°F' },
  'Turkey breast': { f: 325, rest: 'Rest 15 min', note: 'Target 165°F' },
}

export default function MeatCookingTime() {
  const [cut, setCut] = useState('Chicken breast')
  const [weight, setWeight] = useState('500')
  const [method, setMethod] = useState('bake')

  const c = CUTS[cut] ?? CUTS['Chicken breast']
  const g = parseFloat(weight) || 0
  const minPerG = c.f / 1000
  const total = g * minPerG * (method === 'bake' ? 1 : 0.85)
  const minutes = Math.round(total)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select label="Cut" value={cut} onChange={setCut} options={Object.keys(CUTS).map((k) => ({ v: k, label: k }))} />
        <Field label="Weight (g)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Select label="Method" value={method} onChange={setMethod} options={[{ v: 'bake', label: 'Oven bake/roast' }, { v: 'grill', label: 'Grill / pan' }]} />
      </div>
      <ResultGrid>
        <Result label="Cook time" value={`${h > 0 ? h + ' hr ' : ''}${m} min`} tone="good" />
        <Result label="Temp" value={`${c.f}°F (${Math.round((c.f - 32) * 5 / 9)}°C)`} />
        <Result label={c.rest} value={c.note} />
      </ResultGrid>
    </div>
  )
}