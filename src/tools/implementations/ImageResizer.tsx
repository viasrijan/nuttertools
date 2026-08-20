import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import { Select } from '../../components/ui/Select'
import Progress from '../../components/Progress'
import { DownloadButton } from '../../components/ui/DownloadButton'
import { saveDataUrl } from '../../lib/download'

const PRESETS = [
  { label: 'Icon 256px', w: 256, h: 256 },
  { label: 'Square 512px', w: 512, h: 512 },
  { label: 'Banner 1920×1080', w: 1920, h: 1080 },
  { label: 'Instagram 1080×1080', w: 1080, h: 1080 },
  { label: 'Story 1080×1920', w: 1080, h: 1920 },
]

const MODES = [
  { v: 'percent', label: 'Scale by %' },
  { v: 'pixels', label: 'Fit to pixels' },
  { v: 'preset', label: 'Preset size' },
]

type FileRes = { name: string, url: string, w: number, h: number }

export default function ImageResizer() {
  const [img, setImg] = useState<{ url: string, w: number, h: number } | null>(null)
  const [files, setFiles] = useState<{ file: File, url: string }[]>([])
  const [mode, setMode] = useState('percent')
  const [percent, setPercent] = useState(50)
  const [w, setW] = useState(800)
  const [h, setH] = useState(600)
  const [quality, setQuality] = useState(0.9)
  const [out, setOut] = useState('')
  const [batch, setBatch] = useState<FileRes[] | null>(null)
  const [busy, setBusy] = useState(false)

  const dropFiles: DropFile[] = files.map((f) => ({ name: f.file.name, size: f.file.size, url: f.url }))

  const loadOne = async (file: File) => {
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.src = url
    await new Promise((r, j) => { im.onload = r; im.onerror = j })
    return { url, w: im.naturalWidth, h: im.naturalHeight }
  }

  const onFiles = async (fl: FileList) => {
    const list = Array.from(fl).filter((f) => f.type.startsWith('image/'))
    if (!list.length) return
    const first = await loadOne(list[0])
    setImg({ url: first.url, w: first.w, h: first.h })
    setFiles(list.map((file) => ({ file, url: URL.createObjectURL(file) })))
    setW(first.w); setH(first.h)
    setOut('')
    if (list.length > 1) {
      setBatch([])
      setBusy(true)
      try {
        const results: FileRes[] = []
        for (const f of list) {
          const dims = await loadOne(f)
          results.push({ name: f.name, ...dims })
        }
        setBatch(results)
      } finally {
        setBusy(false)
      }
    } else {
      setBatch(null)
    }
  }

  const targetDims = (cur: { w: number, h: number }) => {
    if (mode === 'percent') return { w: Math.round(cur.w * percent / 100), h: Math.round(cur.h * percent / 100) }
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

  const preset = PRESETS.find((p) => p.w === w && p.h === h)

  return (
    <div className="space-y-5">
      <DropZone
        onFiles={onFiles}
        accept="image/*"
        multiple={true}
        files={dropFiles}
        onClear={() => { setFiles([]); setImg(null); setBatch(null); setOut('') }}
        label="Drop one or more images to resize"
      />
      {busy && <Progress label="Processing…" />}
      {img && !batch && (
        <div className="space-y-5">
          <p className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">Original: {img.w} × {img.h}px</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <Select label="Mode" value={mode} onChange={setMode} options={MODES} />
            {mode === 'percent' && (
              <label className="space-y-1.5">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Scale {percent}%</span>
                <input type="range" min={1} max={400} value={percent} onChange={(e) => setPercent(parseInt(e.target.value))} className="w-full" />
              </label>
            )}
            {mode === 'pixels' && (
              <div className="space-y-1.5">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Fit inside</span>
                <div className="flex items-center gap-2">
                  <input type="number" value={w} onChange={(e) => setW(parseInt(e.target.value) || 0)} className="w-24 h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
                  <span className="font-bold text-zinc-500">×</span>
                  <input type="number" value={h} onChange={(e) => setH(parseInt(e.target.value) || 0)} className="w-24 h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
                </div>
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Keeps aspect ratio</p>
              </div>
            )}
            {mode === 'preset' && (
              <div className="space-y-1.5">
                <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Preset</span>
                <select
                  value={preset ? `${preset.w}x${preset.h}` : 'custom'}
                  onChange={(e) => {
                    const p = PRESETS.find((x) => `${x.w}x${x.h}` === e.target.value)
                    if (p) { setW(p.w); setH(p.h) }
                  }}
                  className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
                >
                  {PRESETS.map((p) => <option key={p.label} value={`${p.w}x${p.h}`}>{p.label}</option>)}
                  <option value="custom">Custom</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={resize} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Resize</button>
            {out && <DownloadButton onClick={() => saveDataUrl(out, 'resized.jpg')}>Download JPG</DownloadButton>}
          </div>
          {out && <img src={out} className="max-h-[280px] bg-zinc-100 dark:bg-zinc-800" alt="Result" />}
        </div>
      )}
      {batch && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={resize} disabled={busy} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors">Resize all ({batch.length})</button>
            {batch.every((b) => b.url.startsWith('data:')) && (
              <DownloadButton onClick={() => {
                batch.forEach((b) => {
                  const a = document.createElement('a')
                  a.href = b.url
                  a.download = b.name.replace(/\.[^.]+$/, '') + '-resized.jpg'
                  a.click()
                })
              }}>Download all</DownloadButton>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {batch.map((b, i) => (
              <div key={i} className="bg-zinc-100 dark:bg-zinc-800 p-2">
                <img src={b.url} className="max-h-[140px] mx-auto object-contain" alt={b.name} />
                <p className="text-[11px] font-bold truncate mt-1.5">{b.name}</p>
                {b.url.startsWith('data:') && <DownloadButton onClick={() => saveDataUrl(b.url, b.name.replace(/\.[^.]+$/, '') + '-resized.jpg')}>Download</DownloadButton>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}