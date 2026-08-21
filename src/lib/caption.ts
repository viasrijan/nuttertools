// Open-source BLIP image captioning — runs fully in the browser via transformers.js.
// No servers, no API keys, no quotas.
let pipePromise: Promise<any> | null = null

function getPipe() {
  if (!pipePromise) {
    pipePromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers')
      env.allowLocalModels = false
      return pipeline('image-to-text', 'Xenova/blip-image-captioning-base', { device: 'wasm', dtype: 'q8' })
    })()
    pipePromise.catch(() => { pipePromise = null })
  }
  return pipePromise
}

export async function captionImage(file: File, onStatus?: (s: string) => void): Promise<string> {
  onStatus?.('Loading the open-source captioning model (~50 MB, cached after first run)…')
  const pipe = await getPipe()
  onStatus?.('Describing the image on your device…')
  const { RawImage } = await import('@huggingface/transformers')
  const img = await RawImage.fromBlob(file)
  const out = await pipe(img, { max_new_tokens: 40 })
  const text = Array.isArray(out) ? out[0]?.generated_text : out?.generated_text
  return String(text || '').trim()
}
