import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default function ImageCompressor() {
  const [items, setItems] = useState<{ file: File, url: string, out?: string, size: number }[]>([])
  const [quality, setQuality] = useState(0.7)

  const dropFiles: DropFile[] = items.map((i) => ({ name: i.file.name, size: i.file.size, url: i.url }))

  const onFiles = async (fl: FileList) => {
    const arr = Array.from(fl).filter((f) => f.type.startsWith('image/'))
    const mapped = await Promise.all(arr.map(async (f) => {
      const url = URL.createObjectURL(f)
      return { file: f, url, size: f.size }
    }))
    setItems(mapped)
  }

  const compressAll = async () => {
    const out = await Promise.all(items.map(async (item) => {
      const img = new Image()
      img.src = item.url
      await new Promise((r) => img.onload = r)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob((b) => r(b), 'image/jpeg', quality))
      if (!blob) return item
      const url = URL.createObjectURL(blob)
      return { ...item, out: url, size: blob.size }
    }))
    setItems(out as any)
  }

  const downloadZip = async () => {
    const zip = new JSZip()
    for (let i = 0; i < items.length; i++) {
      const f = items[i]
      if (!f.out) continue
      const res = await fetch(f.out)
      const blob = await res.blob()
      zip.file(`compressed-${f.file.name.replace(/\.[^.]+$/, '')}.jpg`, blob)
    }
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'compressed-images.zip')
  }

  const totalIn = items.reduce((a, f) => a + f.file.size, 0)
  const totalOut = items.reduce((a, f) => a + (f.out ? f.size : 0), 0)
  const done = items.length > 0 && items.every((f) => f.out)

  return (
    <div className="space-y-5">
      <DropZone
        onFiles={onFiles}
        accept="image/*"
        files={dropFiles}
        onClear={() => setItems([])}
        label="Drop JPG/PNG/WebP images"
      />
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-3 text-[13px] font-bold text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
              Quality {Math.round(quality * 100)}%
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-44" />
            </label>
            <button onClick={compressAll} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Compress</button>
            {done && <button onClick={downloadZip} className="px-5 h-10 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Download ZIP</button>}
          </div>
          {done && (
            <p className={`text-[13px] font-bold ${totalOut < totalIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {(totalIn / 1024 / 1024).toFixed(2)} MB → {(totalOut / 1024 / 1024).toFixed(2)} MB ({totalIn ? Math.round((1 - totalOut / totalIn) * 100) : 0}% saved)
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((f, i) => (
              <div key={i} className="bg-zinc-100 dark:bg-zinc-800 p-2">
                <img src={f.out || f.url} className="w-full h-28 object-contain" alt="" />
                <p className="text-[11px] font-bold mt-1.5 truncate">{f.file.name}</p>
                <p className="text-[10.5px] font-semibold text-zinc-500 dark:text-zinc-400">{(f.file.size / 1024).toFixed(0)} KB → {f.out ? (f.size / 1024).toFixed(0) + ' KB' : '…'}</p>
                {f.out && <a href={f.out} download={`compressed-${f.file.name.replace(/\.[^.]+$/, '')}.jpg`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Download</a>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}