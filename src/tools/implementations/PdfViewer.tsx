import { useRef, useState } from 'react'
import DropZone from '../../components/DropZone'
import * as pdfjs from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function PdfViewer() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const layersRef = useRef<{ canvas: HTMLCanvasElement, overlay: HTMLCanvasElement, scale: number }[]>([])

  const load = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true); setError('')
    try {
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
      const holder = document.getElementById('pdfviewer-layers')
      if (!holder) return
      holder.innerHTML = ''
      layersRef.current = []
      const first = await pdf.getPage(1)
      const scale = Math.min(1.5, 1000 / first.getViewport({ scale: 1 }).width)
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        canvas.className = 'w-full border-b'
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
        const overlay = document.createElement('canvas')
        overlay.width = viewport.width; overlay.height = viewport.height
        overlay.className = 'absolute inset-0 w-full'
        overlay.style.touchAction = 'none'
        const ctx = overlay.getContext('2d')!
        ctx.strokeStyle = '#EF4444'; ctx.lineWidth = 3; ctx.lineCap = 'round'
        let drawing = false
        const pos = (e: PointerEvent) => { const r = overlay.getBoundingClientRect(); return { x: (e.clientX - r.left) * (overlay.width / r.width), y: (e.clientY - r.top) * (overlay.height / r.height) } }
        overlay.onpointerdown = (e) => { drawing = true; overlay.setPointerCapture(e.pointerId); const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y) }
        overlay.onpointermove = (e) => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke() }
        overlay.onpointerup = () => { drawing = false }
        overlay.onpointerleave = () => { drawing = false }
        const wrap = document.createElement('div')
        wrap.className = 'relative'
        wrap.appendChild(canvas); wrap.appendChild(overlay)
        holder.appendChild(wrap)
        layersRef.current.push({ canvas, overlay, scale })
      }
    } catch (e: any) { setError(e.message) }
    setBusy(false)
  }

  const download = async () => {
    if (!layersRef.current.length) return
    setBusy(true)
    try {
      const out = await PDFDocument.create()
      for (const { canvas, overlay } of layersRef.current) {
        const merged = document.createElement('canvas')
        merged.width = canvas.width; merged.height = canvas.height
        const ctx = merged.getContext('2d')!
        ctx.drawImage(canvas, 0, 0)
        ctx.drawImage(overlay, 0, 0)
        const blob: Blob | null = await new Promise(r => merged.toBlob(r, 'image/jpeg', 0.92))
        const bytes = new Uint8Array(await (blob as Blob).arrayBuffer())
        const img = await out.embedJpg(bytes)
        const p = out.addPage([canvas.width, canvas.height])
        p.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height })
      }
      saveBlob(bytesToBlob(await out.save(), 'application/pdf'), 'annotated.pdf')
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={load} accept="application/pdf" multiple={false} label="Drop a PDF to view and annotate" />
      {busy && <p className="text-sm animate-pulse">Rendering…</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div id="pdfviewer-layers" className="space-y-3 max-h-[70vh] overflow-auto border p-3" />
      {layersRef.current.length > 0 && (
        <button onClick={download} className="px-5 h-10 bg-zinc-900 text-white text-sm">Download annotated PDF</button>
      )}
      <p className="text-[11px] font-medium text-zinc-500">Drag on the pages to highlight. Drawing is baked into the downloaded PDF.</p>
    </div>
  )
}
