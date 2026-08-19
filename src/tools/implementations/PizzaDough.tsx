import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

const STYLES = ['Neapolitan', 'New York', 'Chicago deep-dish', 'Sicilian', 'Thin & crispy']

const YIELDS: Record<string, number> = { 'Neapolitan': 0.62, 'New York': 0.55, 'Chicago deep-dish': 0.5, 'Sicilian': 0.58, 'Thin & crispy': 0.6 }

export default function PizzaDough() {
  const [servings, setServings] = useState('2')
  const [style, setStyle] = useState('Neapolitan')
  const [hydration, setHydration] = useState('65')

  const n = parseInt(servings) || 2
  const y = YIELDS[style] ?? 0.62
  const flour = (n * 285) / y
  const water = flour * ((parseFloat(hydration) || 65) / 100)
  const salt = flour * 0.025
  const yeast = flour * 0.005
  const total = flour + water + salt + yeast

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Pizzas" type="number" value={servings} onChange={(e) => setServings(e.target.value)} />
        <Select label="Style" value={style} onChange={setStyle} options={STYLES.map((s) => ({ v: s, label: s }))} />
        <Field label="Hydration %" type="number" value={hydration} onChange={(e) => setHydration(e.target.value)} hint="60–70 typical" />
      </div>
      <ResultGrid>
        <Result label="Flour" value={`${flour.toFixed(0)} g`} tone="good" />
        <Result label="Water" value={`${water.toFixed(0)} g (${hydration}%)`} tone="good" />
        <Result label="Salt" value={`${salt.toFixed(0)} g`} />
        <Result label="Instant yeast" value={`${yeast.toFixed(1)} g`} />
        <Result label="Total dough" value={`${total.toFixed(0)} g (${(total / n).toFixed(0)} g each)`} />
      </ResultGrid>
    </div>
  )
}