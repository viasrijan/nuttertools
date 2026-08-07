import { useState } from 'react'
import DropZone from '../../components/DropZone'

let pipePromise: Promise<any> | null = null
function getPipe() {
  if (!pipePromise) {
    pipePromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers')
      env.allowLocalModels = false
      return pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning')
    })()
  }
  return pipePromise
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
      setStatus('Downloading caption model (~30 MB on first run)…')
      const pipe = await getPipe()
      setStatus('Analyzing image…')
      const { RawImage } = await import('@huggingface/transformers')
      const out: any = await pipe(await RawImage.fromBlob(f))
      setStatus('')
      setCaption((out?.[0]?.generated_text ?? '').replace(/^\s+/, ''))
    } catch (e: any) {
      setError('Captioning failed: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={captionImg} accept="image/*" multiple={false} label="Drop an image to describe" />
      {busy && <p className="text-sm animate-pulse">{status}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {caption && (
        <div className="space-y-3">
          <p className="text-lg font-medium border p-3">{caption}</p>
          <button onClick={() => navigator.clipboard.writeText(caption)} className="px-4 h-9 bg-zinc-900 text-white text-sm">Copy</button>
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Runs ViT-GPT2 image captioning entirely on-device.</p>
    </div>
  )
}
