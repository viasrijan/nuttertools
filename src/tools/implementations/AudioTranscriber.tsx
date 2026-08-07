import { useState } from 'react'
import DropZone from '../../components/DropZone'

function resample(data: Float32Array, fromRate: number, toRate: number) {
  if (fromRate === toRate) return data
  const ratio = toRate / fromRate
  const out = new Float32Array(Math.round(data.length * ratio))
  for (let i = 0; i < out.length; i++) out[i] = data[Math.floor(i / ratio)]
  return out
}

let pipelinePromise: Promise<any> | null = null
function getPipeline() {
  if (!pipelinePromise) {
    pipelinePromise = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers')
      env.allowLocalModels = false
      const t = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny')
      return t
    })()
  }
  return pipelinePromise
}

export default function AudioTranscriber() {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const transcribe = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true); setError(''); setResult('')
    try {
      setStatus('Downloading Whisper model (~40 MB on first run)…')
      const t = await getPipeline()
      setStatus('Decoding audio…')
      const ac = new AudioContext()
      const buf = await ac.decodeAudioData(await file.arrayBuffer())
      const samples = resample(buf.getChannelData(0), buf.sampleRate, 16000)
      ac.close()
      setStatus('Transcribing…')
      const out: any = await t(samples, { language: 'english', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 })
      const text = typeof out === 'string' ? out : out?.text ?? out?.[0]?.text ?? ''
      setStatus('')
      setResult(text || '(no speech detected)')
    } catch (e: any) {
      setError('Transcription failed: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={transcribe} accept="audio/*" multiple={false} label="Drop an audio file to transcribe" />
      {busy && <p className="text-sm animate-pulse">{status}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && (
        <div className="space-y-3">
          <p className="text-sm whitespace-pre-wrap border p-3">{result}</p>
          <button onClick={() => navigator.clipboard.writeText(result)} className="px-4 h-9 bg-zinc-900 text-white text-sm">Copy</button>
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Runs Whisper (tiny) fully in your browser — audio never leaves your device. Needs internet on first run to download the model.</p>
    </div>
  )
}
