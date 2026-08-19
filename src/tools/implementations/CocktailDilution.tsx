import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function CocktailDilution() {
  const [spirit, setSpirit] = useState('60')
  const [abv, setAbv] = useState('40')
  const [target, setTarget] = useState('30')
  const [ice, setIce] = useState('50')

  const S = parseFloat(spirit) || 0
  const A = parseFloat(abv) || 40
  const T = parseFloat(target) || 30
  const I = parseFloat(ice) || 0

  const needed = S * (A / T - 1)
  const afterIce = S * A / (S + needed + I / 100 * (needed + S))
  const shake = I > 0 ? (afterIce / 100) * (needed + S) : 0

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Spirit (ml)" type="number" value={spirit} onChange={(e) => setSpirit(e.target.value)} />
        <Field label="ABV %" type="number" value={abv} onChange={(e) => setAbv(e.target.value)} />
        <Field label="Target ABV %" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
        <Field label="Ice melt %" type="number" value={ice} onChange={(e) => setIce(e.target.value)} hint="Stirred ≈ 20–30%, shaken ≈ 35–50%" />
      </div>
      {needed >= 0 ? (
        <ResultGrid>
          <Result label="Water needed" value={`${needed.toFixed(1)} ml`} tone="good" />
          <Result label="Ice adds" value={`≈ ${shake.toFixed(1)} ml`} />
          <Result label="Final volume" value={`${(S + needed).toFixed(1)} ml`} />
        </ResultGrid>
      ) : (
        <p className="text-sm font-semibold text-rose-600">Target ABV can't be above the spirit's ABV.</p>
      )}
    </div>
  )
}