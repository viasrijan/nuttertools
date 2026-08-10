import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'

async function fileToBase64(f: File): Promise<{ data: string; mimeType: string }> {
  const bmp = await createImageBitmap(f)
  const scale = Math.min(1, 1280 / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bmp.width * scale))
  canvas.height = Math.max(1, Math.round(bmp.height * scale))
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85))
  if (!blob) throw new Error('Could not encode image')
  const dataUrl = await new Promise<string>((r) => {
    const fr = new FileReader()
    fr.onload = () => r(fr.result as string)
    fr.readAsDataURL(blob)
  })
  return { data: dataUrl.split(',')[1] ?? '', mimeType: 'image/jpeg' }
}

export default function ImageCaptioner() {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')

  const captionImg = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setBusy(true); setError(''); setCaption('')
    try {
      setStatus('Preparing image…')
      const { data, mimeType } = await fileToBase64(f)
      setStatus('Contacting cloud AI…')
      const res = await fetch('/api/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: data, mimeType }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (json.error === 'NO_KEY') {
          throw new Error('cloud captions are not configured yet (GEMINI_API_KEY missing on the server)')
        }
        throw new Error(json.error || `server responded ${res.status}`)
      }
      setStatus('')
      setCaption(String(json.caption ?? '').trim())
    } catch (e: any) {
      setError('Captioning failed: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={captionImg} accept="image/*" multiple={false} label="Drop an image to describe" />
      {busy && <Progress label={status} />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {caption && (
        <div className="space-y-3">
          <p className="text-lg font-medium border p-3">{caption}</p>
          <button onClick={() => navigator.clipboard.writeText(caption)} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy</button>
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Powered by Google Gemini in the cloud — nothing is downloaded to your device.</p>
    </div>
  )
}