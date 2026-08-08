import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function AudioNoiseRemover() {
  const [file, setFile] = useState<File | null>(null)
  const [strength, setStrength] = useState(-35)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const run = async () => {
    if (!file) return
    setBusy(true)
    setStatus('Removing noise…')
    try {
      const blob = await ffmpegRun(file, ['-af', `afftdn=nf=${strength},anlmdn=s=0.0002:p=0.5:m=15`, '-codec:a', 'libmp3lame', '-q:a', '2'], 'out.mp3', 'audio/mpeg')
      saveBlob(blob, file.name.replace(/\.[^.]+$/, '') + '-denoised.mp3')
      setStatus('Done — check your downloads.')
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop a recording with hiss, hum or background noise" />
      <div className="flex items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Strength</label>
        <input type="range" min="-60" max="-15" value={strength} onChange={e => setStrength(+e.target.value)} className="w-48" />
        <span className="font-mono text-xs">{strength} dB</span>
      </div>
      <button onClick={run} disabled={busy || !file} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Denoising…' : 'Remove noise & download'}</button>
      {status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">FFT-based noise reduction (afftdn) plus non-local denoising. Gentle settings (-30 to -40 dB) keep music intact; strong settings are for speech.</p>
    </div>
  )
}
