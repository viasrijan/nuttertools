import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
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
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop an audio file to convert" />
      <div className="flex flex-wrap gap-2.5">
        {Object.keys(FORMATS).map(k => <Button variant="outline" key={k} onClick={() => setFmt(k)} className={`px-4 h-9 text-sm uppercase  ${fmt === k ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{k}</Button>)}
      </div>
      <Button variant="secondary" onClick={run} disabled={busy} isLoading={busy}>Convert & download</Button>
      {busy && <Progress label="Converting audio…" />}
    </div>
  )
}
