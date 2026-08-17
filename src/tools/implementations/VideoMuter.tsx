import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
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
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to remove its audio" />
      <Button variant="secondary" onClick={run} disabled={busy} isLoading={busy}>Mute & download</Button>
      {busy && <Progress label="Removing audio…" />}
    </div>
  )
}
