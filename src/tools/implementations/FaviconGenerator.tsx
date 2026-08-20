import { useEffect, useRef, useState } from 'react'
import { FileImage, Type } from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { DownloadButton } from '../../components/ui/DownloadButton'

import { saveBlob } from '../../lib/download'

const GRADIENTS: { name: string; from: string; to: string }[] = [
  { name: 'Indigo', from: '#6366f1', to: '#8b5cf6' },
  { name: 'Sky', from: '#0ea5e9', to: '#06b6d4' },
  { name: 'Emerald', from: '#10b981', to: '#14b8a6' },
  { name: 'Amber', from: '#f59e0b', to: '#f97316' },
  { name: 'Rose', from: '#f43f5e', to: '#ec4899' },
  { name: 'Fuchsia', from: '#d946ef', to: '#a855f7' },
  { name: 'Slate', from: '#334155', to: '#0f172a' },
  { name: 'Crimson', from: '#ef4444', to: '#b91c1c' },
]

const SOLIDS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#334155', '#ffffff', '#111111']

function dataUrlToBlob(d: string): Blob {
  const bytes = atob(d.split(',')[1])
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], { type: 'image/png' })
}

function icoBlob(pngs: { size: number; url: string }[]): Blob {
  const blobs = pngs.map((p) => dataUrlToBlob(p.url))
  const header = new ArrayBuffer(6)
  const hv = new DataView(header)
  hv.setUint16(0, 0, true)
  hv.setUint16(2, 1, true)
  hv.setUint16(4, pngs.length, true)
  const entries = new ArrayBuffer(pngs.length * 16)
  const ev = new DataView(entries)
  let offset = 6 + pngs.length * 16
  pngs.forEach((p, i) => {
    const b = blobs[i]
    ev.setUint8(i * 16, p.size >= 256 ? 0 : p.size)
    ev.setUint8(i * 16 + 1, p.size >= 256 ? 0 : p.size)
    ev.setUint8(i * 16 + 2, 0)
    ev.setUint8(i * 16 + 3, 0)
    ev.setUint16(i * 16 + 4, 1, true)
    ev.setUint16(i * 16 + 6, 32, true)
    ev.setUint32(i * 16 + 8, b.size, true)
    ev.setUint32(i * 16 + 12, offset, true)
    offset += b.size
  })
  return new Blob([header, entries, ...blobs], { type: 'image/x-icon' })
}

