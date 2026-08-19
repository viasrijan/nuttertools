import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function PaintCalculator() {
  const [w, setW] = useState('12')
  const [h, setH] = useState('2.7')
  const [doors, setDoors] = useState('2')
  const [windows, setWindows] = useState('3')
  const [coats, setCoats] = useState('2')

  const W = parseFloat(w) || 0
  const H = parseFloat(h) || 0
  const wall = 4 * W * H - (parseFloat(doors) || 0) * 1.9 - (parseFloat(windows) || 0) * 1.5
  const area = wall * (parseInt(coats) || 1)
  const liters = area / 10
  const gallons = liters / 3.785

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field label="Room width (m)" type="number" value={w} onChange={(e) => setW(e.target.value)} />
        <Field label="Height (m)" type="number" value={h} onChange={(e) => setH(e.target.value)} />
        <Field label="Doors" type="number" value={doors} onChange={(e) => setDoors(e.target.value)} />
        <Field label="Windows" type="number" value={windows} onChange={(e) => setWindows(e.target.value)} />
        <Field label="Coats" type="number" value={coats} onChange={(e) => setCoats(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Wall area (minus doors/windows)" value={`${Math.max(0, wall).toFixed(1)} m²`} />
        <Result label="Paint needed (10 m²/L)" value={`${Math.max(0, liters).toFixed(1)} liters`} tone="good" />
        <Result label="Equivalent gallons" value={`${Math.max(0, gallons).toFixed(2)} gal`} />
        <Result label="1-gallon cans" value={Math.ceil(Math.max(0, gallons))} />
        <Result label="4L cans" value={Math.ceil(Math.max(0, liters) / 4)} />
      </ResultGrid>
    </div>
  )
}