import { useState } from 'react'

import { Button } from '../../components/ui/Button'

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300' }
  if (bmi < 25) return { label: 'Healthy', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' }
  if (bmi < 30) return { label: 'Overweight', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' }
  return { label: 'Obese', color: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300' }
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('70')

  const h = parseFloat(height), w = parseFloat(weight)
  const bmi = unit === 'metric'
    ? (h > 0 ? w / Math.pow(h / 100, 2) : 0)
    : (h > 0 ? 703 * w / Math.pow(h, 2) : 0)
  const cat = bmiCategory(bmi)
  const healthyMin = unit === 'metric' ? 18.5 * Math.pow(h / 100, 2) : 18.5 * Math.pow(h, 2) / 703
  const healthyMax = unit === 'metric' ? 24.9 * Math.pow(h / 100, 2) : 24.9 * Math.pow(h, 2) / 703

  const pos = Math.max(10, Math.min(90, ((bmi - 15) / (40 - 15)) * 80 + 10))

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={() => setUnit('metric')} className={`px-4 h-9 text-sm  ${unit === 'metric' ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>Metric</Button>
        <Button variant="outline" onClick={() => setUnit('imperial')} className={`px-4 h-9 text-sm  ${unit === 'imperial' ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>Imperial</Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold">{unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full border px-3 h-9 mt-1" /></label>
        <label className="block text-sm font-semibold">{unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full border px-3 h-9 mt-1" /></label>
      </div>
      {isFinite(bmi) && bmi > 0 ? (
        <>
          <div className="border p-4 text-center">
            <div className="text-4xl font-extrabold">{bmi.toFixed(1)}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mt-1">BMI</div>
            <span className={`inline-block mt-2 px-3 py-1  text-xs font-bold ${cat.color}`}>{cat.label}</span>
          </div>
          <div>
            <div className="relative h-2  bg-gradient-to-r from-sky-400 via-emerald-400 via-50% to-red-500">
              <div className="absolute -top-1 w-4 h-4 bg-white border-2 border-zinc-900  -translate-x-1/2" style={{ left: `${pos}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-zinc-500 mt-1"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
          </div>
          <div className="border p-3 text-sm">Healthy weight range: <b>{healthyMin.toFixed(unit === 'metric' ? 0 : 1)}–{healthyMax.toFixed(unit === 'metric' ? 0 : 1)} {unit === 'metric' ? 'kg' : 'lbs'}</b></div>
        </>
      ) : <p className="text-xs text-red-500">Enter valid height and weight.</p>}
    </div>
  )
}
