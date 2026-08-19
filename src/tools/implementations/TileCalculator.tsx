import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function TileCalculator() {
  const [roomL, setRoomL] = useState('4')
  const [roomW, setRoomW] = useState('3')
  const [tileL, setTileL] = useState('30')
  const [tileW, setTileW] = useState('30')
  const [waste, setWaste] = useState('10')

  const area = (parseFloat(roomL) || 0) * (parseFloat(roomW) || 0)
  const tileArea = ((parseFloat(tileL) || 1) * (parseFloat(tileW) || 1)) / 10000
  const tiles = Math.ceil(area / tileArea)
  const withWaste = Math.ceil(tiles * (1 + (parseFloat(waste) || 0) / 100))
  const boxes = Math.ceil(withWaste / 10)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Field label="Room length (m)" type="number" value={roomL} onChange={(e) => setRoomL(e.target.value)} />
        <Field label="Room width (m)" type="number" value={roomW} onChange={(e) => setRoomW(e.target.value)} />
        <Field label="Tile size (cm)" type="number" value={tileL} onChange={(e) => { setTileL(e.target.value); setTileW(e.target.value) }} />
        <Field label="Waste %" type="number" value={waste} onChange={(e) => setWaste(e.target.value)} />
      </div>
      <ResultGrid>
        <Result label="Area" value={`${area.toFixed(2)} m²`} />
        <Result label="Tiles (no waste)" value={tiles} />
        <Result label="Tiles with waste" value={withWaste} tone="good" />
        <Result label="Boxes (10 per box)" value={boxes} />
      </ResultGrid>
    </div>
  )
}