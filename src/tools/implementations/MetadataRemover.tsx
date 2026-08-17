import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import { saveBlob } from '../../lib/download'

export default function MetadataRemover() {
  const [files, setFiles] = useState<File[]>([])
  const [done, setDone] = useState<{ name: string, before: string, after: string }[]>([])

  const strip = async () => {
    const out: { name: string, before: string, after: string }[] = []
    for (const f of files) {
      const url = URL.createObjectURL(f)
      try {
        const im = await new Promise<HTMLImageElement>((res, rej) => {
          const i = new Image()
          i.onload = () => res(i)
          i.onerror = rej
          i.src = url
        })
        const canvas = document.createElement('canvas')
        canvas.width = im.width
        canvas.height = im.height
        canvas.getContext('2d')!.drawImage(im, 0, 0)
        const ext = (f.name.match(/\.(png|jpe?g|webp)$/i) || ['.jpg'])[0]
        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, mime, 0.95))
        if (blob) {
          const u = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = u
          a.download = f.name.replace(/\.[^.]+$/, '') + '-clean' + (ext === '.jpg' ? '.jpg' : ext)
          a.click()
          URL.revokeObjectURL(u)
          out.push({ name: f.name, before: (f.size / 1024).toFixed(1) + ' KB', after: (blob.size / 1024).toFixed(1) + ' KB' })
        }
      } catch { /* skip unsupported */ }
      URL.revokeObjectURL(url)
    }
    setDone(out)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFiles(Array.from(fl))} accept="image/*" multiple label="Drop JPG / PNG / WebP photos" />
      <p className="text-xs text-zinc-500">Re-encodes each image through a fresh canvas, dropping EXIF (GPS, camera, timestamps) and any embedded metadata. Files are never uploaded.</p>
      <Button variant="secondary" onClick={strip} disabled={!files.length}>Strip metadata & download</Button>
      {done.length > 0 && (
        <div className="space-y-1 text-xs">
          {done.map((d, i) => <div key={i} className="border p-2 flex justify-between"><span className="font-semibold">{d.name}</span><span className="text-zinc-500">{d.before} → {d.after}</span></div>)}
        </div>
      )}
    </div>
  )
}
