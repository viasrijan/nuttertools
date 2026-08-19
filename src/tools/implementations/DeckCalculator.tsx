import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function DeckCalculator() {
  const [len, setLen] = useState('20')
  const [wid, setWid] = useState('12')
  const [boardW, setBoardW] = useState('5.5')
  const [joistSpacing, setJoistSpacing] = useState('16')

  const L = parseFloat(len) || 0
  const W = parseFloat(wid) || 0
  const area = L * W
  const boards = Math.ceil((W * 12) / ((parseFloat(boardW) || 5.5) + 0.25)) * (L / 10 + 1)
  const joists = Math.ceil((L * 12) / (parseFloat(joistSpacing) || 16)) + 1
  const joists2 = Math.ceil((W * 12) / (parseFloat(joistSpacing) || 16)) + 1
  const screws = boards * 6

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Deck length (ft)" type="number" value={len} onChange={(e) => setLen(e.target.value)} />
        <Field label="Deck width (ft)" type="number" value={wid} onChange={(e) => setWid(e.target.value)} />
        <Field label="Board width (in)" type="number" value={boardW} onChange={(e) => setBoardW(e.target.value)} />
        <Field label="Joist spacing (in)" type="number" value={joistSpacing} onChange={(e) => setJoistSpacing(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Deck area" value={`${area.toFixed(1)} ft²`} />
        <Result label="Deck boards (10 ft)" value={boards} tone="good" />
        <Result label="Joists" value={joists} />
        <Result label="Rim/beam boards" value={joists2} />
        <Result label="Deck screws" value={screws} />
      </ResultGrid>
    </div>
  )
}