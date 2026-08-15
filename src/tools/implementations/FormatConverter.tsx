import { useMemo, useRef, useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { GIFEncoder, quantize, applyPalette } from 'gifenc'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

type Item = { file: File, url: string, w: number, h: number, out?: string, outSize?: number, outName?: string, ow?: number, oh?: number }
type CropBox = { nx: number, ny: number, nw: number, nh: number }

const FORMATS = [
  { id: 'image/png', label: 'PNG', ext: 'png' },
  { id: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { id: 'image/webp', label: 'WebP', ext: 'webp' },
  { id: 'image/gif', label: 'GIF', ext: 'gif' },
  { id: 'image/avif', label: 'AVIF', ext: 'avif', requiresAvif: true },
  { id: 'image/bmp', label: 'BMP', ext: 'bmp' },
]

const TEXT_POSITIONS = [
  { id: 'tl', label: 'TL' }, { id: 'tc', label: 'TC' }, { id: 'tr', label: 'TR' },
  { id: 'cl', label: 'CL' }, { id: 'cc', label: 'CC' }, { id: 'cr', label: 'CR' },
  { id: 'bl', label: 'BL' }, { id: 'bc', label: 'BC' }, { id: 'br', label: 'BR' },
]

const load = (url: string) => new Promise<HTMLImageElement>((res, rej) => {
  const im = new Image()
  im.onload = () => res(im)
  im.onerror = rej
  im.src = url
})

const encodeBMP = (canvas: HTMLCanvasElement): Blob => {
  const ctx = canvas.getContext('2d')!
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const rowSize = width * 4
  const dataSize = rowSize * height
  const fileSize = 54 + dataSize
  const buf = new ArrayBuffer(fileSize)
  const dv = new DataView(buf)
  const u8 = new Uint8Array(buf)
  dv.setUint8(0, 0x42); dv.setUint8(1, 0x4d)
  dv.setUint32(2, fileSize, true)
  dv.setUint32(6, 0, true)
  dv.setUint32(10, 54, true)
  dv.setUint32(14, 40, true)
  dv.setInt32(18, width, true)
  dv.setInt32(22, height, true)
  dv.setUint16(26, 1, true)
  dv.setUint16(28, 32, true)
  dv.setUint32(30, 0, true)
  dv.setUint32(34, dataSize, true)
  dv.setInt32(38, 2835, true)
  dv.setInt32(42, 2835, true)
  dv.setUint32(46, 0, true)
  dv.setUint32(50, 0, true)
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * rowSize
    const dst = 54 + y * rowSize
    for (let x = 0; x < width; x++) {
      const s = src + x * 4
      const d = dst + x * 4
      u8[d] = data[s + 2]
      u8[d + 1] = data[s + 1]
      u8[d + 2] = data[s]
      u8[d + 3] = data[s + 3]
    }
  }
  return new Blob([buf], { type: 'image/bmp' })
}

export default function FormatConverter() {
  const [items, setItems] = useState<Item[]>([])
  const [busy, setBusy] = useState(false)

  const [format, setFormat] = useState('image/webp')
  const [quality, setQuality] = useState(0.9)

  const [resizeMode, setResizeMode] = useState<'none' | 'percent' | 'pixels'>('none')
  const [percent, setPercent] = useState(50)
  const [pxW, setPxW] = useState(800)
  const [pxH, setPxH] = useState(600)
  const [keepAspect, setKeepAspect] = useState(true)

  const [cropEnabled, setCropEnabled] = useState(false)
  const [crop, setCrop] = useState<CropBox>({ nx: 0, ny: 0, nw: 1, nh: 1 })
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ sx: number, sy: number, mode: 'new' | 'move' | 'resize', orig: CropBox } | null>(null)
  const aspectRef = useRef(0)

  const [rotate, setRotate] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturate, setSaturate] = useState(100)
  const [grayscale, setGrayscale] = useState(false)
  const [sepia, setSepia] = useState(false)
  const [blur, setBlur] = useState(0)

  const [cornerRadius, setCornerRadius] = useState(0)

  const [text, setText] = useState('')
  const [textSize, setTextSize] = useState(8)
  const [textColor, setTextColor] = useState('#ffffff')
  const [textOpacity, setTextOpacity] = useState(90)
  const [textBold, setTextBold] = useState(false)
  const [textPos, setTextPos] = useState('cc')

  const avifOk = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 4; c.height = 4
    const ctx = c.getContext('2d')
    if (!ctx) return false
    ctx.fillRect(0, 0, 4, 4)
    try { return c.toDataURL('image/avif').startsWith('data:image/avif') } catch { return false }
  }, [])

  const formats = FORMATS.filter((f) => !f.requiresAvif || avifOk)
  const active = formats.find((f) => f.id === format) ?? formats[0]
  const qualityMatters = ['image/jpeg', 'image/webp', 'image/avif'].includes(active.id)
  const opaque = active.id === 'image/jpeg' || active.id === 'image/bmp'

  const onFiles = async (fl: FileList) => {
    const files = Array.from(fl).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    const loaded = await Promise.all(files.map(async (f) => {
      const url = URL.createObjectURL(f)
      const im = await load(url)
      return { file: f, url, w: im.naturalWidth, h: im.naturalHeight }
    }))
    setItems(loaded)
    setCrop({ nx: 0, ny: 0, nw: 1, nh: 1 })
  }

  const toStage = (e: React.PointerEvent) => {
    const r = stageRef.current!.getBoundingClientRect()
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
  }

  const down = (e: React.PointerEvent) => {
    if (!items[0]) return
    const p = toStage(e)
    const b = crop
    const near = (a: number, c: number) => Math.abs(a - c) < 0.02
    const onEdge = near(p.x, b.nx) || near(p.x, b.nx + b.nw) || near(p.y, b.ny) || near(p.y, b.ny + b.nh)
    const inside = p.x >= b.nx && p.x <= b.nx + b.nw && p.y >= b.ny && p.y <= b.ny + b.nh
    const coversFull = b.nw > 0.95 && b.nh > 0.95
    dragRef.current = { sx: p.x, sy: p.y, mode: onEdge ? 'resize' : inside && !coversFull ? 'move' : 'new', orig: { ...b } }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const move = (e: React.PointerEvent) => {
    if (!dragRef.current || !items[0]) return
    const p = toStage(e)
    const d = dragRef.current
    let { nx, ny, nw, nh } = crop
    if (d.mode === 'new') {
      nx = Math.min(p.x, d.sx); ny = Math.min(p.y, d.sy)
      nw = Math.abs(p.x - d.sx); nh = Math.abs(p.y - d.sy)
    } else if (d.mode === 'move') {
      nx = Math.max(0, Math.min(1 - nw, d.orig.nx + (p.x - d.sx)))
      ny = Math.max(0, Math.min(1 - nh, d.orig.ny + (p.y - d.sy)))
    } else {
      nx = Math.max(0, Math.min(d.orig.nx + (p.x - d.sx), d.orig.nx + d.orig.nw - 0.01))
      ny = Math.max(0, Math.min(d.orig.ny + (p.y - d.sy), d.orig.ny + d.orig.nh - 0.01))
      nw = d.orig.nw + d.orig.nx - nx
      nh = d.orig.nh + d.orig.ny - ny
    }
    const a = aspectRef.current
    if (a > 0 && nw > 0) {
      nh = nw / a
      if (nh > 1 - ny) { nh = 1 - ny; nw = nh * a }
    }
    setCrop({ nx, ny, nw, nh })
  }

  const up = () => { dragRef.current = null }

  const filterString = () => {
    const parts: string[] = []
    if (brightness !== 100) parts.push(`brightness(${brightness}%)`)
    if (contrast !== 100) parts.push(`contrast(${contrast}%)`)
    if (saturate !== 100) parts.push(`saturate(${saturate}%)`)
    if (grayscale) parts.push('grayscale(1)')
    if (sepia) parts.push('sepia(1)')
    if (blur > 0) parts.push(`blur(${blur}px)`)
    return parts.join(' ') || 'none'
  }

  const drawText = (ctx: CanvasRenderingContext2D, ow: number, oh: number) => {
    if (!text.trim()) return
    const size = Math.max(8, Math.round(ow * (textSize / 100)))
    ctx.font = `${textBold ? 700 : 400} ${size}px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = textColor
    ctx.globalAlpha = textOpacity / 100
    const pad = Math.max(8, Math.round(ow * 0.02))
    const row = textPos[0]
    const col = textPos[1]
    ctx.textBaseline = row === 't' ? 'top' : row === 'b' ? 'bottom' : 'middle'
    ctx.textAlign = col === 'l' ? 'left' : col === 'r' ? 'right' : 'center'
    const x = col === 'l' ? pad : col === 'r' ? ow - pad : ow / 2
    const y = row === 't' ? pad : row === 'b' ? oh - pad : oh / 2
    ctx.fillText(text, x, y)
    ctx.globalAlpha = 1
  }

  const buildCanvas = async (url: string, srcW: number, srcH: number) => {
    const im = await load(url)
    let sx = 0, sy = 0, sW = srcW, sH = srcH
    if (cropEnabled && crop.nw > 0 && crop.nh > 0) {
      sx = crop.nx * srcW; sy = crop.ny * srcH
      sW = crop.nw * srcW; sH = crop.nh * srcH
    }
    const rot = ((rotate % 360) + 360) % 360
    const p1 = document.createElement('canvas')
    if (rot === 90 || rot === 270) { p1.width = Math.round(sH); p1.height = Math.round(sW) } else { p1.width = Math.round(sW); p1.height = Math.round(sH) }
    const c1 = p1.getContext('2d')!
    c1.imageSmoothingQuality = 'high'
    c1.translate(p1.width / 2, p1.height / 2)
    c1.rotate((rot * Math.PI) / 180)
    c1.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    c1.drawImage(im, sx, sy, sW, sH, -sW / 2, -sH / 2, sW, sH)

    let ow = p1.width, oh = p1.height
    if (resizeMode === 'percent') {
      const f = percent / 100
      ow = Math.max(1, Math.round(p1.width * f)); oh = Math.max(1, Math.round(p1.height * f))
    } else if (resizeMode === 'pixels') {
      const tw = Math.max(1, Math.round(pxW)); const th = Math.max(1, Math.round(pxH))
      if (keepAspect) {
        const r = Math.min(tw / p1.width, th / p1.height)
        ow = Math.max(1, Math.round(p1.width * r)); oh = Math.max(1, Math.round(p1.height * r))
      } else { ow = tw; oh = th }
    }

    const final = document.createElement('canvas')
    final.width = ow; final.height = oh
    const ctx = final.getContext('2d')!
    ctx.imageSmoothingQuality = 'high'
    if (opaque) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, ow, oh) }
    if (cornerRadius > 0) {
      const r = (cornerRadius / 100) * Math.min(ow, oh)
      ctx.beginPath()
      ctx.moveTo(r, 0)
      ctx.arcTo(ow, 0, ow, oh, r)
      ctx.arcTo(ow, oh, 0, oh, r)
      ctx.arcTo(0, oh, 0, 0, r)
      ctx.arcTo(0, 0, ow, 0, r)
      ctx.closePath()
      ctx.clip()
    }
    const f = filterString()
    if (f !== 'none') ctx.filter = f
    ctx.drawImage(p1, 0, 0, p1.width, p1.height, 0, 0, ow, oh)
    ctx.filter = 'none'
    if (text.trim()) drawText(ctx, ow, oh)
    return final
  }

  const encode = async (canvas: HTMLCanvasElement): Promise<Blob> => {
    if (active.id === 'image/gif') {
      const ctx = canvas.getContext('2d')!
      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const palette = quantize(data, 256, { format: 'rgba4444', oneBitAlpha: true })
      const index = applyPalette(data, palette, 'rgba4444')
      const gif = GIFEncoder()
      const ti = palette.findIndex((c) => c[3] === 0)
      gif.writeFrame(index, width, height, { palette, transparent: ti >= 0, transparentIndex: Math.max(0, ti) })
      gif.finish()
      return new Blob([gif.bytes()], { type: 'image/gif' })
    }
    if (active.id === 'image/bmp') return encodeBMP(canvas)
    return await new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), active.id, qualityMatters ? quality : undefined))
  }

  const convert = async () => {
    setBusy(true)
    try {
      const results = await Promise.all(items.map(async (it) => {
        const canvas = await buildCanvas(it.url, it.w, it.h)
        const blob = await encode(canvas)
        const outName = it.file.name.replace(/\.[^.]+$/, '') + '-converted.' + active.ext
        return { ...it, out: URL.createObjectURL(blob), outSize: blob.size, outName, ow: canvas.width, oh: canvas.height }
      }))
      setItems(results)
    } finally {
      setBusy(false)
    }
  }

  const downloadZip = async () => {
    const zip = new JSZip()
    for (const it of items) {
      if (!it.out) continue
      zip.file(it.outName!, await (await fetch(it.out)).blob())
    }
    saveAs(await zip.generateAsync({ type: 'blob' }), 'converted-images.zip')
  }

  const btn = 'px-4 h-10 text-xs font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors'
  const btnActive = 'px-4 h-10 text-xs font-bold uppercase tracking-wider border border-indigo-600 bg-indigo-600 text-white rounded-none shadow-sm'
  const input = 'border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 h-10 text-sm text-zinc-900 dark:text-white rounded-none'
  const label = 'text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400'

  return (
    <div className="space-y-6">
      <DropZone onFiles={onFiles} accept="image/*" multiple={true} label="Drop images to convert & edit (multiple = batch)" />

      {busy && <Progress label="Converting images…" />}

      {items.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-none border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className={label}>Format & quality</h3>
              <div className="flex flex-wrap gap-2">
                {formats.map((f) => (
                  <button key={f.id} onClick={() => setFormat(f.id)} className={active.id === f.id ? btnActive : btn}>{f.label}</button>
                ))}
              </div>
              {qualityMatters && (
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                  <span>Quality: {Math.round(quality * 100)}%</span>
                  <input type="range" min={0.05} max={1} step={0.05} value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                </label>
              )}
              {!opaque && <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Transparency is preserved for PNG, WebP, GIF and AVIF.</p>}
              {opaque && <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">JPG / BMP do not support transparency — filled with a clean white background.</p>}
            </section>

            <section className="rounded-none border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className={label}>Resize</h3>
              <div className="flex flex-wrap gap-2">
                {(['none', 'percent', 'pixels'] as const).map((m) => (
                  <button key={m} onClick={() => setResizeMode(m)} className={resizeMode === m ? btnActive : btn}>{m === 'none' ? 'Off' : m}</button>
                ))}
              </div>
              {resizeMode === 'percent' && (
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                  <span>Scale factor: {percent}%</span>
                  <input type="range" min={1} max={400} value={percent} onChange={(e) => setPercent(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                </label>
              )}
              {resizeMode === 'pixels' && (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div>
                    <span className="block text-[11px] font-semibold text-zinc-500 mb-1">Width</span>
                    <input type="number" value={pxW} onChange={(e) => setPxW(parseInt(e.target.value) || 0)} className={`${input} w-28`} />
                  </div>
                  <span className="mt-5">×</span>
                  <div>
                    <span className="block text-[11px] font-semibold text-zinc-500 mb-1">Height</span>
                    <input type="number" value={pxH} onChange={(e) => setPxH(parseInt(e.target.value) || 0)} className={`${input} w-28`} />
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-5 cursor-pointer">
                    <input type="checkbox" checked={keepAspect} onChange={(e) => setKeepAspect(e.target.checked)} className="w-4 h-4 rounded-none accent-indigo-600" />
                    Keep aspect ratio
                  </label>
                </div>
              )}
            </section>

            <section className="rounded-none border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50 md:col-span-2">
              <h3 className={label}>Crop</h3>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setCropEnabled(!cropEnabled)} className={cropEnabled ? btnActive : btn}>{cropEnabled ? 'Crop: Active' : 'Crop: Off'}</button>
                {cropEnabled && (
                  <select onChange={(e) => aspectRef.current = parseFloat(e.target.value) || 0} defaultValue="0" className={input}>
                    <option value="0">Free aspect</option>
                    <option value="1">Square 1:1</option>
                    <option value="1.5">3:2</option>
                    <option value="1.777">16:9</option>
                    <option value="0.75">4:3</option>
                    <option value="1.25">5:4</option>
                  </select>
                )}
              </div>
              {cropEnabled && (
                <div
                  ref={stageRef}
                  onPointerDown={down} onPointerMove={move} onPointerUp={up}
                  className="relative inline-block select-none touch-none overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-black/5 dark:bg-white/5"
                >
                  <img src={items[0].url} className="block max-h-[360px] w-auto pointer-events-none" alt="Crop source" />
                  <div className="absolute border-2 border-indigo-500 ring-2 ring-white/50 bg-indigo-500/15"
                    style={{ left: `${crop.nx * 100}%`, top: `${crop.ny * 100}%`, width: `${crop.nw * 100}%`, height: `${crop.nh * 100}%` }}>
                    <div className="absolute w-3 h-3 -left-1.5 -top-1.5 bg-indigo-600 border border-white" />
                    <div className="absolute w-3 h-3 -right-1.5 -top-1.5 bg-indigo-600 border border-white" />
                    <div className="absolute w-3 h-3 -left-1.5 -bottom-1.5 bg-indigo-600 border border-white" />
                    <div className="absolute w-3 h-3 -right-1.5 -bottom-1.5 bg-indigo-600 border border-white" />
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-none border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className={label}>Rotate & flip</h3>
              <div className="flex flex-wrap gap-2">
                {[0, 90, 180, 270].map((r) => (
                  <button key={r} onClick={() => setRotate(r)} className={rotate === r ? btnActive : btn}>{r === 0 ? '0°' : `${r}°`}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setFlipH(!flipH)} className={flipH ? btnActive : btn}>Flip Horizontal</button>
                <button onClick={() => setFlipV(!flipV)} className={flipV ? btnActive : btn}>Flip Vertical</button>
              </div>
            </section>

            <section className="rounded-none border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className={label}>Adjustments & Filters</h3>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                <span>Brightness: {brightness}%</span>
                <input type="range" min={0} max={200} value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
              </label>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                <span>Contrast: {contrast}%</span>
                <input type="range" min={0} max={200} value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
              </label>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                <span>Saturation: {saturate}%</span>
                <input type="range" min={0} max={300} value={saturate} onChange={(e) => setSaturate(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
              </label>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                <span>Blur: {blur}px</span>
                <input type="range" min={0} max={20} step={0.5} value={blur} onChange={(e) => setBlur(parseFloat(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
              </label>
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => setGrayscale(!grayscale)} className={grayscale ? btnActive : btn}>Grayscale</button>
                <button onClick={() => setSepia(!sepia)} className={sepia ? btnActive : btn}>Sepia</button>
              </div>
            </section>

            <section className="rounded-none border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className={label}>Rounded corners</h3>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                <span>Corner Radius: {cornerRadius}%</span>
                <input type="range" min={0} max={50} value={cornerRadius} onChange={(e) => setCornerRadius(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
              </label>
              {opaque && <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Use PNG, WebP or GIF to keep corner backgrounds transparent.</p>}
            </section>

            <section className="rounded-none border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50 md:col-span-2">
              <h3 className={label}>Add watermarks & text</h3>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type overlay text here…" className={`${input} w-full max-w-md`} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                  <span>Font Size: {textSize}%</span>
                  <input type="range" min={2} max={30} value={textSize} onChange={(e) => setTextSize(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                </label>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 space-y-1">
                  <span>Opacity: {textOpacity}%</span>
                  <input type="range" min={5} max={100} value={textOpacity} onChange={(e) => setTextOpacity(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                </label>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 flex flex-col gap-1">
                  <span>Text Color</span>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-full border border-zinc-300 dark:border-zinc-700 bg-transparent rounded-none cursor-pointer" />
                </label>
                <label className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300 mt-6 cursor-pointer">
                  <input type="checkbox" checked={textBold} onChange={(e) => setTextBold(e.target.checked)} className="w-4 h-4 rounded-none accent-indigo-600" />
                  Bold text
                </label>
              </div>
              <div className="inline-grid grid-cols-3 gap-1.5 pt-2">
                {TEXT_POSITIONS.map((p) => (
                  <button key={p.id} onClick={() => setTextPos(p.id)} className={`px-4 h-9 text-xs font-bold uppercase tracking-wider border ${textPos === p.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white'}`}>{p.label}</button>
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button onClick={convert} disabled={busy} className="px-6 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider rounded-none shadow-md transition-all disabled:opacity-50">
              {busy ? 'Processing…' : `Convert all images (${items.length})`}
            </button>
            {items.some((it) => it.out) && (
              <button onClick={downloadZip} className="px-6 h-12 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-bold text-sm uppercase tracking-wider rounded-none shadow-sm transition-all">
                Download ZIP archive
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {items.map((it, i) => (
              <div key={i} className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-none p-4 space-y-3">
                <div className="w-full h-44 bg-zinc-200/60 dark:bg-zinc-950/60 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center p-2 overflow-hidden">
                  <img src={it.out || it.url} className="max-h-full max-w-full object-contain pointer-events-none" alt={it.file.name} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold truncate text-zinc-900 dark:text-white">{it.file.name}</p>
                  <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 tabular-nums">
                    {it.w}×{it.h}{it.ow ? ` → ${it.ow}×${it.oh}` : ''}{it.outSize ? ` • ${(it.outSize / 1024).toFixed(0)}KB` : ''}
                  </p>
                </div>
                {it.out && it.outName && (
                  <a href={it.out} download={it.outName} className="inline-flex items-center justify-center w-full h-9 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-none transition-colors">
                    Download {active.ext.toUpperCase()}
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
