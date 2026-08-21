import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [crf, setCrf] = useState(28)
  const [busy, setBusy] = useState(false)
  const [pct, setPct] = useState<number | null>(null)
  const [keptOriginal, setKeptOriginal] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true); setPct(null); setKeptOriginal(false)
    try {
      const t0 = performance.now()
      const blob = await ffmpegRun(file, ['-c:v', 'libx264', '-crf', String(crf), '-preset', 'medium', '-c:a', 'aac', '-movflags', '+faststart'], 'compressed.mp4', 'video/mp4')
      // Never hand back a file bigger than the original — keep the source instead
      if (blob.size >= file.size) {
        setKeptOriginal(true)
        setPct(0)
        saveBlob(file, file.name)
      } else {
        setPct(Math.round((1 - blob.size / file.size) * 100))
        saveBlob(blob, `compressed-${crf}.mp4`)
      }
      void t0
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFile(fl[0])} accept="video/*" multiple={false} label="Drop a video to compress" />
      {file && <p className="text-xs font-medium text-zinc-500">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</p>}
      <label className="block text-sm font-semibold">Quality (CRF {crf} — higher = smaller):<input type="range" min={18} max={40} value={crf} onChange={e => setCrf(parseInt(e.target.value))} className="w-full mt-2" /></label>
      <Button variant="secondary" onClick={run} disabled={busy} isLoading={busy}>Compress & download</Button>
      {busy && <Progress label="Compressing video…" />}
      {pct !== null && (keptOriginal
        ? <p className="text-sm">Couldn&apos;t make it smaller at this setting — the original file was kept.</p>
        : <p className="text-sm">Saved <b className="text-emerald-600">{pct}%</b></p>)}
      <p className="text-[11px] font-medium text-zinc-500">First run downloads the ffmpeg engine (~32 MB) — afterwards it works offline.</p>
    </div>
  )
}
