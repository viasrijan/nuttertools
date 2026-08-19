import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function GradeCalculator() {
  const [rows, setRows] = useState('Homework:90:20\nQuizzes:85:30\nMidterm:78:20\nFinal:92:30')
  const [target, setTarget] = useState('90')

  const parsed = rows.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [name, grade, weight] = l.split(':')
    return { name: (name || '').trim(), grade: parseFloat(grade) || 0, weight: parseFloat(weight) || 0 }
  })
  const totalW = parsed.reduce((a, r) => a + r.weight, 0)
  const earned = parsed.reduce((a, r) => a + r.grade * r.weight, 0)
  const current = totalW ? earned / totalW : 0
  const t = parseFloat(target) || 0
  const needed = totalW < 100 ? (t * 100 - earned) / (100 - totalW) : null

  const letter = (v: number) => v >= 97 ? 'A+' : v >= 93 ? 'A' : v >= 90 ? 'A−' : v >= 87 ? 'B+' : v >= 83 ? 'B' : v >= 80 ? 'B−' : v >= 77 ? 'C+' : v >= 73 ? 'C' : v >= 70 ? 'C−' : v >= 67 ? 'D+' : v >= 63 ? 'D' : v >= 60 ? 'D−' : 'F'

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-1.5">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Assignments — one per line: "name:grade:weight"</span>
        <textarea value={rows} onChange={(e) => setRows(e.target.value)} rows={6} className="w-full p-3 font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
      </div>
      <div className="max-w-[220px]">
        <Field label="Target grade" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Current grade" value={`${current.toFixed(2)}% (${letter(current)})`} tone="good" />
        <Result label="Weights entered" value={`${totalW}%`} />
        {needed !== null && totalW < 100 && (
          <Result label={`Score needed on remaining ${(100 - totalW).toFixed(0)}%`} value={`${needed.toFixed(2)}%`} tone={needed <= 100 ? 'good' : 'warn'} />
        )}
      </ResultGrid>
    </div>
  )
}