import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

function ext(name: string) { return (name.match(/\.[^.]+$/) || ['.mp3'])[0] }
const MIMES: Record<string, string> = { '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.flac': 'audio/flac' }

export default function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null)
  const [start, setStart] = useState('00:00')
  const [end, setEnd] = useState('00:10')
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const e = ext(file.name)
      const blob = await ffmpegRun(file, ['-ss', start, '-to', end, '-c', 'copy'], `trimmed${e}`, MIMES[e] || 'audio/mpeg')
      saveBlob(blob, `trimmed-${file.name}`)
    } catch (err: any) {
      try {
        const e = ext(file.name)
        const blob = await ffmpegRun(file, ['-ss', start, '-to', end, '-codec:a', 'libmp3lame', '-q:a', '2'], `trimmed${e}`, MIMES[e] || 'audio/mpeg')
        saveBlob(blob, `trimmed-${file.name}`)
      } catch (e: any) { alert('Error: ' + e.message) }
    }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop audio to trim" />
      <div className="flex items-center gap-3">
        <label className="text-sm">From <input type="text" value={start} onChange={e => setStart(e.target.value)} className="border px-2 h-9 w-28 font-mono text-sm" placeholder="00:00" /></label>
        <label className="text-sm">To <input type="text" value={end} onChange={e => setEnd(e.target.value)} className="border px-2 h-9 w-28 font-mono text-sm" placeholder="00:10" /></label>
      </div>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Trimming…' : 'Trim & download'}</button>
    </div>
  )
}
