import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

function ext(name: string) { return (name.match(/\.[^.]+$/) || ['.mp4'])[0] }
const MIMES: Record<string, string> = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime' }

export default function VideoRotator() {
  const [file, setFile] = useState<File | null>(null)
  const [angle, setAngle] = useState(90)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const e = ext(file.name)
      const blob = await ffmpegRun(file, ['-metadata:s:v', `rotate=${angle}`, '-codec', 'copy'], `rotated${e}`, MIMES[e] || 'video/mp4')
      saveBlob(blob, `rotated-${file.name}`)
    } catch (err: any) {
      try {
        const e = ext(file.name)
        const t = ((angle % 360) + 360) % 360
        const filter = t === 90 ? 'transpose=1' : t === 180 ? 'transpose=1,transpose=1' : 'transpose=2'
        const blob = await ffmpegRun(file, ['-vf', filter, '-c:a', 'copy'], `rotated${e}`, MIMES[e] || 'video/mp4')
        saveBlob(blob, `rotated-${file.name}`)
      } catch (e: any) { alert('Error: ' + e.message) }
    }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to rotate" />
      <div className="flex flex-wrap gap-2.5">
        {[90, 180, 270].map(a => <Button variant="outline" key={a} onClick={() => setAngle(a)} className={`px-4 h-9 text-sm border ${angle === a ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{a}°</Button>)}
      </div>
      <Button variant="secondary" onClick={run} disabled={busy} isLoading={busy}>Rotate & download</Button>
      {busy && <Progress label="Rotating video…" />}
    </div>
  )
}
