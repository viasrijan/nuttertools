import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function VideoToGif() {
  const [file, setFile] = useState<File | null>(null)
  const [fps, setFps] = useState(15)
  const [width, setWidth] = useState(480)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const blob = await ffmpegRun(file, ['-vf', `fps=${fps},scale=${width}:-1:flags=lanczos`, '-loop', '0', '-y'], 'out.gif', 'image/gif')
      saveBlob(blob, `${file.name.replace(/\.[^.]+$/, '')}.gif`)
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to convert to GIF" />
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm font-semibold">FPS ({fps})<input type="range" min={5} max={30} value={fps} onChange={e => setFps(parseInt(e.target.value))} className="w-full mt-2" /></label>
        <label className="text-sm font-semibold">Width ({width}px)<input type="range" min={160} max={960} step={16} value={width} onChange={e => setWidth(parseInt(e.target.value))} className="w-full mt-2" /></label>
      </div>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Converting…' : 'Convert & download'}</button>
      <p className="text-[11px] font-medium text-zinc-500">Tip: lower FPS and width produce much smaller GIFs.</p>
    </div>
  )
}
