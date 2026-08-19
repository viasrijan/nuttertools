import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import { saveBlob } from '../../lib/download'

export default function FaceBlur() {
  const [file, setFile] = useState<File | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [mode, setMode] = useState<'blur' | 'pixelate'>('blur')
  const [intensity, setIntensity] = useState(18)
  const [box, setBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null)
  const [drawing, setDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const start = useRef<{ x: number, y: number } | null>(null)

  useEffect(() => {
    if (!file) { setImg(null); setBox(null); return }
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.onload = () => { setImg(im); URL.revokeObjectURL(url) }
    im.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    const canvas = canvasRef.current, im = img
    if (!canvas || !im) return
    canvas.width = im.width
    canvas.height = im.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(im, 0, 0)
    if (box) {
      ctx.strokeStyle = 'rgba(68,84,201,0.9)'
      ctx.lineWidth = 3
      ctx.setLineDash([6, 4])
      ctx.strokeRect(box.x, box.y, box.w, box.h)
      ctx.setLineDash([])
    }
  }, [img, box])

  const pos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onDown = (e: React.MouseEvent) => {
    if (!img) return
    start.current = pos(e)
    setDrawing(true)
  }

  const onMove = (e: React.MouseEvent) => {
    if (!drawing || !start.current) return
    const p = pos(e)
    setBox({ x: Math.min(start.current.x, p.x), y: Math.min(start.current.y, p.y), w: Math.abs(p.x - start.current.x), h: Math.abs(p.y - start.current.y) })
  }

  const onUp = () => { setDrawing(false) }

  const applyEffect = () => {
    const canvas = canvasRef.current, im = img
    if (!canvas || !im || !box || box.w < 2 || box.h < 2) return
    const ctx = canvas.getContext('2d')!
    const b = box
    ctx.save()
    ctx.beginPath()
    ctx.rect(b.x, b.y, b.w, b.h)
    ctx.clip()
    if (mode === 'blur') {
      ctx.filter = `blur(${intensity}px)`
      ctx.drawImage(canvas, 0, 0)
    } else {
      const step = Math.max(2, Math.round(intensity / 1.5))
      const sw = Math.max(1, Math.floor(b.w / step)), sh = Math.max(1, Math.floor(b.h / step))
      ctx.drawImage(canvas, b.x, b.y, b.w, b.h, b.x, b.y, sw, sh)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(canvas, b.x, b.y, sw, sh, b.x, b.y, b.w, b.h)
    }
    ctx.restore()
  }

  const clear = () => {
    setBox(null)
    const canvas = canvasRef.current, im = img
    if (canvas && im) canvas.getContext('2d')!.drawImage(im, 0, 0)
  }

  return (
    <div className="space-y-5">
      <DropZone onFiles={fl => setFile(fl[0])} accept="image/*" multiple={false} label="Drop a photo — drag a box over faces or objects to hide" />
      <div className="flex flex-wrap gap-2 text-sm items-center">
        {(['blur', 'pixelate'] as const).map(m => (
          <Button variant="outline" key={m} onClick={() => setMode(m)} className={`px-4 h-9  capitalize ${mode === m ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{m}</Button>
        ))}
        <label className="font-semibold text-zinc-900 dark:text-white ml-2 text-xs">Intensity</label>
        <input type="range" min="4" max="40" value={intensity} onChange={e => setIntensity(+e.target.value)} className="w-32" />
        {box && <Button variant="secondary" size="sm" onClick={applyEffect}>Apply</Button>}
        {box && <Button variant="outline" size="sm" onClick={clear}>Clear</Button>}
      </div>
      {img && (
        <>
          <canvas ref={canvasRef} className="max-w-full border cursor-crosshair" onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} />
          <Button variant="secondary" onClick={() => canvasRef.current?.toBlob(b => b && saveBlob(b, file?.name.replace(/\.[^.]+$/, '') + '-blurred.png'), 'image/png')}>Download PNG</Button>
        </>
      )}
      <p className="text-[11px] text-zinc-500">Everything runs locally in your browser — no photo leaves your device.</p>
    </div>
  )
}
