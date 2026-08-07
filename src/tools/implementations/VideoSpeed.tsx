import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

function ext(name: string) { return (name.match(/\.[^.]+$/) || ['.mp4'])[0] }
const MIMES: Record<string, string> = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime' }

export default function VideoSpeed() {
  const [file, setFile] = useState<File | null>(null)
  const [speed, setSpeed] = useState(2)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const e = ext(file.name)
      const pts = (1 / speed).toFixed(3)
      const atempo = speed >= 0.5 && speed <= 100 ? String(speed) : null
      const args = atempo
        ? ['-filter:v', `setpts=${pts}*PTS`, '-af', `atempo=${atempo}`, '-c:v', 'libx264', '-movflags', '+faststart']
        : ['-filter:v', `setpts=${pts}*PTS`, '-an', '-c:v', 'libx264', '-movflags', '+faststart']
      const blob = await ffmpegRun(file, args, `speed${e}`, MIMES[e] || 'video/mp4')
      saveBlob(blob, `speed-${speed}x-${file.name}`)
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to change its speed" />
      <div className="flex items-center gap-3">
        <input type="range" min={0.25} max={4} step={0.25} value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} className="flex-1" />
        <span className="text-sm font-semibold w-16 text-center">{speed}×</span>
      </div>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Processing…' : 'Change speed & download'}</button>
    </div>
  )
}
