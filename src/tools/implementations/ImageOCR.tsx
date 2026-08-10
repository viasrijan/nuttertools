import { useState } from 'react'
import DropZone from '../../components/DropZone'

export default function ImageOCR() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('')

  const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(f)
  })

  const proxyOcr = async (file: File): Promise<string> => {
    const res = await fetch('/api/proxy?service=ocrspace', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ image: await fileToBase64(file), language: 'eng', mime: file.type }),
    })
    if (!res.ok) throw new Error(`proxy (${res.status})`)
    const data = await res.json()
    return (data.ParsedResults?.[0]?.ParsedText || '').trim()
  }

  const webOcr = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append('apikey', 'helloworld')
    fd.append('language', 'eng')
    fd.append('isOverlayRequired', 'false')
    fd.append('file', file)
    const res = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: fd })
    if (!res.ok) throw new Error(`OCR service error (${res.status})`)
    const data = await res.json()
    if (data.IsErroredOnProcessing) throw new Error(data.ErrorMessage?.[0]?.Message || 'OCR failed')
    return (data.ParsedResults?.[0]?.ParsedText || '').trim()
  }

  const localOcr = async (file: File): Promise<string> => {
    const { createWorker } = await import('tesseract.js')
    const worker = await createWorker('eng')
    try {
      const ret = await worker.recognize(file)
      return ret.data.text
    } finally {
      await worker.terminate()
    }
  }

  const onFiles = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setLoading(true)
    setMode('')
    try {
      setMode('web')
      setText(await proxyOcr(file))
    } catch (e: any) {
      console.log('proxy OCR failed, falling back', e)
      try {
        setText(await webOcr(file))
      } catch (e2: any) {
        console.log('web OCR failed, falling back to local', e2)
        try {
          setMode('local')
          setText('(Local OCR fallback — first run downloads ~2MB model)\n\n' + await localOcr(file))
        } catch (e3: any) {
          setText('Error: ' + e3.message)
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="image/*" multiple={false} label="Drop image to extract text" />
      {loading && <p className="text-sm animate-pulse">{mode === 'web' ? 'Reading text via web OCR…' : 'Reading text…'}</p>}
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Extracted text will appear here..." className="w-full h-[260px] border p-3 text-sm" />
      <div className="flex items-center gap-3">
        <button onClick={() => navigator.clipboard.writeText(text)} className="px-4 py-2 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy Text</button>
        {text && !loading && <span className="text-[11px] text-zinc-500">{mode === 'local' ? 'Local OCR (tesseract.js)' : 'Powered by OCR.space free API'}</span>}
      </div>
    </div>
  )
}
