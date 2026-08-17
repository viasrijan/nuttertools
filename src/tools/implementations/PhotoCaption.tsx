import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import { saveBlob } from '../../lib/download'

export default function PhotoCaption() {
  const [file, setFile] = useState<File | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [text, setText] = useState('Your caption here')
  const [size, setSize] = useState(42)
  const [color, setColor] = useState('#ffffff')
  const [pos, setPos] = useState<'top' | 'center' | 'bottom'>('bottom')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!file) { setImg(null); return }
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.onload = () => { setImg(im); URL.revokeObjectURL(url) }
    im.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    const canvas = canvasRef.current, im = img
    if (!canvas || !im) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const scale = Math.min(1600 / im.width, 1)
    canvas.width = im.width * scale
    canvas.height = im.height * scale
    ctx.drawImage(im, 0, 0, canvas.width, canvas.height)
    if (text.trim()) {
      ctx.font = `700 ${size}px sans-serif`
      ctx.textAlign = 'center'
      ctx.lineWidth = Math.max(2, size / 10)
      ctx.strokeStyle = 'rgba(0,0,0,0.7)'
      ctx.fillStyle = color
      const lines = text.split('\n')
      const lh = size * 1.25
      const y = pos === 'top' ? lh : pos === 'bottom' ? canvas.height - lh * lines.length : canvas.height / 2 - (lines.length - 1) * lh / 2
      lines.forEach((l, i) => {
        ctx.strokeText(l, canvas.width / 2, y + i * lh)
        ctx.fillText(l, canvas.width / 2, y + i * lh)
      })
    }
  }, [img, text, size, color, pos])

  return (
    <div className="space-y-5">
      <DropZone onFiles={fl => setFile(fl[0])} accept="image/*" multiple={false} label="Drop a photo to add a caption" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm items-center">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Caption text (\\n for new line)" className="border px-2 py-2 col-span-2" />
        <input type="number" value={size} onChange={e => setSize(+e.target.value)} className="border px-2 py-2" title="Font size" />
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 border" />
      </div>
      <div className="flex gap-2 text-sm">
        {(['top', 'center', 'bottom'] as const).map(p => (
          <Button variant="outline" key={p} onClick={() => setPos(p)} className={`px-4 h-9 border capitalize ${pos === p ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{p}</Button>
        ))}
      </div>
      {img && (
        <>
          <canvas ref={canvasRef} className="max-w-full border" />
          <Button variant="secondary" onClick={() => canvasRef.current?.toBlob(b => b && saveBlob(b, file?.name.replace(/\.[^.]+$/, '') + '-captioned.png'), 'image/png')}>Download PNG</Button>
        </>
      )}
    </div>
  )
}
