import { useState } from 'react'

const ACTIVITIES = [
  { label: 'Sedentary (little or no exercise)', mult: 1.2 },
  { label: 'Lightly active (1–3 days/week)', mult: 1.375 },
  { label: 'Moderately active (3–5 days/week)', mult: 1.55 },
  { label: 'Very active (6–7 days/week)', mult: 1.725 },
  { label: 'Extra active (hard exercise daily)', mult: 1.9 },
]

export default function CalorieCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('30')
  const [height, setHeight] = useState('175')
  const [weight, setWeight] = useState('75')
  const [activity, setActivity] = useState(1)

  const a = Number(age)
  const h = Number(height)
  const w = Number(weight)
  const valid = [a, h, w].every((x) => Number.isFinite(x) && x > 0)

  let bmr = 0
  if (valid) {
    bmr = sex === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161
  }
  const tdee = valid ? bmr * ACTIVITIES[activity].mult : 0

  const rows = [
    ['BMR (base metabolic rate)', bmr],
    ['Maintain weight', tdee],
    ['Mild weight loss (−0.25 kg/week)', tdee * 0.875],
    ['Weight loss (−0.5 kg/week)', tdee * 0.75],
    ['Mild weight gain (+0.25 kg/week)', tdee * 1.125],
  ]

  return (
    <div className="space-y-4 max-w-xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Sex</label>
          <select value={sex} onChange={(e) => setSex(e.target.value as 'male' | 'female')}
            className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
            className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
            className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Activity level</label>
        <select value={activity} onChange={(e) => setActivity(+e.target.value)}
          className="w-full border px-3 py-2.5 bg-transparent text-zinc-900 dark:text-white outline-none">
          {ACTIVITIES.map((a, i) => <option key={i} value={i}>{a.label}</option>)}
        </select>
      </div>
      {valid && tdee > 0 && (
        <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-2.5">
              <span className="text-zinc-500 dark:text-zinc-400">{k}</span>
              <span className="font-bold">{Math.round(v)} kcal</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">Estimates use the Mifflin-St Jeor equation and are for healthy adults. This is not medical advice — talk to a professional before starting any diet.</p>
    </div>
  )
}