export default function FaviconGenerator() {
  const [mode, setMode] = useState<'text' | 'image'>('text')
  const [text, setText] = useState('N')
  const [useGradient, setUseGradient] = useState(true)
  const [grad, setGrad] = useState(0)
  const [bg, setBg] = useState('#4f46e5')
  const [fg, setFg] = useState('#ffffff')
  const [radius, setRadius] = useState(0)
  const [photo, setPhoto] = useState<{ url: string; img: HTMLImageElement } | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const draw = (size: number): string => {
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const r = (radius / 100) * size
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, r)
    ctx.clip()

    if (useGradient) {
      const g = GRADIENTS[grad]
      const lg = ctx.createLinearGradient(0, 0, size, size)
      lg.addColorStop(0, g.from)
      lg.addColorStop(1, g.to)
      ctx.fillStyle = lg
      ctx.fillRect(0, 0, size, size)
    } else {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, size, size)
    }

    if (mode === 'image' && photo) {
      const img = photo.img
      const scale = Math.max(size / img.width, size / img.height)
      const w = img.width * scale
      const h = img.height * scale
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
    } else if (text.trim()) {
      ctx.fillStyle = fg
      ctx.font = `800 ${size * 0.56}px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text.slice(0, 1), size / 2, size / 2 + size * 0.02)
    }
    return c.toDataURL('image/png')
  }

  useEffect(() => {
    const t = setTimeout(() => setPreviews([16, 32, 48, 64, 180].map(draw)), 50)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, text, useGradient, grad, bg, fg, radius, photo])

  const pickPhoto = (f: File) => {
    if (!f.type.startsWith('image/')) return
    const url = URL.createObjectURL(f)
    const img = new Image()
    img.onload = () => setPhoto({ url, img })
    img.src = url
  }

  const download = (size: number, name: string) => saveBlob(dataUrlToBlob(draw(size)), name)

  const Swatch = ({ color, active, onClick, title }: { color: string; active: boolean; onClick: () => void; title: string }) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`w-8 h-8 rounded-full shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 ${active ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}`}
      style={{ background: color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}
    />
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Source</span>
          <div className="flex gap-2">
            <Button variant={mode === 'text' ? 'primary' : 'ghost'} size="sm" icon={<Type className="w-3.5 h-3.5" />} onClick={() => setMode('text')}>Text</Button>
            <Button variant={mode === 'image' ? 'primary' : 'ghost'} size="sm" icon={<FileImage className="w-3.5 h-3.5" />} onClick={() => setMode('image')}>Image</Button>
          </div>
        </div>

        {mode === 'text' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
              <label className="block">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">Letter</span>
                <input value={text} onChange={(e) => setText(e.target.value.slice(0, 2))} maxLength={2} className="w-full h-10 px-3 text-sm font-bold text-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none focus:bg-white dark:focus:bg-zinc-900 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] transition-all duration-150" />
              </label>
              <label className="block">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">Text color</span>
                <div className="flex items-center gap-2 h-10">
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-9 h-9 rounded-full overflow-hidden cursor-pointer" title="Custom text color" />
                  {['#ffffff', '#111111'].map((c) => (
                    <Swatch key={c} color={c} active={fg === c} onClick={() => setFg(c)} title={`Text ${c === '#ffffff' ? 'white' : 'dark'}`} />
                  ))}
                </div>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Background style</span>
                <div className="flex gap-2">
                  <Button variant={useGradient ? 'primary' : 'ghost'} size="sm" onClick={() => setUseGradient(true)}>Gradient</Button>
                  <Button variant={!useGradient ? 'primary' : 'ghost'} size="sm" onClick={() => setUseGradient(false)}>Solid</Button>
                </div>
              </div>
              {useGradient ? (
                <div className="flex flex-wrap gap-2">
                  {GRADIENTS.map((g, i) => (
                    <button
                      key={g.name}
                      type="button"
                      title={g.name}
                      aria-label={g.name}
                      onClick={() => setGrad(i)}
                      className={`w-9 h-9 rounded-full shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 ${grad === i ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}`}
                      style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})`, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {SOLIDS.map((c) => (
                    <Swatch key={c} color={c} active={bg === c} onClick={() => setBg(c)} title={`Background ${c}`} />
                  ))}
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-9 h-9 rounded-full overflow-hidden cursor-pointer" title="Custom background color" />
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pickPhoto(f); e.target.value = '' }} />
            {photo ? (
              <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 shadow-sm px-3 py-2.5">
                <img src={photo.url} alt="" className="w-11 h-11 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-zinc-900 dark:text-white truncate">Photo loaded — scaled to fit each size</p>
                  <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Cover fit, center cropped</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => setPhoto(null)}>Remove</Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full min-h-[110px] flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-zinc-300/90 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900/40 hover:border-indigo-400 dark:hover:border-indigo-500/70 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/[0.06] transition-all duration-200 outline-none"
              >
                <span className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 grid place-items-center"><FileImage className="w-5 h-5" /></span>
                <span className="text-[13px] font-bold text-zinc-900 dark:text-white">Click to upload an image</span>
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">PNG, JPG, WebP or SVG</span>
              </button>
            )}
          </div>
        )}

        <label className="block">
          <span className="flex items-center justify-between text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">
            Corner radius <span className="text-indigo-600 dark:text-indigo-400">{radius}%</span>
          </span>
          <input type="range" min="0" max="50" value={radius} onChange={(e) => setRadius(+e.target.value)} className="w-full" />
        </label>

        <div className="flex flex-wrap gap-2.5">
          <DownloadButton onClick={() => download(256, 'favicon-256.png')}>Download PNG 256px</DownloadButton>
          <DownloadButton onClick={() => saveBlob(icoBlob([16, 32, 48, 64].map((s) => ({ size: s, url: draw(s) }))), 'favicon.ico')}>Download .ico pack</DownloadButton>
          <DownloadButton onClick={() => download(180, 'apple-touch-icon.png')}>Download 180px</DownloadButton>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-zinc-900 shadow-sm p-5 flex flex-col items-center gap-4">
          <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Live preview</span>
          <div className="w-24 h-24 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)]" style={{ backgroundImage: previews[4] ? `url(${previews[4]})` : 'none', backgroundSize: 'cover' }} />
          <div className="flex flex-wrap justify-center gap-3">
            {[16, 32, 48, 64, 180].map((s, i) => (
              <div key={s} className="text-center">
                <div className="mx-auto shadow-sm" style={{ width: s, height: s, backgroundImage: previews[i] ? `url(${previews[i]})` : 'none', backgroundSize: 'cover' }} />
                <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1">{s}px</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11.5px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
          The .ico pack bundles 16, 32, 48 and 64px PNGs into a single ICO file for browsers and favicon.io. Everything is generated locally in your browser.
        </p>
      </div>
    </div>
  )
}