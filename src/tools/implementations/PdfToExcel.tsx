import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import * as pdfjs from 'pdfjs-dist'
import * as XLSX from 'xlsx'
import { saveBlob } from '../../lib/download'

export default function PdfToExcel() {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const convert = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true); setStatus('Reading PDF…')
    try {
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
      const wb = XLSX.utils.book_new()
      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`Extracting tables from page ${i}/${pdf.numPages}…`)
        const page = await pdf.getPage(i)
        const tc = await page.getTextContent()
        const rows: { y: number, x: number, text: string }[] = []
        for (const it of tc.items as any[]) {
          if (!it.str || !it.str.trim()) continue
          const t = it.transform as number[]
          rows.push({ y: t[5], x: t[4], text: it.str })
        }
        rows.sort((a, b) => b.y - a.y || a.x - b.x)
        const grid: string[][] = []
        let lastY: number | null = null
        for (const r of rows) {
          if (lastY === null || Math.abs(r.y - lastY) > 3) { grid.push([]); lastY = r.y }
          grid[grid.length - 1].push(r.text)
        }
        if (grid.length) {
          const sheet = XLSX.utils.aoa_to_sheet(grid)
          XLSX.utils.book_append_sheet(wb, sheet, `Page ${i}`)
        }
      }
      setStatus('Writing .xlsx…')
      const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      saveBlob(new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), file.name.replace(/\.[^.]+$/, '') + '.xlsx')
      setStatus('Done — check your downloads.')
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={convert} accept="application/pdf" multiple={false} label="Drop a PDF — tables become Excel sheets" />
      {busy && <Progress label={status} />}
      {!busy && status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">Extracts text line-by-line using each line&apos;s position in the document. Scanned (image) PDFs yield no text — run Image OCR first for those.</p>
    </div>
  )
}
