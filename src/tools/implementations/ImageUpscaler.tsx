import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { saveBlob } from '../../lib/download'

// Open-source Swin2SR super-resolution — runs fully in the browser, no servers or quotas.
let pipePromise: Promise<any> | null = null
function getPipe() {
  if (!pipePromise) {
    pipePromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers')
      env.allowLocalModels = false
      return pipeline('image-to-image', 'Xenova/swin2SR-classical-sr-x2-64', {
        device: 'wasm',
        dtype: 'q8',
        session_options: { graphOptimizationLevel: 'basic' },
      })
    })()
    pipePromise.catch(() => { pipePromise = null })
  }
  return pipePromise
}

function rawToBlob(img: any): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = img.width; canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  const data = img.data instanceof Uint8Array ? img.data : new Uint8Array(img.data)
  const channels = img.channels ?? 3
  const imgData = ctx.createImageData(img.width, img.height)
  for (let i = 0; i < imgData.data.length; i++) {
    const c = i % 4
    imgData.data[i] = c === 3 ? 255 : data[Math.floor(i / 4) * channels + c]
  }
  ctx.putImageData(imgData, 0, 0)
  return new Promise(r => canvas.toBlob(r, 'image/png'))
}

function highQualityResize2x(bmp: ImageBitmap): Promise<Blob> {
  // Progressive upscale (1.5× then to 2×) keeps edges smoother than one jump.
  const mid = document.createElement('canvas')
  mid.width = Math.round(bmp.width * 1.5)
  mid.height = Math.round(bmp.height * 1.5)
  const mctx = mid.getContext('2d')!
  mctx.imageSmoothingEnabled = true
  mctx.imageSmoothingQuality = 'high'
  mctx.drawImage(bmp, 0, 0, mid.width, mid.height)
  const out = document.createElement('canvas')
  out.width = bmp.width * 2
  out.height = bmp.height * 2
  const octx = out.getContext('2d')!
  octx.imageSmoothingEnabled = true
  octx.imageSmoothingQuality = 'high'
  octx.drawImage(mid, 0, 0, out.width, out.height)
  return new Promise(r => out.toBlob(b => r(b!), 'image/png'))
}

export default function ImageUpscaler() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const upscale = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setBusy(true); setError(''); setResult(''); setNote('')
    try {
      setStatus('Preparing image…')
      const bmp = await createImageBitmap(f)
      // Guard the model's memory: run super-resolution on at most ~600px inputs.
      const maxDim = 600
      const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height))
      let inputBlob: Blob = f
      if (scale < 1) {
        const c = document.createElement('canvas')
        c.width = Math.round(bmp.width * scale)
        c.height = Math.round(bmp.height * scale)
        c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
        inputBlob = await new Promise<Blob>(r => c.toBlob(b => r(b!), 'image/png'))
      }
      try {
        setStatus('Loading the open-source Swin2SR model (~20 MB, cached after first run)…')
        const pipe = await getPipe()
        setStatus('Upscaling 2× on your device…')
        const { RawImage } = await import('@huggingface/transformers')
        const input = await RawImage.fromBlob(inputBlob)
        const out = await pipe(input)
        const blob = await rawToBlob(out)
        if (!blob) throw new Error('Could not encode result')
        const url = URL.createObjectURL(blob)
        setResult(url)
        setStatus('')
        saveBlob(blob, `upscaled-${f.name.replace(/\.[^.]+$/, '')}.png`)
      } catch (modelErr: any) {
        console.log('SR model unavailable, using local resize fallback', modelErr)
        setNote('The neural model could not load on this device — used a high-quality local 2× resize instead.')
        const blob = await highQualityResize2x(bmp)
        const url = URL.createObjectURL(blob)
        setResult(url)
        setStatus('')
        saveBlob(blob, `upscaled-${f.name.replace(/\.[^.]+$/, '')}.png`)
      }
    } catch (e: any) {
      setError('Upscale failed: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={upscale} accept="image/*" multiple={false} label="Drop an image to upscale 2×" />
      {busy && <Progress label={status} />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {note && !error && <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">{note}</p>}
      {file && result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="border p-2"><p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Before</p><img src={previewUrl} className="w-full" alt="" /></div>
          <div className="border p-2"><p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">After (2×)</p><img src={result} className="w-full" alt="" /></div>
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Runs fully in your browser with the open-source Swin2SR super-resolution model — no servers, no keys, no quotas.</p>
    </div>
  )
}
