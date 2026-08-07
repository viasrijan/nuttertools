import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

const FORMATS: Record<string, { args: string[], mime: string }> = {
  mp3: { args: ['-codec:a', 'libmp3lame', '-q:a', '2'], mime: 'audio/mpeg' },
  wav: { args: ['-codec:a', 'pcm_s16le'], mime: 'audio/wav' },
  ogg: { args: ['-codec:a', 'libvorbis', '-q:a', '4'], mime: 'audio/ogg' },
  m4a: { args: ['-codec:a', 'aac', '-b:a', '192k'], mime: 'audio/mp4' },
  flac: { args: ['-codec:a', 'flac'], mime: 'audio/flac' },
}

export default function AudioConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [fmt, setFmt] = useState('mp3')
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const f = FORMATS[fmt]
      const blob = await ffmpegRun(file, f.args, `out.${fmt}`, f.mime)
      saveBlob(blob, `${file.name.replace(/\.[^.]+$/, '')}.${fmt}`)
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop an audio file to convert" />
      <div className="flex flex-wrap gap-2">
        {Object.keys(FORMATS).map(k => <button key={k} onClick={() => setFmt(k)} className={`px-4 h-9 text-sm uppercase border ${fmt === k ? 'bg-zinc-900 text-white' : ''}`}>{k}</button>)}
      </div>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Converting…' : 'Convert & download'}</button>
    </div>
  )
}
