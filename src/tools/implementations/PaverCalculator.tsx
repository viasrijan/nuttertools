import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function PaverCalculator() {
  const [len, setLen] = useState('10')
  const [wid, setWid] = useState('8')
  const [pl, setPl] = useState('12')
  const [pw, setPw] = useState('12')
  const [waste, setWaste] = useState('5')

  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const area = L * W
  const paver = (parseFloat(pl) || 12) * (parseFloat(pw) || 12) / 144
  const count = Math.ceil((area / paver) * (1 + (parseFloat(waste) || 5) / 100))
  const base = area * 0.1667 / 27
  const sand = Math.ceil(area * 0.04)
  const edge = 2 * (L + W)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field label="Patio length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Patio width (ft)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label="Paver length (in)" type="number" value={pl} onChange={(e) => setPl(e.target.value)} />
        <Field label="Paver width (in)" type="number" value={pw} onChange={(e) => setPw(e.target.value)} />
        <Field label="Waste %" type="number" value={waste} onChange={(e) => setWaste(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Pavers needed" value={count.toLocaleString()} tone="good" />
        <Result label={'Base gravel (yd³, 2")'} value={base.toFixed(2)} />
        <Result label="Bedding sand (bags)" value={sand} />
        <Result label="Edging length (ft)" value={edge.toFixed(1)} />
      </ResultGrid>
    </div>
  )
}