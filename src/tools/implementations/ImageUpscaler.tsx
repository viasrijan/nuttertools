import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { saveBlob } from '../../lib/download'
import { aiImage } from '../../lib/ai'

const UPSCALE_PROMPT =
  'Upscale this image to twice its resolution. Enhance fine details, sharpness and clarity naturally. ' +
  'Keep the content, composition, colors and style exactly the same — do not add, remove or invent anything. ' +
  'Return only the enhanced high-resolution image.'

async function fileToPreparedBase64(f: File): Promise<{ b64: string, mime: string }> {
  const bmp = await createImageBitmap(f)
  const maxDim = 1536
  const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * scale)
  c.height = Math.round(bmp.height * scale)
  const ctx = c.getContext('2d')!
  ctx.drawImage(bmp, 0, 0, c.width, c.height)
  const dataUrl = c.toDataURL('image/jpeg', 0.92)
  return { b64: dataUrl.split(',')[1], mime: 'image/jpeg' }
}

function base64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return new Blob([arr], { type: mime || 'image/png' })
}

export default function ImageUpscaler() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const upscale = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setBusy(true); setError(''); setResult('')
    try {
      setStatus('Preparing image…')
      const { b64, mime } = await fileToPreparedBase64(f)
      setStatus('Enhancing & upscaling with Gemini…')
      const out = await aiImage(UPSCALE_PROMPT, b64, mime)
      const blob = base64ToBlob(out.data, out.mime)
      const url = URL.createObjectURL(blob)
      setResult(url)
      setStatus('')
      saveBlob(blob, `upscaled-${f.name.replace(/\.[^.]+$/, '')}.png`)
    } catch (e: any) {
      setError('AI upscale failed: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={upscale} accept="image/*" multiple={false} label="Drop an image to enhance & upscale" />
      {busy && <Progress label={status} />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {file && result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="border p-2"><p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Before</p><img src={previewUrl} className="w-full" alt="" /></div>
          <div className="border p-2"><p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">After</p><img src={result} className="w-full" alt="" /></div>
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Powered by Google&apos;s Gemini image model — detail-enhancing super-resolution via the site&apos;s secure proxy.</p>
    </div>
  )
}
