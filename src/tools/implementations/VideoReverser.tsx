import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function VideoReverser() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const run = async () => {
    if (!file) return
    setBusy(true)
    setStatus('Reversing (may take a while for long clips)…')
    try {
      const blob = await ffmpegRun(file, ['-vf', 'reverse', '-af', 'areverse', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-c:a', 'aac'], 'reversed.mp4', 'video/mp4')
      saveBlob(blob, file.name.replace(/\.[^.]+$/, '') + '-reversed.mp4')
      setStatus('Done — check your downloads.')
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to play it backwards" />
      {file && <p className="text-xs text-zinc-500">{file.name} · {Math.round(file.size / 1024 / 1024)} MB — keep clips under ~30s; reversing needs the whole clip in memory.</p>}
      <button onClick={run} disabled={busy || !file} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Reversing…' : 'Reverse & download'}</button>
      {status && <p className="text-sm text-zinc-600">{status}</p>}
    </div>
  )
}
