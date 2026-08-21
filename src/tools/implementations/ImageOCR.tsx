import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'

export default function ImageOCR() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const onFiles = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setLoading(true)
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('eng')
      try {
        const ret = await worker.recognize(file)
        setText(String(ret?.data?.text || '').trim())
      } finally {
        await worker.terminate()
      }
    } catch (e: any) {
      setText('Error: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <DropZone onFiles={onFiles} accept="image/*" multiple={false} label="Drop image to extract text" />
      {loading && <Progress label="Reading text with on-device AI OCR… first run downloads the model (~2 MB)" />}
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Extracted text will appear here..." className="w-full h-[260px] border p-3 text-sm" />
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(text)}>Copy Text</Button>
        {text && !loading && <span className="text-[11px] text-zinc-500">Local OCR (Tesseract.js) — runs in your browser, no quotas</span>}
      </div>
    </div>
  )
}
