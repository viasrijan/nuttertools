import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function SodCalculator() {
  const [len, setLen] = useState('40')
  const [wid, setWid] = useState('30')

  const area = (parseFloat(len) || 0) * (parseFloat(wid) || 0)
  const rolls = Math.ceil(area * 1.05 / 10)
  const pallets = Math.ceil(rolls / 50)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Lawn length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Lawn width (ft)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Lawn area" value={`${area.toFixed(0)} ft²`} />
        <Result label="Sod rolls (2×5 ft, +5% waste)" value={rolls} tone="good" />
        <Result label="Pallets (50 rolls)" value={pallets} />
        <Result label="Square yards" value={`${Math.ceil(area / 9)} yd²`} />
      </ResultGrid>
    </div>
  )
}