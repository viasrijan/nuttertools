import { useRef, useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'

export default function SvgToPng() {
  const [items, setItems] = useState<DropFile[]>([])
  const [scale, setScale] = useState('2')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const convert = async (file: File): Promise<void> => {
    const text = await file.text()
    const blob = new Blob([text], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      const s = parseFloat(scale) || 2
      const canvas = canvasRef.current!
      canvas.width = img.naturalWidth * s
      canvas.height = img.naturalHeight * s
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((b) => {
        if (!b) return
        const a = document.createElement('a')
        a.href = URL.createObjectURL(b)
        a.download = file.name.replace(/\.svg$/i, '') + `.png`
        a.click()
      }, 'image/png')
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  const run = () => items.forEach((f) => f.url ? fetch(f.url).then((r) => r.blob()).then((b) => convert(new File([b], f.name, { type: 'image/svg+xml' }))).catch(() => {}) : null)

  return (
    <div className="space-y-6 max-w-xl">
      <canvas ref={canvasRef} className="hidden" />
      <DropZone
        files={items}
        onClear={() => setItems([])}
        onFiles={(list) => setItems((prev) => [...prev, ...list.map((f) => ({ name: f.name, size: f.size, url: f.url }))])}
        accept=".svg,image/svg+xml"
        hint="Drop SVG files — each is converted to PNG"
      />
      <label className="block max-w-[220px]">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">Scale (×)</span>
        <input type="number" min={1} max={8} value={scale} onChange={(e) => setScale(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
      </label>
      <button onClick={run} disabled={items.length === 0} className="px-6 h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-colors">
        Convert {items.length > 0 ? `${items.length} file${items.length > 1 ? 's' : ''}` : ''}
      </button>
    </div>
  )
}