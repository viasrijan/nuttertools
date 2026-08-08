import { useRef, useState } from 'react'
import DropZone from '../../components/DropZone'

const INIT = { brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0, sepia: 0, invert: 0, hue: 0 }

type BatchItem = { name: string, url: string, checked: boolean }

export default function ImageFilters() {
  const [img, setImg] = useState<{ url: string } | null>(null)
  const [f, setF] = useState(INIT)
  const [batch, setBatch] = useState<BatchItem[]>([])
  const [busy, setBusy] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const onFiles = async (fl: FileList) => {
    const files = Array.from(fl).filter(f => f.type.startsWith('image/'))
    if (!files.length) return
    const first = files[0]
    const url = URL.createObjectURL(first)
    const im = new Image()
    im.src = url
    await new Promise(r => im.onload = r)
    imgRef.current = im
    setImg({ url })
    setF(INIT)
    if (files.length > 1) {
      setBatch(files.map(f => ({ name: f.name, url: URL.createObjectURL(f), checked: true })))
    }
  }

  const filterCss = () =>
    `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) invert(${f.invert}%) hue-rotate(${f.hue}deg)`

  const renderOne = (url: string): Promise<string> => new Promise((resolve) => {
    const im = new Image()
    im.onload = () => {
      const c = document.createElement('canvas')
      c.width = im.naturalWidth
      c.height = im.naturalHeight
      const ctx = c.getContext('2d')!
      ctx.filter = filterCss()
      ctx.drawImage(im, 0, 0)
      resolve(c.toDataURL('image/png'))
    }
    im.src = url
  })

  const download = async () => {
    const im = imgRef.current
    const canvas = canvasRef.current
    if (!im || !canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = im.naturalWidth
    canvas.height = im.naturalHeight
    ctx.filter = filterCss()
    ctx.drawImage(im, 0, 0)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'filtered.png'
    a.click()
  }

  const downloadAll = async () => {
    const selected = batch.filter(b => b.checked)
    if (!selected.length) return
    setBusy(true)
    try {
      for (const item of selected) {
        const data = await renderOne(item.url)
        const a = document.createElement('a')
        a.href = data
        a.download = item.name.replace(/\.[^.]+$/, '') + '-filtered.png'
        a.click()
      }
    } finally {
      setBusy(false)
    }
  }

  const sliders: [keyof typeof INIT, string, number, number][] = [
    ['brightness', 'Brightness', 0, 200],
    ['contrast', 'Contrast', 0, 200],
    ['saturate', 'Saturation', 0, 200],
    ['blur', 'Blur', 0, 10],
    ['grayscale', 'Grayscale', 0, 100],
    ['sepia', 'Sepia', 0, 100],
    ['invert', 'Invert', 0, 100],
    ['hue', 'Hue rotate', 0, 360],
  ]

  return (
    <div className="space-y-4">
      {!img ? (
        <DropZone onFiles={onFiles} accept="image/*" multiple={true} label="Drop one or more images to edit (multiple = batch)" />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button onClick={download} className="px-4 h-9 bg-zinc-900 text-white text-sm">Download</button>
            {batch.length > 0 && (
              <button onClick={downloadAll} disabled={busy} className="px-4 h-9 bg-zinc-900 text-white text-sm disabled:opacity-50">
                {busy ? 'Applying…' : `Download selected (${batch.filter(b => b.checked).length})`}
              </button>
            )}
            <button onClick={() => setF(INIT)} className="px-4 h-9 border text-sm">Reset</button>
            <button onClick={() => { setImg(null); setBatch([]) }} className="px-4 h-9 border text-sm">New images</button>
          </div>
          <img src={img.url} style={{ filter: filterCss() }} className="max-h-[380px] mx-auto" alt="Preview" />
          {batch.length > 0 && (
            <div className="border p-3 space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Batch ({batch.filter(b => b.checked).length} selected)</span>
                <div className="flex gap-2">
                  <button onClick={() => setBatch(batch.map(b => ({ ...b, checked: true })))} className="underline text-xs">Select all</button>
                  <button onClick={() => setBatch(batch.map(b => ({ ...b, checked: false })))} className="underline text-xs">Clear</button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {batch.map((b, i) => (
                  <label key={i} className="relative block cursor-pointer">
                    <img src={b.url} style={{ filter: filterCss() }} className="h-16 w-full object-cover" alt={b.name} />
                    <input type="checkbox" checked={b.checked} onChange={e => {
                      const next = [...batch]
                      next[i] = { ...b, checked: e.target.checked }
                      setBatch(next)
                    }} className="absolute top-1 left-1 accent-green-600" />
                    <p className="text-[10px] truncate mt-0.5">{b.name}</p>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            {sliders.map(([key, label, min, max]) => (
              <label key={key} className="block text-sm">
                <span className="flex justify-between font-medium mb-1">{label}<span>{String(f[key])}{key === 'blur' ? 'px' : '%'}</span></span>
                <input type="range" min={min} max={max} value={f[key]} onChange={e => setF({ ...f, [key]: parseFloat(e.target.value) })} className="w-full" />
              </label>
            ))}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>
  )
}
