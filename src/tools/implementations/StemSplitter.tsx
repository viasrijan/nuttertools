import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'

import * as ort from 'onnxruntime-web'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { encodeWav } from '../../lib/wav'
import { saveBlob } from '../../lib/download'

const MODEL_URL = 'https://huggingface.co/StemSplitio/htdemucs-ft-vocals-onnx/resolve/main/htdemucs_ft_vocals_fp16weights.onnx'
const N_SAMPLES = 343980
const OVERLAP = N_SAMPLES / 4
const STRIDE = N_SAMPLES - OVERLAP
const STEMS = [
  { name: 'Drums', color: '#f43f5e' },
  { name: 'Bass', color: '#f59e0b' },
  { name: 'Other', color: '#10b981' },
  { name: 'Vocals', color: '#8b5cf6' },
]

async function toStereo44100(file: File): Promise<{ left: Float32Array, right: Float32Array, sampleRate: number }> {
  const ctx = new AudioContext({ sampleRate: 44100 })
  const buf = await ctx.decodeAudioData(await file.arrayBuffer())
  const target = 44100
  const len = Math.ceil(buf.duration * target)
  const off = new OfflineAudioContext(2, len, target)
  const src = off.createBufferSource()
  src.buffer = buf
  src.connect(off.destination)
  src.start()
  const rendered = await off.startRendering()
  await ctx.close()
  return { left: rendered.getChannelData(0), right: rendered.getChannelData(1), sampleRate: target }
}

export default function StemSplitter() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState('')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{ name: string, url: string, size: string }[]>([])
  const sessionRef = useRef<ort.InferenceSession | null>(null)
  const doneRef = useRef(false)

  useEffect(() => () => { doneRef.current = true }, [])

  const run = async () => {
    if (!file) return
    setBusy(true)
    setResults([])
    setProgress(0)
    doneRef.current = false
    try {
      setStage('Decoding audio…')
      const { left, right, sampleRate } = await toStereo44100(file)
      const total = left.length
      const numChunks = Math.max(1, Math.ceil((total - N_SAMPLES) / STRIDE) + 1)

      setStage('Loading AI model (165 MB, one time)…')
      if (!sessionRef.current) {
        const base = new URL(import.meta.env.BASE_URL, window.location.href).toString()
        ort.env.wasm.wasmPaths = base + 'ort/'
        ort.env.wasm.numThreads = 1
        sessionRef.current = await ort.InferenceSession.create(MODEL_URL, { executionProviders: ['wasm'] })
      }
      const session = sessionRef.current

      const accs = [0, 1, 2, 3].map(() => new Float32Array(total))
      const weights = new Float32Array(total)
      const windowFn = new Float32Array(N_SAMPLES)
      for (let i = 0; i < N_SAMPLES; i++) {
        windowFn[i] = Math.min(Math.min(i, N_SAMPLES - 1 - i) / (OVERLAP - 1), 1)
      }

      for (let c = 0; c < numChunks; c++) {
        if (doneRef.current) { setBusy(false); return }
        const start = c * STRIDE
        const input = new Float32Array(2 * N_SAMPLES)
        for (let i = 0; i < N_SAMPLES; i++) {
          const s = start + i
          if (s < total) { input[i] = left[s]; input[N_SAMPLES + i] = right[s] }
        }
        const tensor = new ort.Tensor('float32', input, [1, 2, N_SAMPLES])
        const out = await session.run({ mix: tensor })
        const stemsData = (out.stems as ort.Tensor).data as Float32Array
        for (let s = 0; s < 4; s++) {
          const acc = accs[s]
          for (let i = 0; i < N_SAMPLES; i++) {
            const idx = start + i
            if (idx < total) {
              const w = windowFn[i]
              const ch0 = stemsData[(s * 2 + 0) * N_SAMPLES + i]
              const ch1 = stemsData[(s * 2 + 1) * N_SAMPLES + i]
              acc[idx] += (ch0 + ch1) / 2 * w
              if (s === 0) weights[idx] += w
            }
          }
        }
        setProgress(Math.round((c + 1) / numChunks * 100))
        setStage(`Separating ${c + 1}/${numChunks} chunks…`)
      }

      setStage('Encoding WAV files…')
      const urls: { name: string, url: string, size: string }[] = []
      for (let s = 0; s < 4; s++) {
        const acc = accs[s]
        const mono = new Float32Array(total)
        for (let i = 0; i < total; i++) mono[i] = weights[i] > 0 ? acc[i] / weights[i] : 0
        const blob = encodeWav([mono, mono], sampleRate)
        urls.push({ name: STEMS[s].name, url: URL.createObjectURL(blob), size: (blob.size / 1024 / 1024).toFixed(1) + ' MB' })
      }
      setResults(urls)
      setStage('Done')
    } catch (e: any) { setStage('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop a song — vocals, drums, bass and everything else get separated" />
      {file && <p className="text-xs text-zinc-500">{file.name} — first run downloads the model once (165 MB), then everything is processed on your device.</p>}
      <Button variant="secondary" onClick={run} disabled={busy || !file} isLoading={busy || !file}>Separate stems</Button>
      {busy && <Progress label={stage} percent={progress} />}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={r.name} className="border p-3 flex flex-wrap items-center gap-3">
              <span className="w-2 h-8 " style={{ background: STEMS[i].color }} />
              <div className="flex-1 min-w-[120px]">
                <div className="text-sm font-bold">{r.name}</div>
                <div className="text-[11px] text-zinc-500">{r.size}</div>
              </div>
              <audio controls src={r.url} className="h-9 flex-1 min-w-[220px]" />
              <button onClick={() => { const a = document.createElement('a'); a.href = r.url; a.download = `${file?.name.replace(/\.[^.]+$/, '')}-${r.name.toLowerCase()}.wav`; a.click() }} className="px-4 h-9 text-xs font-bold text-white bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(14,165,233,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95">Download</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] text-zinc-500">Powered by the open-source Demucs (htdemucs-ft) model running fully in your browser — nothing is uploaded. Shorten long tracks with the Audio Trimmer for faster results.</p>
    </div>
  )
}
