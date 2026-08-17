import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function GifToVideo() {
  const [file, setFile] = useState<File | null>(null)
  const [fps, setFps] = useState(15)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const blob = await ffmpegRun(file, ['-vf', `fps=${fps}`, '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-movflags', '+faststart'], 'out.mp4', 'video/mp4')
      saveBlob(blob, `${file.name.replace(/\.[^.]+$/, '')}.mp4`)
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFile(fl[0])} accept="image/gif,.gif" multiple={false} label="Drop a GIF to convert to MP4" />
      <label className="block text-sm font-semibold">FPS ({fps})<input type="range" min={5} max={30} value={fps} onChange={e => setFps(parseInt(e.target.value))} className="w-full mt-2" /></label>
      <Button variant="secondary" onClick={run} disabled={busy} isLoading={busy}>Convert & download</Button>
      {busy && <Progress label="Converting GIF to video…" />}
      <p className="text-[11px] font-medium text-zinc-500">MP4 is a fraction of the GIF size and plays on every device.</p>
    </div>
  )
}
