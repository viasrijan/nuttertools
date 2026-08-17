import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { ffmpegRun } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

export default function AudioReverser() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const run = async () => {
    if (!file) return
    setBusy(true)
    setStatus('Reversing…')
    try {
      const blob = await ffmpegRun(file, ['-af', 'areverse', '-codec:a', 'libmp3lame', '-q:a', '2'], 'out.mp3', 'audio/mpeg')
      saveBlob(blob, file.name.replace(/\.[^.]+$/, '') + '-reversed.mp3')
      setStatus('Done — check your downloads.')
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setFile(fl[0])} accept="audio/*" multiple={false} label="Drop an audio file to play it backwards" />
      <Button variant="secondary" onClick={run} disabled={busy || !file} isLoading={busy || !file}>Reverse & download</Button>
      {busy && <Progress label="Reversing audio…" />}
      {status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">Fun for Easter eggs, hidden messages and creative remixes. Fully offline.</p>
    </div>
  )
}
