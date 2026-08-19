import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function StudWall() {
  const [len, setLen] = useState('24')
  const [h, setH] = useState('8')
  const [spacing, setSpacing] = useState('16')

  const L = parseFloat(len) || 0
  const H = parseFloat(h) || 0
  const S = parseFloat(spacing) || 16

  const studs = Math.ceil((L * 12) / S) + 1
  const plates = Math.ceil(L * 2 * 3 / 10)
  const blocking = Math.ceil((H * 12 / 24) * studs / 2)
  const screws = studs * 12

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Wall length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Wall height (ft)" type="number" value={h} onChange={(e) => setH(e.target.value)} />
        <Field label="Stud spacing (in)" type="number" value={spacing} onChange={(e) => setSpacing(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Studs (2×4, 8 ft)" value={studs} tone="good" />
        <Result label="Top + bottom plates (10 ft)" value={plates} />
        <Result label={'Blocking pieces (24" OC)'} value={blocking} />
        <Result label="Screws/nails" value={screws} />
      </ResultGrid>
    </div>
  )
}