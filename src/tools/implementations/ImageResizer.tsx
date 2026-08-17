import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'

const PRESETS = [
  { label: 'Icon 256px', w: 256, h: 256 },
  { label: 'Square 512px', w: 512, h: 512 },
  { label: 'Banner 1920x1080', w: 1920, h: 1080 },
  { label: 'Instagram 1080x1080', w: 1080, h: 1080 },
  { label: 'Story 1080x1920', w: 1080, h: 1920 },
]

type FileRes = { name: string, url: string, w: number, h: number }

export default function ImageResizer() {
  const [img, setImg] = useState<{ url: string, w: number, h: number } | null>(null)
  const [mode, setMode] = useState<'percent' | 'pixels' | 'preset'>('percent')
  const [percent, setPercent] = useState(50)
  const [w, setW] = useState(800)
  const [h, setH] = useState(600)
  const [quality, setQuality] = useState(0.9)
  const [out, setOut] = useState<string>('')
  const [batch, setBatch] = useState<FileRes[] | null>(null)
  const [busy, setBusy] = useState(false)

  const loadOne = async (file: File) => {
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.src = url
    await new Promise((r, j) => { im.onload = r; im.onerror = j })
    return { url, w: im.naturalWidth, h: im.naturalHeight }
  }

  const onFiles = async (fl: FileList) => {
    const files = Array.from(fl).filter(f => f.type.startsWith('image/'))
    if (!files.length) return
    const first = await loadOne(files[0])
    setImg({ ...first, url: URL.createObjectURL(files[0]) })
    setW(first.w); setH(first.h)
    setOut('')
    if (files.length > 1) {
      setBatch([])
      setBusy(true)
      try {
        const results: FileRes[] = []
        for (const f of files) {
          const dims = await loadOne(f)
          results.push({ name: f.name, ...dims })
        }
        setBatch(results)
      } finally {
        setBusy(false)
      }
    }
  }

  const targetDims = (cur: { w: number, h: number }) => {
    if (mode === 'percent') {
      return { w: Math.round(cur.w * percent / 100), h: Math.round(cur.h * percent / 100) }
    }
    if (mode === 'pixels') {
      const r = Math.min(w / cur.w, h / cur.h)
      return { w: Math.round(cur.w * r), h: Math.round(cur.h * r) }
    }
    return { w, h }
  }

  const renderOne = (url: string, nw: number, nh: number): Promise<string> => new Promise((resolve) => {
    const c = document.createElement('canvas')
    c.width = nw; c.height = nh
    const ctx = c.getContext('2d')!
    ctx.imageSmoothingQuality = 'high'
    const im = new Image()
    im.onload = () => { ctx.drawImage(im, 0, 0, nw, nh); resolve(c.toDataURL('image/jpeg', quality)) }
    im.src = url
  })

  const resize = async () => {
    if (!img) return
    if (batch && batch.length > 0) {
      setBusy(true)
      try {
        for (const b of batch) {
          const d = targetDims(b)
          b.url = await renderOne(b.url, d.w, d.h)
        }
      } finally {
        setBusy(false)
      }
    } else {
      const d = targetDims(img)
      setOut(await renderOne(img.url, d.w, d.h))
    }
  }

  return (
    <div className="space-y-5">
      <DropZone onFiles={onFiles} accept="image/*" multiple={true} label="Drop one or more images to resize (multiple = batch)" />
      {busy && <Progress label="Processing…" />}
      {img && !batch && (
        <>
          <div className="text-sm text-zinc-600 dark:text-zinc-300">Original: {img.w} × {img.h}px</div>
          <div className="flex gap-2.5">
            {(['percent', 'pixels', 'preset'] as const).map(m => (
              <Button variant="outline" key={m} onClick={() => setMode(m)} className={`px-4 h-9 text-sm border ${mode === m ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{m}</Button>
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
            <div className="flex flex-wrap gap-2.5">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => { setW(p.w); setH(p.h) }}
                  className="px-3 h-9 border text-sm">{p.label}</button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={resize}>Resize</Button>
            {out && <a href={out} download="resized.jpg" className="text-sm underline">Download JPG</a>}
          </div>
          {out && <img src={out} className="max-h-[280px]" alt="Result" />}
        </>
      )}
      {batch && (
        <>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" disabled={busy} onClick={resize}>Resize all ({batch.length})</Button>
            {batch.every(b => b.url.startsWith('data:')) && (
              <button onClick={() => {
                batch.forEach((b, i) => {
                  const a = document.createElement('a')
                  a.href = b.url
                  a.download = b.name.replace(/\.[^.]+$/, '') + '-resized.jpg'
                  a.click()
                })
              }} className="px-4 h-9 border text-sm">Download all</button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {batch.map((b, i) => (
              <div key={i} className="border p-2">
                <img src={b.url} className="max-h-[140px] mx-auto" alt={b.name} />
                <p className="text-[11px] truncate mt-1">{b.name}</p>
                {b.url.startsWith('data:') && <a href={b.url} download={b.name.replace(/\.[^.]+$/, '') + '-resized.jpg'} className="text-xs underline">Download</a>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
