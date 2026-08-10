import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function Mp4ToWebm() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const blob = await ffmpegRun(file, ['-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0', '-c:a', 'libopus'], 'out.webm', 'video/webm')
      saveBlob(blob, 'converted.webm')
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/mp4,.mp4" multiple={false} label="Drop an MP4 to convert to WebM (VP9)" />
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Converting…' : 'Convert & download'}</button>
      <p className="text-[11px] font-medium text-zinc-500">Smaller files with better streaming support — great for web embeds. Conversion can take a minute.</p>
    </div>
  )
}
