import { useState } from 'react'
import DropZone from '../../components/DropZone'
import * as pdfjs from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(0.6)
  const [scale, setScale] = useState(1.5)
  const [busy, setBusy] = useState(false)
  const [stats, setStats] = useState<{ before: number, after: number } | null>(null)

  const compress = async () => {
    if (!file) return
    setBusy(true)
    try {
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
      const out = await PDFDocument.create()
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
        const blob: Blob | null = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality))
        const bytes = new Uint8Array(await (blob as Blob).arrayBuffer())
        const img = await out.embedJpg(bytes)
        const p = out.addPage([viewport.width, viewport.height])
        p.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height })
      }
      const data = await out.save()
      setStats({ before: file.size, after: data.length })
      saveBlob(bytesToBlob(data, 'application/pdf'), 'compressed.pdf')
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="application/pdf" multiple={false} label="Drop a PDF to compress" />
      {file && <p className="text-xs font-medium text-zinc-500">Loaded: {file.name} ({(file.size / 1024).toFixed(0)} KB)</p>}
      <label className="block text-sm font-semibold">Image quality: {Math.round(quality * 100)}%<input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e => setQuality(parseFloat(e.target.value))} className="w-full mt-2" /></label>
      <label className="block text-sm font-semibold">Resolution: {scale}×<input type="range" min={0.5} max={3} step={0.1} value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full mt-2" /></label>
      <button onClick={compress} disabled={busy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Compressing…' : 'Compress & download'}</button>
      {stats && (
        <div className="border p-3 text-sm">
          <b>{Math.round(stats.before / 1024)} KB</b> → <b className="text-emerald-600">{Math.round(stats.after / 1024)} KB</b>
          {' '}(saved {Math.max(0, Math.round((1 - stats.after / stats.before) * 100))}%)
        </div>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Renders pages to images then rebuilds the PDF — great for scanned documents, but text becomes non-selectable.</p>
    </div>
  )
}
