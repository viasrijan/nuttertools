import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'

export default function PaletteExtractor() {
  const [colors, setColors] = useState<string[]>([])
  const [img, setImg] = useState('')
  const [file, setFile] = useState<{ name: string, size: number } | null>(null)

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size, url: img }] : []

  const onFiles = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImg(url)
    setFile({ name: file.name, size: file.size })
    const image = new Image()
    image.src = url
    await new Promise((r) => image.onload = r)
    const canvas = document.createElement('canvas')
    canvas.width = 100; canvas.height = 100
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0, 100, 100)
    const data = ctx.getImageData(0, 0, 100, 100).data
    const map: Record<string, number> = {}
    for (let i = 0; i < data.length; i += 4 * 10) {
      const key = `${Math.round(data[i] / 10) * 10},${Math.round(data[i + 1] / 10) * 10},${Math.round(data[i + 2] / 10) * 10}`
      map[key] = (map[key] || 0) + 1
    }
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => {
      const [r, g, b] = k.split(',').map(Number)
      return `rgb(${r},${g},${b})`
    })
    setColors(sorted)
  }

  return (
    <div className="space-y-5">
      <DropZone
        onFiles={onFiles}
        accept="image/*"
        multiple={false}
        files={dropFiles}
        onClear={() => { setFile(null); setImg(''); setColors([]) }}
        label="Drop image to extract palette"
      />
      {img && <img src={img} className="w-full max-h-[300px] object-contain bg-zinc-100 dark:bg-zinc-800" alt="" />}
      <div className="flex gap-2 flex-wrap">
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 pl-1 pr-3 py-1">
            <div className="w-6 h-6" style={{ background: c }} />
            <span className="text-xs font-mono font-bold">{c}</span>
            <button onClick={() => navigator.clipboard.writeText(c)} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Copy</button>
          </div>
        ))}
      </div>
    </div>
  )
}