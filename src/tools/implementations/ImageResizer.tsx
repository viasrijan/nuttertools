import { useState } from 'react'
import DropZone from '../../components/DropZone'

const PRESETS = [
  { label: 'Icon 256px', w: 256, h: 256 },
  { label: 'Square 512px', w: 512, h: 512 },
  { label: 'Banner 1920x1080', w: 1920, h: 1080 },
  { label: 'Instagram 1080x1080', w: 1080, h: 1080 },
  { label: 'Story 1080x1920', w: 1080, h: 1920 },
]

export default function ImageResizer() {
  const [img, setImg] = useState<{ url: string, w: number, h: number } | null>(null)
  const [mode, setMode] = useState<'percent' | 'pixels' | 'preset'>('percent')
  const [percent, setPercent] = useState(50)
  const [w, setW] = useState(800)
  const [h, setH] = useState(600)
  const [quality, setQuality] = useState(0.9)
  const [out, setOut] = useState<string>('')

  const onFiles = async (fl: FileList) => {
    const file = fl[0]
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.src = url
    await new Promise(r => im.onload = r)
    setImg({ url, w: im.naturalWidth, h: im.naturalHeight })
    setW(im.naturalWidth); setH(im.naturalHeight)
    setOut('')
  }

  const resize = () => {
    if (!img) return
    let nw = img.w, nh = img.h
    if (mode === 'percent') { nw = Math.round(img.w * percent / 100); nh = Math.round(img.h * percent / 100) }
    if (mode === 'pixels') {
      const r = Math.min(w / img.w, h / img.h)
      nw = Math.round(img.w * r); nh = Math.round(img.h * r)
    }
    if (mode === 'preset') { nw = w; nh = h }
    const c = document.createElement('canvas')
    c.width = nw; c.height = nh
    const ctx = c.getContext('2d')!
    ctx.imageSmoothingQuality = 'high'
    const im = new Image()
    im.onload = () => { ctx.drawImage(im, 0, 0, nw, nh); setOut(c.toDataURL('image/jpeg', quality)) }
    im.src = img.url
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="image/*" multiple={false} label="Drop an image to resize" />
      {img && (
        <>
          <div className="text-sm text-zinc-600 dark:text-zinc-300">Original: {img.w} × {img.h}px</div>
          <div className="flex gap-2">
            {(['percent', 'pixels', 'preset'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-4 h-9 text-sm border ${mode === m ? 'bg-zinc-900 text-white' : ''}`}>{m}</button>
            ))}
          </div>
          {mode === 'percent' && (
            <label className="block text-sm font-medium">Scale {percent}%<input type="range" min={1} max={400} value={percent} onChange={e => setPercent(parseInt(e.target.value))} className="w-full" /></label>
          )}
          {mode === 'pixels' && (
            <div className="flex gap-2 items-center text-sm">
              <input type="number" value={w} onChange={e => setW(parseInt(e.target.value) || 0)} className="border px-3 h-9 w-32" /> ×
              <input type="number" value={h} onChange={e => setH(parseInt(e.target.value) || 0)} className="border px-3 h-9 w-32" />
              <span className="text-xs text-zinc-500">(fits inside, keeps ratio)</span>
            </div>
          )}
          {mode === 'preset' && (
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => { setW(p.w); setH(p.h) }}
                  className="px-3 h-9 border text-sm">{p.label}</button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <button onClick={resize} className="px-4 h-9 bg-zinc-900 text-white text-sm">Resize</button>
            {out && <a href={out} download="resized.jpg" className="text-sm underline">Download JPG</a>}
          </div>
          {out && <img src={out} className="max-h-[280px]" alt="Result" />}
        </>
      )}
    </div>
  )
}
