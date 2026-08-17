import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { getFFmpeg } from '../../lib/ffmpeg'
import { saveBlob } from '../../lib/download'

type Sub = { from: number, to: number, text: string }

function parseSrt(srt: string): Sub[] {
  const blocks = srt.trim().split(/\n\s*\n/)
  const subs: Sub[] = []
  const timeRe = /(\d{1,2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2}),(\d{3})/
  for (const b of blocks) {
    const m = b.match(timeRe)
    if (!m) continue
    const toSec = (h: string, mi: string, s: string, ms: string) => +h * 3600 + +mi * 60 + +s + +ms / 1000
    const text = b.split('\n').slice(2).join(' ').trim()
    if (text) subs.push({ from: toSec(m[1], m[2], m[3], m[4]), to: toSec(m[5], m[6], m[7], m[8]), text })
  }
  return subs
}

export default function BurnSubtitles() {
  const [video, setVideo] = useState<File | null>(null)
  const [srtFile, setSrtFile] = useState<File | null>(null)
  const [srtText, setSrtText] = useState('')
  const [size, setSize] = useState(36)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const esc = (t: string) => t
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/%/g, '\\%')

  const run = async () => {
    if (!video) return
    const srt = srtFile ? await srtFile.text() : srtText
    const subs = parseSrt(srt)
    if (!subs.length) { setStatus('No valid subtitles found in the SRT.'); return }
    setBusy(true)
    setStatus('Burning subtitles (client-side)…')
    try {
      const ffmpeg = await getFFmpeg()
      const base = new URL(import.meta.env.BASE_URL, window.location.href).toString()
      const font = await (await fetch(`${base}fonts/DejaVuSans.ttf`)).arrayBuffer()
      await ffmpeg.writeFile('font.ttf', new Uint8Array(font))
      const ext = (video.name.match(/\.[^.]+$/) || ['.mp4'])[0]
      await ffmpeg.writeFile(`in${ext}`, new Uint8Array(await video.arrayBuffer()))
      const draws = subs.map(s => `drawtext=fontfile=font.ttf:text='${esc(s.text)}':fontsize=${size}:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h-${size + 40}:enable='between(t,${s.from.toFixed(2)},${s.to.toFixed(2)})'`)
      await ffmpeg.exec(['-i', `in${ext}`, '-vf', draws.join(','), '-c:v', 'libx264', '-preset', 'fast', '-crf', '21', '-c:a', 'aac', '-y', 'out.mp4'])
      const data = await ffmpeg.readFile('out.mp4')
      const u8 = data instanceof Uint8Array ? data : new TextEncoder().encode(data as string)
      saveBlob(new Blob([u8.slice().buffer as ArrayBuffer], { type: 'video/mp4' }), video.name.replace(/\.[^.]+$/, '') + '-subtitled.mp4')
      for (const n of ['font.ttf', `in${ext}`, 'out.mp4']) { try { await ffmpeg.deleteFile(n) } catch { /* noop */ } }
      setStatus(`Burned ${subs.length} subtitle${subs.length === 1 ? '' : 's'} — check your downloads.`)
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={fl => setVideo(fl[0])} accept="video/*" multiple={false} label="Drop a video (.mp4)" />
      <DropZone onFiles={fl => { setSrtFile(fl[0]); setSrtText('') }} accept=".srt,.vtt,text/plain" multiple={false} label="Drop a .srt subtitle file (or paste below)" />
      <textarea value={srtText} onChange={e => { setSrtText(e.target.value); setSrtFile(null) }} placeholder="…or paste SRT content here" className="w-full h-[120px] border p-3 text-sm font-mono" />
      <div className="flex items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Font size</label>
        <input type="number" value={size} onChange={e => setSize(+e.target.value)} className="border px-2 py-2 w-20" />
      </div>
      <Button variant="secondary" onClick={run} disabled={busy || !video} isLoading={busy || !video}>Burn subtitles & download</Button>
      {busy && <Progress label="Burning subtitles into video…" />}
      {status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">Subtitles are hard-baked into the video (no soft track). Videos and subtitles never leave your device.</p>
    </div>
  )
}
