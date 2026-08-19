import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function DrywallCalculator() {
  const [len, setLen] = useState('6')
  const [wid, setWid] = useState('4')
  const [h, setH] = useState('2.7')
  const [sheets, setSheets] = useState('1.2')
  const [sheetH, setSheetH] = useState('2.4')

  const walls = 2 * (parseFloat(len) || 0) * (parseFloat(h) || 0) + 2 * (parseFloat(wid) || 0) * (parseFloat(h) || 0)
  const ceiling = (parseFloat(len) || 0) * (parseFloat(wid) || 0)
  const total = walls + ceiling
  const sheetArea = (parseFloat(sheets) || 1.2) * (parseFloat(sheetH) || 2.4)
  const count = Math.ceil(total / sheetArea)
  const screws = Math.ceil(count * 36)
  const jointTape = Math.ceil(total * 0.6)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field label="Length (m)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Width (m)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label="Height (m)" type="number" value={h} onChange={(e) => setH(e.target.value)} />
        <Field label="Sheet W (m)" type="number" value={sheets} onChange={(e) => setSheets(e.target.value)} />
        <Field label="Sheet H (m)" type="number" value={sheetH} onChange={(e) => setSheetH(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Walls + ceiling area" value={`${total.toFixed(1)} m²`} />
        <Result label="Sheets needed" value={count} tone="good" />
        <Result label="Screws (≈36/sheet)" value={screws} />
        <Result label="Joint tape (m)" value={jointTape} />
        <Result label="Joint compound (kg)" value={Math.ceil(count * 2.5)} />
      </ResultGrid>
    </div>
  )
}