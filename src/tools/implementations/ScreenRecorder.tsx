import { useRef, useState } from 'react'
import { saveBlob } from '../../lib/download'

export default function ScreenRecorder() {
  const [recording, setRecording] = useState(false)
  const [url, setUrl] = useState('')
  const recRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const start = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: { frameRate: 30 }, audio: true })
      streamRef.current = stream
      chunksRef.current = []
      const rec = new MediaRecorder(stream)
      rec.ondataavailable = e => { if (e.data.size) chunksRef.current.push(e.data) }
      rec.onstop = () => {
        stream.getTracks().forEach((t: MediaStreamTrack) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setUrl(URL.createObjectURL(blob))
      }
      rec.start()
      recRef.current = rec
      setRecording(true)
      stream.getVideoTracks()[0].addEventListener('ended', () => { if (rec.state === 'recording') rec.stop(); setRecording(false) })
    } catch { /* user cancelled */ }
  }

  const stop = () => {
    recRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="border p-6 text-center">
        <p className="text-sm font-medium text-zinc-500 mb-4">
          {recording ? '● Recording… share your tab or screen' : 'Record your screen, tab, or a window. Audio is captured too.'}
        </p>
        {!recording
          ? <button onClick={start} className="px-6 h-11 bg-red-600 text-white text-sm font-semibold">Start recording</button>
          : <button onClick={stop} className="px-6 h-11 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold animate-pulse">■ Stop & save</button>}
      </div>
      {url && (
        <div className="space-y-2">
          <video src={url} controls className="w-full border rounded-lg" />
          <div className="flex gap-2">
            <button onClick={async () => saveBlob(await awaitBlob(url), `recording-${Date.now()}.webm`)} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Download</button>
            <a href={url} download="recording.webm" className="px-4 h-9 border text-sm inline-flex items-center">Save</a>
          </div>
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Output is WebM. Everything is recorded and saved on your device.</p>
    </div>
  )
}

async function awaitBlob(url: string) {
  const res = await fetch(url)
  return res.blob()
}
