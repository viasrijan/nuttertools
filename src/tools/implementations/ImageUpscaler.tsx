import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { saveBlob } from '../../lib/download'

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

export default function ImageUpscaler() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const upscale = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setFile(f); setBusy(true); setError(''); setResult('')
    try {
      setStatus('Downloading Swin2SR model (~20 MB on first run)…')
      const pipe = await getPipe()
      setStatus('Upscaling 2×…')
      const { RawImage } = await import('@huggingface/transformers')
      const input = await RawImage.fromBlob(f)
      const out = await pipe(input)
      const blob = await rawToBlob(out)
      if (!blob) throw new Error('Could not encode result')
      setResult(URL.createObjectURL(blob))
      setStatus('')
      saveBlob(blob, `upscaled-${f.name.replace(/\.[^.]+$/, '')}.png`)
    } catch (e: any) {
      setError('AI upscale failed: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={upscale} accept="image/*" multiple={false} label="Drop an image to upscale 2×" />
      {busy && <Progress label={status} />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {file && result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="border p-2"><p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Before</p><img src={file ? URL.createObjectURL(file) : ''} className="w-full" /></div>
          <div className="border p-2"><p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">After (2×)</p><img src={result} className="w-full" /></div>
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Uses a real super-resolution neural network (Swin2SR) locally — the PNG has already been downloaded.</p>
    </div>
  )
}
