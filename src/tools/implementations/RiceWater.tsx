import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const RICE: Record<string, { water: number, yield: number, time: string }> = {
  'White long-grain': { water: 2, yield: 3, time: '15–18 min' },
  'White short-grain': { water: 1.25, yield: 2.5, time: '18–20 min' },
  'Basmati': { water: 1.75, yield: 3, time: '15 min' },
  'Jasmine': { water: 1.5, yield: 3, time: '12–15 min' },
  'Brown': { water: 2.5, yield: 3.5, time: '40–50 min' },
  'Wild': { water: 3, yield: 4, time: '45 min' },
}

export default function RiceWater() {
  const [rice, setRice] = useState('1')
  const [type, setType] = useState('White long-grain')
  const [servings, setServings] = useState('2')

  const r = parseFloat(rice) || 0
  const R = RICE[type] ?? RICE['White long-grain']
  const water = r * R.water
  const yieldAmt = r * R.yield
  const perPerson = r / (parseInt(servings) || 2)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Rice (cups or g)" type="number" value={rice} onChange={(e) => setRice(e.target.value)} />
        <Select label="Rice type" value={type} onChange={setType} options={Object.keys(RICE).map((k) => ({ v: k, label: k }))} />
        <Field label="Servings" type="number" value={servings} onChange={(e) => setServings(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Water needed" value={`${water.toFixed(2)} × rice`} tone="good" />
        <Result label="Cooked yield" value={`${yieldAmt.toFixed(1)} × rice`} />
        <Result label="Per serving" value={`${perPerson.toFixed(2)} × rice`} />
        <Result label="Cook time" value={R.time} />
      </ResultGrid>
    </div>
  )
}