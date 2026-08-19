import { useState } from 'react'

import { Button } from '../../components/ui/Button'

export default function ShadowGenerator() {
  const [type, setType] = useState<'box' | 'text'>('box')
  const [x, setX] = useState(2)
  const [y, setY] = useState(4)
  const [blur, setBlur] = useState(8)
  const [spread, setSpread] = useState(0)
  const [opacity, setOpacity] = useState(30)
  const [inset, setInset] = useState(false)
  const [color, setColor] = useState('#000000')
  const [textShadow, setTextShadow] = useState('2px 2px 4px rgba(0,0,0,0.4)')

  const boxShadow = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${hexA(color, opacity)}`
  const css = type === 'box' ? `box-shadow: ${boxShadow};` : `text-shadow: ${textShadow};`

  function hexA(hex: string, a: number) {
    const n = parseInt(hex.slice(1), 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${(a / 100).toFixed(2)})`
  }

  return (
    <div className="space-y-5 max-w-2xl omni-rise">
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={() => setType('box')} className={`px-4 h-9 text-sm  ${type === 'box' ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>Box shadow</Button>
        <Button variant="outline" onClick={() => setType('text')} className={`px-4 h-9 text-sm  ${type === 'text' ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>Text shadow</Button>
      </div>
      {type === 'box' ? (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm">X offset ({x}px)<input type="range" min={-50} max={50} value={x} onChange={e => setX(parseInt(e.target.value))} className="w-full" /></label>
            <label className="text-sm">Y offset ({y}px)<input type="range" min={-50} max={50} value={y} onChange={e => setY(parseInt(e.target.value))} className="w-full" /></label>
            <label className="text-sm">Blur ({blur}px)<input type="range" min={0} max={100} value={blur} onChange={e => setBlur(parseInt(e.target.value))} className="w-full" /></label>
            <label className="text-sm">Spread ({spread}px)<input type="range" min={-20} max={50} value={spread} onChange={e => setSpread(parseInt(e.target.value))} className="w-full" /></label>
            <label className="text-sm">Opacity ({opacity}%)<input type="range" min={0} max={100} value={opacity} onChange={e => setOpacity(parseInt(e.target.value))} className="w-full" /></label>
            <label className="text-sm">Color
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-9 border mt-1" /></label>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inset} onChange={e => setInset(e.target.checked)} />Inset (inner shadow)</label>
        </>
      ) : (
        <>
          <label className="text-sm font-semibold">Text shadow CSS
            <input value={textShadow} onChange={e => setTextShadow(e.target.value)} className="w-full border px-3 h-9 mt-1 font-mono text-xs" /></label>
          <p className="text-[11px] text-zinc-500">Format: offset-x offset-y blur color (e.g. <code className="font-mono">2px 2px 4px rgba(0,0,0,0.4)</code>)</p>
        </>
      )}
      <div className="border p-8 grid place-items-center bg-zinc-50 dark:bg-zinc-800 h-52">
        {type === 'box'
          ? <div className="w-40 h-40 bg-white dark:bg-zinc-900 border" style={{ boxShadow }} />
          : <p className="text-3xl font-extrabold" style={{ textShadow }}>NutterTools</p>}
      </div>
      <code className="block border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800">{css}</code>
      <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</Button>
    </div>
  )
}
