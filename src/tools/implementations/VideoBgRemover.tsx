import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { getFFmpeg } from '../../lib/ffmpeg'
import { removeBackground } from '@imgly/background-removal'
import { saveBlob } from '../../lib/download'

export default function VideoBgRemover() {
  const [video, setVideo] = useState<File | null>(null)
  const [fps, setFps] = useState(10)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const run = async () => {
    if (!video) return
    setBusy(true)
    try {
      const ffmpeg = await getFFmpeg()
      const ext = (video.name.match(/\.[^.]+$/) || ['.mp4'])[0]
      const inName = `in${ext}`
      await ffmpeg.writeFile(inName, new Uint8Array(await video.arrayBuffer()))
      setStatus('Extracting frames…')
      await ffmpeg.exec(['-i', inName, '-vf', `fps=${fps}`, 'frame-%04d.png', '-y'])
      let list: string[] = []
      for (let i = 1; i < 10000; i++) {
        const name = `frame-${String(i).padStart(4, '0')}.png`
        try {
          await ffmpeg.readFile(name)
          list.push(name)
        } catch { break }
      }
      if (!list.length) throw new Error('No frames extracted')
      setStatus(`Removing background from ${list.length} frames — this is the slow step…`)
      for (let i = 0; i < list.length; i++) {
        const raw = await ffmpeg.readFile(list[i])
        const u8 = raw instanceof Uint8Array ? raw : new TextEncoder().encode(raw as string)
        const blob = new Blob([u8.slice().buffer as ArrayBuffer], { type: 'image/png' })
        const out = await removeBackground(blob)
        await ffmpeg.writeFile(list[i], new Uint8Array(await out.arrayBuffer()))
        if ((i + 1) % 5 === 0) setStatus(`Removed background on ${i + 1}/${list.length} frames…`)
      }
      setStatus('Encoding transparent WebM…')
      await ffmpeg.exec(['-framerate', String(fps), '-i', 'frame-%04d.png', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-row-mt', '1', '-crf', '30', 'out.webm', '-y'])
      const data = await ffmpeg.readFile('out.webm')
      const u8 = data instanceof Uint8Array ? data : new TextEncoder().encode(data as string)
      saveBlob(new Blob([u8.slice().buffer as ArrayBuffer], { type: 'video/webm' }), video.name.replace(/\.[^.]+$/, '') + '-bg-removed.webm')
      setStatus(`Done — ${list.length} frames processed. WebM (transparent) saved.`)
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setVideo(fl[0])} accept="video/*" multiple={false} label="Drop a short video — background is removed per frame (AI, on-device)" />
      {video && <p className="text-xs text-zinc-500">{video.name}</p>}
      <div className="flex items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Frame rate</label>
        {[5, 10, 15].map(f => (
          <button key={f} onClick={() => setFps(f)} className={`px-3 h-9 text-xs border ${fps === f ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{f} fps</button>
        ))}
      </div>
      <button onClick={run} disabled={busy || !video} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Processing…' : 'Remove background & download'}</button>
      {busy && <Progress label={status} />}
      {!busy && status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">Best for short clips (&lt;8s): {fps} fps → ~{fps * 8} frames, a few minutes per second of video. Output is a transparent WebM — use an editor to place it over any background. First run downloads the AI model once (~40 MB).</p>
    </div>
  )
}
