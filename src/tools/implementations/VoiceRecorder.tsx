import { useRef, useState } from 'react'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState('')
  const [converting, setConverting] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const recRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const toggle = async () => {
    if (recording) {
      recRef.current?.stop()
      if (timerRef.current) clearInterval(timerRef.current)
      setRecording(false)
      return
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const rec = new MediaRecorder(stream)
    recRef.current = rec
    chunksRef.current = []
    rec.ondataavailable = e => chunksRef.current.push(e.data)
    rec.onstop = () => {
      const b = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
      setBlob(b)
      setUrl(URL.createObjectURL(b))
      stream.getTracks().forEach(t => t.stop())
    }
    rec.start()
    setRecording(true)
    setBlob(null)
    const t0 = Date.now()
    timerRef.current = window.setInterval(() => setSeconds(Math.floor((Date.now() - t0) / 1000)), 250)
  }

  const toMp3 = async () => {
    if (!blob) return
    setConverting(true)
    try {
      const file = new File([blob], 'recording.webm', { type: blob.type })
      const mp3 = await ffmpegRun(file, ['-codec:a', 'libmp3lame', '-q:a', '2'], 'out.mp3', 'audio/mpeg')
      saveBlob(mp3, 'recording.mp3')
    } catch (e: any) { alert('MP3 conversion failed: ' + e.message) }
    setConverting(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <button onClick={toggle} className={`px-6 h-12 text-sm rounded-full ${recording ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-900 text-white'}`}>
        {recording ? `● Recording ${seconds}s — click to stop` : 'Start recording'}
      </button>
      {url && (
        <div className="space-y-3">
          <audio controls src={url} className="w-full" />
          <div className="flex gap-2">
            <button onClick={() => blob && saveBlob(blob, 'recording.webm')} className="px-4 h-9 border text-sm">Download WebM</button>
            <button onClick={toMp3} disabled={converting} className="px-4 h-9 bg-zinc-900 text-white text-sm">{converting ? 'Converting…' : 'Download MP3'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
