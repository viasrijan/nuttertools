import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

const PRESETS: Record<string, { args: string[] }> = {
  voice: { args: ['-af', 'loudnorm=I=-16:TP=-1.5:LRA=7,highpass=f=80,lowpass=f=12000', '-codec:a', 'libmp3lame', '-q:a', '2'] },
  podcast: { args: ['-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,highpass=f=60,compand=0.02:0.05:-50/-30:-5/-5:2:1:0.05:0.0001', '-codec:a', 'libmp3lame', '-q:a', '2'] },
  music: { args: ['-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,highpass=f=30,lowpass=f=18000', '-codec:a', 'libmp3lame', '-q:a', '2'] },
}

export default function AudioEnhancer() {
  const [file, setFile] = useState<File | null>(null)
  const [preset, setPreset] = useState<keyof typeof PRESETS>('voice')
  const [loud, setLoud] = useState(-16)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const run = async () => {
    if (!file) return
    setBusy(true)
    setStatus('Enhancing…')
    try {
      const p = PRESETS[preset]
      const base = p.args.slice(0, 2)
      const custom = ['loudnorm=I=' + loud + ':TP=-1.5:LRA=7', 'highpass=f=80', 'lowpass=f=12000'].join(',')
      const args = preset === 'custom' ? ['-af', custom, '-codec:a', 'libmp3lame', '-q:a', '2'] : [...base, '-codec:a', 'libmp3lame', '-q:a', '2']
      const blob = await ffmpegRun(file, args, 'out.mp3', 'audio/mpeg')
      saveBlob(blob, file.name.replace(/\.[^.]+$/, '') + '-enhanced.mp3')
      setStatus('Done — check your downloads.')
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop an audio file to clean up and boost" />
      <div className="flex flex-wrap gap-2 text-sm">
        {Object.entries(PRESETS).map(([k, v]) => (
          <button key={k} onClick={() => setPreset(k as keyof typeof PRESETS)} className={`px-4 h-9 border capitalize ${preset === k ? 'bg-zinc-900 text-white' : ''}`}>{k}</button>
        ))}
        <button onClick={() => setPreset('custom')} className={`px-4 h-9 border ${preset === 'custom' ? 'bg-zinc-900 text-white' : ''}`}>Custom</button>
      </div>
      {preset === 'custom' && (
        <div className="flex items-center gap-2 text-sm">
          <label className="font-semibold text-zinc-900 dark:text-white">Target loudness (LUFS)</label>
          <input type="range" min="-30" max="-8" value={loud} onChange={e => setLoud(+e.target.value)} className="w-40" />
          <span className="font-mono text-xs">{loud} LUFS</span>
        </div>
      )}
      <button onClick={run} disabled={busy || !file} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Enhancing…' : 'Enhance & download'}</button>
      {status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">Normalizes loudness, removes rumble and hiss. All processing happens in your browser via FFmpeg WASM.</p>
    </div>
  )
}
