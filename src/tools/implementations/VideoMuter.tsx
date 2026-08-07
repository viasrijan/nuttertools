import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

function ext(name: string) { return (name.match(/\.[^.]+$/) || ['.mp4'])[0] }
const MIMES: Record<string, string> = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.mkv': 'video/x-matroska' }

export default function VideoMuter() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const e = ext(file.name)
      const blob = await ffmpegRun(file, ['-c:v', 'copy', '-an'], `muted${e}`, MIMES[e] || 'video/mp4')
      saveBlob(blob, `muted-${file.name}`)
    } catch (err: any) {
      // re-encode fallback if stream copy is incompatible
      try {
        const e = ext(file.name)
        const blob = await ffmpegRun(file, ['-c:v', 'libx264', '-an', '-movflags', '+faststart'], `muted${e}`, MIMES[e] || 'video/mp4')
        saveBlob(blob, `muted-${file.name}`)
      } catch (e: any) { alert('Error: ' + e.message) }
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to remove its audio" />
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Muting…' : 'Mute & download'}</button>
    </div>
  )
}
