import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

function ext(name: string) { return (name.match(/\.[^.]+$/) || ['.mp4'])[0] }
const MIMES: Record<string, string> = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime' }

export default function VideoTrimmer() {
  const [file, setFile] = useState<File | null>(null)
  const [start, setStart] = useState('00:00')
  const [end, setEnd] = useState('00:30')
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const e = ext(file.name)
      const blob = await ffmpegRun(file, ['-ss', start, '-to', end, '-c', 'copy'], `trimmed${e}`, MIMES[e] || 'video/mp4')
      saveBlob(blob, `trimmed-${file.name}`)
    } catch (err: any) {
      try {
        const e = ext(file.name)
        const blob = await ffmpegRun(file, ['-ss', start, '-to', end, '-c:v', 'libx264', '-c:a', 'aac', '-movflags', '+faststart'], `trimmed${e}`, MIMES[e] || 'video/mp4')
        saveBlob(blob, `trimmed-${file.name}`)
      } catch (e: any) { alert('Error: ' + e.message) }
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to trim" />
      <div className="flex items-center gap-3">
        <label className="text-sm">From <input type="text" value={start} onChange={e => setStart(e.target.value)} className="border px-2 h-9 w-28 font-mono text-sm" placeholder="00:00" /></label>
        <label className="text-sm">To <input type="text" value={end} onChange={e => setEnd(e.target.value)} className="border px-2 h-9 w-28 font-mono text-sm" placeholder="00:30" /></label>
      </div>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Trimming…' : 'Trim & download'}</button>
      {busy && <Progress label="Trimming video…" />}
      <p className="text-[11px] font-medium text-zinc-500">Use HH:MM or MM:SS format.</p>
    </div>
  )
}
