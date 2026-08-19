import { useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

import DropZone from '../../components/DropZone'

export default function ColorPicker() {
  const [color, setColor] = useState('#4F46E5')
  const [picked, setPicked] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const onFiles = async (fl: FileList) => {
    const file = fl[0]
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    await new Promise(r => img.onload = r)
    const c = canvasRef.current!
    c.width = img.naturalWidth; c.height = img.naturalHeight
    c.getContext('2d')!.drawImage(img, 0, 0)
    const ctx = c.getContext('2d')!
    const pick = (x: number, y: number) => {
      const [r, g, b] = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data
      const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
      setColor(hex)
      setPicked(p => [hex, ...p].slice(0, 8))
    }
    c.onclick = (e) => {
      const rect = c.getBoundingClientRect()
      pick((e.clientX - rect.left) / rect.width * c.width, (e.clientY - rect.top) / rect.height * c.height)
    }
    c.style.maxWidth = '100%'
  }

  const pickScreen = async () => {
    const ED = (window as any).EyeDropper
    if (ED) {
      try {
        const res = await new ED().open()
        setColor(res.sRGBHex)
        setPicked(p => [res.sRGBHex, ...p].slice(0, 8))
      } catch { /* cancelled */ }
    }
  }

  return (
    <div className="space-y-5 max-w-2xl omni-rise">
      <div className="flex items-center gap-3">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-16 h-12 border" />
        <div className="flex-1">
          <code className="font-mono text-lg">{color}</code>
          <div className="flex gap-2 mt-1">
            <CopyButton value={color} />
            <Button variant="outline" size="sm" className="text-xs px-2 h-7" onClick={pickScreen}>Pick from screen</Button>
          </div>
        </div>
      </div>
      <div className="h-16  border" style={{ background: color }} />
      <div className="flex flex-wrap gap-2.5">
        {picked.map((p, i) => (
          <button key={i} onClick={() => setColor(p)} className={`w-9 h-9 rounded-full transition-transform duration-200 hover:scale-110 ${color === p ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}`} style={{ background: p, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }} title={p} />
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Pick from image (click anywhere)</p>
        <DropZone onFiles={onFiles} accept="image/*" multiple={false} label="Drop an image to sample colors" />
        <canvas ref={canvasRef} className="mt-3  border max-h-[360px]" />
      </div>
    </div>
  )
}
