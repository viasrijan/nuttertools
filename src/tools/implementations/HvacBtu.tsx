import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

export default function HvacBtu() {
  const [area, setArea] = useState('400')
  const [height, setHeight] = useState('8')
  const [zone, setZone] = useState('moderate')
  const [sun, setSun] = useState('normal')
  const [people, setPeople] = useState('2')
  const [kitchen, setKitchen] = useState(false)

  const a = parseFloat(area) || 0
  const h = parseFloat(height) || 8
  const base = a * h * (zone === 'hot' ? 1.35 : zone === 'cold' ? 1.1 : 1.2)
  const sunBtu = sun === 'full' ? base * 0.1 : sun === 'shaded' ? -base * 0.05 : 0
  const peopleBtu = (parseInt(people) || 2) * 500
  const kitchenBtu = kitchen ? 4000 : 0
  const total = base + sunBtu + peopleBtu + kitchenBtu
  const tons = total / 12000

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Area (ft²)" type="number" value={area} onChange={(e) => setArea(e.target.value)} />
        <Field label="Ceiling (ft)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        <Field label="People" type="number" value={people} onChange={(e) => setPeople(e.target.value)} />
        <Select label="Climate" value={zone} onChange={setZone} options={[{ v: 'moderate', label: 'Moderate' }, { v: 'hot', label: 'Hot' }, { v: 'cold', label: 'Cold' }]} />
        <Select label="Sun exposure" value={sun} onChange={setSun} options={[{ v: 'normal', label: 'Normal' }, { v: 'full', label: 'Full sun' }, { v: 'shaded', label: 'Shaded' }]} />
      </div>
      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
        <input type="checkbox" checked={kitchen} onChange={(e) => setKitchen(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
        Kitchen included (+4,000 BTU)
      </label>
      <ResultGrid>
        <Result label="Cooling load" value={`${Math.round(total).toLocaleString()} BTU/hr`} tone="good" />
        <Result label="AC size" value={`${(tons).toFixed(2)} tons`} />
        <Result label="Heating estimate" value={`${Math.round(total * 1.25).toLocaleString()} BTU/hr`} />
      </ResultGrid>
    </div>
  )
}