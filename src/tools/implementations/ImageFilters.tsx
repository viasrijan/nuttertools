import { useRef, useState } from 'react'
import DropZone from '../../components/DropZone'

const INIT = { brightness: 100, contrast: 100, saturate: 100, blur: 0, grayscale: 0, sepia: 0, invert: 0, hue: 0 }

export default function ImageFilters() {
  const [img, setImg] = useState<{ url: string } | null>(null)
  const [f, setF] = useState(INIT)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const onFiles = async (fl: FileList) => {
    const file = fl[0]
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.src = url
    await new Promise(r => im.onload = r)
    imgRef.current = im
    setImg({ url })
    setF(INIT)
  }

  const filterCss = () =>
    `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) invert(${f.invert}%) hue-rotate(${f.hue}deg)`

  const download = () => {
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
        <DropZone onFiles={onFiles} accept="image/*" multiple={false} label="Drop an image to edit" />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button onClick={download} className="px-4 h-9 bg-zinc-900 text-white text-sm">Download</button>
            <button onClick={() => setF(INIT)} className="px-4 h-9 border text-sm">Reset</button>
            <button onClick={() => setImg(null)} className="px-4 h-9 border text-sm">New image</button>
          </div>
          <img src={img.url} style={{ filter: filterCss() }} className="max-h-[380px] mx-auto" alt="Preview" />
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
