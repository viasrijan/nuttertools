import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'
import { Select } from '../../components/ui/Select'

export default function AquariumVolume() {
  const [shape, setShape] = useState('rect')
  const [l, setL] = useState('120')
  const [w, setW] = useState('45')
  const [h, setH] = useState('50')
  const [substrate, setSubstrate] = useState('0')

  const L = (parseFloat(l) || 0) / 100
  const W = (parseFloat(w) || 0) / 100
  const H = (parseFloat(h) || 0) / 100
  const liters = shape === 'rect' ? L * W * H * 1000 : L * W * H * Math.PI / 4 * 1000
  const gallons = liters * 0.264172
  const sub = (parseFloat(substrate) || 0) * L * W / 1000
  const water = liters - sub

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Select label="Shape" value={shape} onChange={setShape} options={[{ v: 'rect', label: 'Rectangular' }, { v: 'bow', label: 'Bow-front' }]} />
        <Field label="Length (cm)" type="number" value={l} onChange={(e) => setL(e.target.value)} />
        <Field label="Width (cm)" type="number" value={w} onChange={(e) => setW(e.target.value)} />
        <Field label="Height (cm)" type="number" value={h} onChange={(e) => setH(e.target.value)} />
      </div>
      <div className="max-w-[220px]">
        <Field label="Substrate depth (cm)" type="number" value={substrate} onChange={(e) => setSubstrate(e.target.value)} hint="Displaces water volume" />
      </div>
      <ResultGrid>
        <Result label="Water volume" value={`${water.toFixed(1)} L`} tone="good" />
        <Result label="Gallons (US)" value={`${(water * 0.264172).toFixed(1)} gal`} />
        <Result label="Tank total (empty)" value={`${liters.toFixed(1)} L`} />
      </ResultGrid>
    </div>
  )
}