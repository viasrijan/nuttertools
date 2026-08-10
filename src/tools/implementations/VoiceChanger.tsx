import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

const VOICES: Record<string, string> = {
  chipmunk: 'asetrate=44100*1.5,aresample=44100,atempo=0.6667',
  deep: 'asetrate=44100*0.6,aresample=44100,atempo=1.6667',
  kid: 'asetrate=44100*1.35,aresample=44100,atempo=0.7407',
  alien: 'vibrato=f=8:d=0.6,asetrate=44100*1.2,aresample=44100,atempo=0.8333',
  robot: 'tremolo=f=6:d=0.4,asetrate=44100*0.9,aresample=44100,atempo=1.1111',
  echo: 'aecho=0.8:0.9:500|1000:0.3|0.15',
  female: 'asetrate=44100*1.2,aresample=44100,atempo=0.8333',
  male: 'asetrate=44100*0.8,aresample=44100,atempo=1.25',
}

export default function VoiceChanger() {
  const [file, setFile] = useState<File | null>(null)
  const [voice, setVoice] = useState('chipmunk')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const run = async () => {
    if (!file) return
    setBusy(true)
    setStatus('Changing voice…')
    try {
      const blob = await ffmpegRun(file, ['-af', VOICES[voice], '-codec:a', 'libmp3lame', '-q:a', '2'], 'out.mp3', 'audio/mpeg')
      saveBlob(blob, file.name.replace(/\.[^.]+$/, '') + '-' + voice + '.mp3')
      setStatus('Done — check your downloads.')
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop a voice recording to disguise" />
      <div className="flex flex-wrap gap-2">
        {Object.keys(VOICES).map(v => (
          <button key={v} onClick={() => setVoice(v)} className={`px-4 h-9 text-sm border capitalize ${voice === v ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{v}</button>
        ))}
      </div>
      <button onClick={run} disabled={busy || !file} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Processing…' : 'Change voice & download'}</button>
      {status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">Pitch and formant tricks applied with FFmpeg — great for videos, podcasts and prank calls. All offline.</p>
    </div>
  )
}
