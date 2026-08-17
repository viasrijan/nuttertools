import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'

import { saveBlob } from '../../lib/download'

export default function FaviconGenerator() {
  const [text, setText] = useState('N')
  const [bg, setBg] = useState('#4f46e5')
  const [fg, setFg] = useState('#ffffff')
  const [radius, setRadius] = useState(0)
  const [previews, setPreviews] = useState<string[]>([])

  const draw = (size: number): string => {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const r = radius / 100 * size
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, r)
    ctx.fillStyle = bg
    ctx.fill()
    ctx.fillStyle = fg
    ctx.font = `700 ${size * 0.62}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text.slice(0, 1), size / 2, size / 2 + size * 0.02)
    return c.toDataURL('image/png')
  }

  useEffect(() => {
    const t = setTimeout(() => setPreviews([16, 32, 48, 180].map(draw)), 50)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, bg, fg, radius])

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm items-center">
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Letter</label><input value={text} onChange={e => setText(e.target.value.slice(0, 3))} className="w-full mt-1  border border-zinc-200 dark:border-zinc-700 px-3 py-2 transition-all duration-200" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Background</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-9 border mt-1" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Foreground</label><input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-full h-9 border mt-1" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Radius %</label><input type="range" min="0" max="50" value={radius} onChange={e => setRadius(+e.target.value)} className="w-full mt-3" /></div>
      </div>
      <div className="flex items-end gap-4 border p-4">
        {previews.map((p, i) => (
          <div key={i} className="text-center">
            <img src={p} width={[16, 32, 48, 180][i]} height={[16, 32, 48, 180][i]} alt={`${[16, 32, 48, 180][i]}px`} style={{ imageRendering: [16, 32].includes([16, 32, 48, 180][i]) ? 'pixelated' : 'auto' }} />
            <div className="text-[10px] text-zinc-500 mt-1">{[16, 32, 48, 180][i]}px</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2.5">
        <Button variant="secondary" onClick={() => saveBlob(dataUrlToBlob(draw(64)), 'favicon-64.png')}>Download 64px PNG</Button>
        <Button variant="outline" onClick={() => saveBlob(dataUrlToBlob(draw(180)), 'favicon-180.png')}>Download 180px</Button>
      </div>
      <p className="text-[11px] text-zinc-500">Tip: also run this letter into the <b>Color Picker</b> or use the <b>Icon Resizer</b> for other sizes. For a full favicon pack, download 16, 32, 48 and 180 then upload to your host.</p>
    </div>
  )
}

function dataUrlToBlob(d: string): Blob {
  const parts = d.split(',')
  const bytes = atob(parts[1])
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], { type: 'image/png' })
}
