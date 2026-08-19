import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function FenceCalculator() {
  const [run, setRun] = useState('100')
  const [height, setHeight] = useState('6')
  const [postSpacing, setPostSpacing] = useState('8')
  const [railRows, setRailRows] = useState('3')
  const [gates, setGates] = useState('1')

  const R = parseFloat(run) || 0
  const H = parseFloat(height) || 0
  const posts = Math.ceil(R / (parseFloat(postSpacing) || 8)) + 1 + (parseInt(gates) || 0) * 2
  const rails = posts * (parseInt(railRows) || 3)
  const pickets = Math.ceil((R * 12) / 5.5)
  const picketSq = Math.ceil(pickets * (H * 12) / 32)
  const concrete = Math.ceil(posts * 1.5)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field label="Run length (ft)" type="number" value={run} onChange={(e) => setRun(e.target.value)} />
        <Field label="Height (ft)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        <Field label="Post spacing (ft)" type="number" value={postSpacing} onChange={(e) => setPostSpacing(e.target.value)} />
        <Field label="Rail rows" type="number" value={railRows} onChange={(e) => setRailRows(e.target.value)} />
        <Field label="Gates" type="number" value={gates} onChange={(e) => setGates(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Posts (incl. gate posts)" value={posts} tone="good" />
        <Result label="Rails" value={rails} />
        <Result label={'Pickets (5.5" wide, 1" gap)'} value={pickets} />
        <Result label="Concrete bags (60 lb)" value={concrete} />
        <Result label="Post hole gravel bags" value={posts} />
      </ResultGrid>
    </div>
  )
}