import { useEffect, useRef, useState } from 'react'
import DropZone from '../../components/DropZone'

export default function AltTextGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [alt, setAlt] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!file) { setImg(null); setAlt(''); return }
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.onload = () => { setImg(im); URL.revokeObjectURL(url) }
    im.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  const analyze = () => {
    const canvas = canvasRef.current, im = img
    if (!canvas || !im) return
    canvas.width = im.width
    canvas.height = im.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(im, 0, 0)
    const sx = Math.max(1, Math.floor(im.width / 100))
    const sy = Math.max(1, Math.floor(im.height / 100))
    const data = ctx.getImageData(0, 0, im.width, im.height).data
    let r = 0, g = 0, b = 0, bright = 0, dark = 0, n = 0
    for (let y = 0; y < im.height; y += sy) {
      for (let x = 0; x < im.width; x += sx) {
        const i = (y * im.width + x) * 4
        r += data[i]; g += data[i + 1]; b += data[i + 2]
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        if (lum > 180) bright++
        if (lum < 60) dark++
        n++
      }
    }
    r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n)
    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
    const names: Record<string, string> = { '#808080': 'gray', '#a52a2a': 'brown', '#0000ff': 'blue', '#008000': 'green', '#ff0000': 'red', '#ffff00': 'yellow', '#ffa500': 'orange', '#800080': 'purple', '#ffc0cb': 'pink', '#ffffff': 'white', '#000000': 'black' }
    let best = hex
    let bestD = Infinity
    for (const [k, v] of Object.entries(names)) {
      const p = parseInt(k.slice(1), 16)
      const kr = p >> 16 & 255, kg = p >> 8 & 255, kb = p & 255
      const d = (kr - r) ** 2 + (kg - g) ** 2 + (kb - b) ** 2
      if (d < bestD) { bestD = d; best = v }
    }
    const isDark = (0.299 * r + 0.587 * g + 0.114 * b) < 128
    const brightPct = Math.round(bright / n * 100)
    const parts = [`A ${im.width}×${im.height} pixel image`, `predominantly ${best}`, isDark ? 'dark-toned' : 'light-toned', `with ${brightPct}% bright areas`]
    const baseName = (file?.name || '').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
    setAlt(`${parts.join(', ')}${baseName ? ` — subject appears to be "${baseName}"` : ''}.`)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="image/*" multiple={false} label="Drop an image to describe" />
      {img && (
        <>
          <canvas ref={canvasRef} className="hidden" />
          <button onClick={analyze} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Generate alt text</button>
          {alt && (
            <div className="border p-3">
              <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Suggested alt text</label>
              <p className="text-sm mt-1">{alt}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => navigator.clipboard.writeText(alt)} className="px-4 h-9 border text-xs">Copy</button>
                <button onClick={analyze} className="px-4 h-9 border text-xs">Regenerate</button>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2">Color/statistics-based description — edit it to describe the actual content: e.g. &quot;Two people hiking on a trail at sunset&quot;.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
