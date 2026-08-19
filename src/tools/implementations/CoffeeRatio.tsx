import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const RATIOS: Record<string, number> = { 'Espresso (1:2)': 1 / 2, 'Moka (1:8)': 1 / 8, 'V60 (1:16)': 1 / 16, 'French press (1:15)': 1 / 15, 'Cold brew (1:8)': 1 / 8, 'AeroPress (1:14)': 1 / 14 }

export default function CoffeeRatio() {
  const [servings, setServings] = useState('2')
  const [cup, setCup] = useState('250')
  const [style, setStyle] = useState('V60 (1:16)')

  const S = parseInt(servings) || 1
  const C = parseFloat(cup) || 250
  const ratio = RATIOS[style] ?? 1 / 16

  const water = S * C
  const coffee = water * ratio
  const coffeeGrams = style === 'Espresso (1:2)' ? water * ratio : coffee

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Servings" type="number" value={servings} onChange={(e) => setServings(e.target.value)} />
        <Field label="Cup size (ml)" type="number" value={cup} onChange={(e) => setCup(e.target.value)} />
        <Select label="Brew style" value={style} onChange={setStyle} options={Object.keys(RATIOS).map((k) => ({ v: k, label: k }))} />
      </div>
      <ResultGrid>
        <Result label="Water needed" value={`${water.toFixed(0)} ml`} tone="good" />
        <Result label="Coffee grounds" value={`${coffeeGrams.toFixed(1)} g`} tone="good" />
        <Result label="Ratio" value={style} />
      </ResultGrid>
    </div>
  )
}