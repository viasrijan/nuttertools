import { useMemo, useState } from 'react'

const GRADES: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0,
}

type Row = { id: number, course: string, credits: number, grade: string }

export default function GpaCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, course: 'Mathematics', credits: 4, grade: 'A' },
    { id: 2, course: 'English', credits: 3, grade: 'B+' },
    { id: 3, course: 'Computer Science', credits: 4, grade: 'A-' },
    { id: 4, course: 'History', credits: 3, grade: 'B' },
  ])
  const [scale, setScale] = useState(4)

  const gpa = useMemo(() => {
    let points = 0, credits = 0
    for (const r of rows) {
      const p = GRADES[r.grade]
      if (p !== undefined) { points += p * r.credits; credits += r.credits }
    }
    const raw = credits ? points / credits : 0
    const adjusted = scale === 5 && raw === 4 ? raw : raw
    return { raw, adjusted, credits, points }
  }, [rows, scale])

  const update = (id: number, patch: Partial<Row>) => setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))

  const letter = (g: number) => g >= 4 ? 'A' : g >= 3.7 ? 'A-' : g >= 3.3 ? 'B+' : g >= 3 ? 'B' : g >= 2.7 ? 'B-' : g >= 2.3 ? 'C+' : g >= 2 ? 'C' : g >= 1.7 ? 'C-' : g >= 1 ? 'D' : 'F'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Scale</label>
        {[4, 5].map(s => (
          <button key={s} onClick={() => setScale(s)} className={`px-4 h-9 border ${scale === s ? 'bg-zinc-900 text-white' : ''}`}>{s}-point</button>
        ))}
      </div>
      <div className="border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-900 text-left text-[11px] uppercase tracking-wider">
            <tr><th className="p-2">Course</th><th className="p-2 w-24">Credits</th><th className="p-2 w-28">Grade</th><th className="p-2 w-10"></th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2"><input value={r.course} onChange={e => update(r.id, { course: e.target.value })} className="w-full border px-2 py-1.5 text-sm" /></td>
                <td className="p-2"><input type="number" min="0" max="20" value={r.credits} onChange={e => update(r.id, { credits: Math.max(0, +e.target.value) })} className="w-full border px-2 py-1.5 text-sm" /></td>
                <td className="p-2">
                  <select value={r.grade} onChange={e => update(r.id, { grade: e.target.value })} className="w-full border px-2 py-1.5 text-sm">
                    {Object.keys(GRADES).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </td>
                <td className="p-2"><button onClick={() => setRows(prev => prev.filter(x => x.id !== r.id))} className="text-red-500 text-xs">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setRows(prev => [...prev, { id: Date.now(), course: '', credits: 3, grade: 'A' }])} className="px-4 h-9 border text-sm">+ Add course</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
        <div className="border p-3"><div className="text-xl font-bold">{gpa.raw.toFixed(2)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">GPA</div></div>
        <div className="border p-3"><div className="text-xl font-bold">{letter(gpa.raw)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Letter</div></div>
        <div className="border p-3"><div className="text-xl font-bold">{gpa.credits}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Credits</div></div>
        <div className="border p-3"><div className="text-xl font-bold">{gpa.points.toFixed(1)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Grade points</div></div>
      </div>
    </div>
  )
}
