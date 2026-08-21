import { useState } from 'react'
import CopyButton from '../../components/ui/CopyButton'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { captionImage } from '../../lib/caption'

export default function ImageCaptioner() {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')

  const captionImg = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setBusy(true); setError(''); setCaption('')
    try {
      const text = await captionImage(f, setStatus)
      if (!text) throw new Error('empty caption')
      setStatus('')
      setCaption(text)
    } catch (e: any) {
      setError('Captioning failed: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={captionImg} accept="image/*" multiple={false} label="Drop an image to describe" />
      {busy && <Progress label={status} />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {caption && (
        <div className="space-y-5">
          <p className="text-lg font-medium border p-3">{caption}</p>
          <CopyButton value={caption} />
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Runs fully in your browser with the open-source BLIP model — no servers, no quotas.</p>
    </div>
  )
}