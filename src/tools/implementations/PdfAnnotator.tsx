import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import * as pdfjs from 'pdfjs-dist'
import { PDFDocument, rgb } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

type Ann = { type: 'rect' | 'highlight' | 'text', x1: number, y1: number, x2: number, y2: number, text?: string }

export default function PdfAnnotator() {
  const [file, setFile] = useState<File | null>(null)
  const [pdf, setPdf] = useState<any>(null)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [anns, setAnns] = useState<Record<number, Ann[]>>({})
  const [tool, setTool] = useState<'rect' | 'highlight' | 'text'>('rect')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawStart = useRef<{ x: number, y: number } | null>(null)
  const SCALE = 1.5

  const load = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setFile(f)
    // @ts-ignore
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    const p = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise
    setPdf(p)
    setNumPages(p.numPages)
    setPageNum(1)
    setAnns({})
  }

  useEffect(() => {
    if (!pdf) return
    let alive = true
    ;(async () => {
      const page = await pdf.getPage(pageNum)
      const canvas = canvasRef.current
      if (!canvas || !alive) return
      const vp = page.getViewport({ scale: SCALE })
      canvas.width = vp.width
      canvas.height = vp.height
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport: vp }).promise
      if (!alive) return
      for (const a of anns[pageNum] || []) drawAnn(ctx, a)
    })()
    return () => { alive = false }
  }, [pdf, pageNum, anns])

  const drawAnn = (ctx: CanvasRenderingContext2D, a: Ann) => {
    ctx.save()
    if (a.type === 'highlight') {
      ctx.fillStyle = 'rgba(255, 230, 0, 0.35)'
      ctx.fillRect(a.x1, a.y1, a.x2 - a.x1, a.y2 - a.y1)
    } else if (a.type === 'rect') {
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.strokeRect(a.x1, a.y1, a.x2 - a.x1, a.y2 - a.y1)
    } else if (a.type === 'text' && a.text) {
      ctx.fillStyle = '#1e293b'
      ctx.font = '14px sans-serif'
      ctx.fillText(a.text, a.x1, a.y1)
    }
    ctx.restore()
  }

  const onDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    drawStart.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    if (tool === 'text') {
      const s = drawStart.current
      const t = window.prompt('Annotation text:')
      if (t && s) {
        setAnns(prev => ({ ...prev, [pageNum]: [...(prev[pageNum] || []), { type: 'text' as const, x1: s.x, y1: s.y, x2: 0, y2: 0, text: t }] }))
      }
      drawStart.current = null
    }
  }

  const onMove = (e: React.MouseEvent) => {
    if (!drawStart.current || tool === 'text') return
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left, y = e.clientY - rect.top
    const s = drawStart.current
    if (!s) return
    setAnns(prev => {
      const list = [...(prev[pageNum] || [])]
      const last = list[list.length - 1]
      if (last && last.type !== 'text') { list[list.length - 1] = { ...last, x2: x, y2: y } }
      else list.push({ type: tool, x1: s.x, y1: s.y, x2: x, y2: y })
      return { ...prev, [pageNum]: list }
    })
  }

  const onUp = () => { drawStart.current = null }

  const exportPdf = async () => {
    if (!pdf || !file) return
    const doc = await PDFDocument.load(await file.arrayBuffer())
    for (const [pStr, list] of Object.entries(anns)) {
      const p = doc.getPage(parseInt(pStr) - 1)
      const { width, height } = p.getSize()
      for (const a of list) {
        const x1 = a.x1 / SCALE, y1 = height - a.y1 / SCALE, x2 = a.x2 / SCALE, y2 = height - a.y2 / SCALE
        if (a.type === 'highlight') p.drawRectangle({ x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1), color: rgb(1, 0.9, 0.1), opacity: 0.35 })
        if (a.type === 'rect') p.drawRectangle({ x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1), borderColor: rgb(0.94, 0.27, 0.27), borderWidth: 2 })
        if (a.type === 'text' && a.text) {
          const font = await doc.embedFont('Helvetica')
          p.drawText(a.text, { x: x1, y: y1, size: 11, font })
        }
      }
    }
    const out = await doc.save()
    saveBlob(bytesToBlob(out, 'application/pdf'), file.name.replace(/\.[^.]+$/, '') + '-annotated.pdf')
  }

  return (
    <div className="space-y-5">
      <DropZone onFiles={load} accept="application/pdf" multiple={false} label="Drop a PDF to draw on it" />
      {pdf && (
        <>
          <div className="flex flex-wrap gap-2 text-sm items-center">
            {(['rect', 'highlight', 'text'] as const).map(t => (
              <Button variant="outline" key={t} onClick={() => setTool(t)} className={`px-4 h-9  capitalize ${tool === t ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{t === 'rect' ? '□ Box' : t === 'highlight' ? '🟡 Highlight' : '🅣 Text'}</Button>
            ))}
            <span className="text-xs text-zinc-500 mx-2">Page {pageNum}/{numPages}</span>
            <Button variant="outline" onClick={() => setPageNum(p => Math.max(1, p - 1))} className="px-3 h-9  text-sm">←</Button>
            <Button variant="outline" onClick={() => setPageNum(p => Math.min(numPages, p + 1))} className="px-3 h-9  text-sm">→</Button>
            <Button variant="secondary" onClick={exportPdf} className="ml-auto">Download annotated PDF</Button>
          </div>
          <canvas ref={canvasRef} className="max-w-full border bg-white" onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} />
        </>
      )}
    </div>
  )
}
