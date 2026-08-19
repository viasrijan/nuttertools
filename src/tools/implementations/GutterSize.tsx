import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function GutterSize() {
  const [roofArea, setRoofArea] = useState('1200')
  const [intensity, setIntensity] = useState('2.5')

  const a = parseFloat(roofArea) || 0
  const I = parseFloat(intensity) || 2.5
  const flow = (a * I) / 96
  const gutter = flow <= 3.1 ? '5" K-style' : flow <= 6.2 ? '6" K-style' : '6"+ or box gutter'
  const downspouts = Math.ceil(flow / 1.5)
  const runoff = a * I / 12

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Drainage area (ft²)" type="number" value={roofArea} onChange={(e) => setRoofArea(e.target.value)} hint="Roof footprint × pitch factor" />
        <Field label="Rainfall intensity (in/hr)" type="number" value={intensity} onChange={(e) => setIntensity(e.target.value)} hint="Typical storm: 2–3" />
      </div>
      <ResultGrid>
        <Result label="Runoff flow" value={`${flow.toFixed(1)} gal/min`} />
        <Result label="Recommended gutter" value={gutter} tone="good" />
        <Result label="Downspouts needed" value={downspouts} />
        <Result label="Stormwater volume" value={`${runoff.toFixed(1)} ft³`} />
      </ResultGrid>
    </div>
  )
}