import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function SpeedPitch() {
  const [file, setFile] = useState<File | null>(null)
  const [speed, setSpeed] = useState(1.0)
  const [pitch, setPitch] = useState(0)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const run = async () => {
    if (!file) return
    setBusy(true)
    setStatus('Processing…')
    try {
      const filters: string[] = []
      if (speed !== 1) filters.push(`atempo=${speed.toFixed(3)}`)
      if (pitch !== 0) {
        const f = Math.pow(2, pitch / 12)
        filters.push(`asetrate=44100*${f.toFixed(4)},aresample=44100,atempo=${(1 / f).toFixed(4)}`)
      }
      const blob = await ffmpegRun(file, ['-af', filters.join(','), '-codec:a', 'libmp3lame', '-q:a', '2'], 'out.mp3', 'audio/mpeg')
      saveBlob(blob, file.name.replace(/\.[^.]+$/, '') + `-${speed.toFixed(2)}x-${pitch > 0 ? '+' : ''}${pitch}st.mp3`)
      setStatus('Done — check your downloads.')
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop an audio file" />
      <div className="space-y-3 text-sm">
        <div>
          <div className="flex justify-between mb-1"><label className="font-semibold text-zinc-900 dark:text-white">Speed</label><span className="font-mono text-xs">{speed.toFixed(2)}×</span></div>
          <input type="range" min="0.25" max="2" step="0.01" value={speed} onChange={e => setSpeed(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className="font-semibold text-zinc-900 dark:text-white">Pitch shift</label><span className="font-mono text-xs">{pitch > 0 ? '+' : ''}{pitch} semitones</span></div>
          <input type="range" min="-12" max="12" step="1" value={pitch} onChange={e => setPitch(+e.target.value)} className="w-full" />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {[['Original', 1, 0], ['1.25×', 1.25, 0], ['1.5×', 1.5, 0], ['2×', 2, 0], ['+1 st', 1, 1], ['+4 st', 1, 4], ['-1 st', 1, -1], ['-4 st', 1, -4]].map(([l, s, p]) => (
            <button key={String(l)} onClick={() => { setSpeed(s as number); setPitch(p as number) }} className="px-3 h-9 text-xs border">{l}</button>
          ))}
        </div>
      </div>
      <Button variant="secondary" onClick={run} disabled={busy || !file} isLoading={busy || !file}>Process & download</Button>
      {busy && <Progress label="Adjusting speed and pitch…" />}
      {status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">Speed keeps pitch intact; pitch keeps speed intact. Great for learning languages, transcribing or remixing.</p>
    </div>
  )
}
