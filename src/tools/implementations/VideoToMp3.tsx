import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function VideoToMp3() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(2)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const blob = await ffmpegRun(file, ['-vn', '-acodec', 'libmp3lame', '-q:a', String(quality)], 'out.mp3', 'audio/mpeg')
      saveBlob(blob, `${file.name.replace(/\.[^.]+$/, '')}.mp3`)
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to extract its audio as MP3" />
      <label className="block text-sm font-semibold">Quality (V{quality} — 0 best · 9 smallest):<input type="range" min={0} max={9} value={quality} onChange={e => setQuality(parseInt(e.target.value))} className="w-full mt-2" /></label>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Extracting…' : 'Extract MP3 & download'}</button>
      {busy && <Progress label="Extracting audio…" />}
    </div>
  )
}
