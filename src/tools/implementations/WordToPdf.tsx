import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import mammoth from 'mammoth'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function WordToPdf() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const convert = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true); setError('')
    try {
      const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
      const text = res.value
      if (!text.trim()) { setError('No text found in this document.'); setBusy(false); return }
      const pdf = await PDFDocument.create()
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const size = 11
      const margin = 50
      let page = pdf.addPage([612, 792])
      let y = 792 - margin
      const charsPerLine = Math.floor((612 - margin * 2) / 5.5)
      for (const para of text.split(/\n\n|\r\n\r\n/)) {
        const words = para.split(/\s+/).filter(Boolean)
        let line = ''
        for (const w of words) {
          if (font.widthOfTextAtSize((line + ' ' + w).trim(), size) > (612 - margin * 2) * 0.98) {
            if (y < margin) { page = pdf.addPage([612, 792]); y = 792 - margin }
            page.drawText(line.trim(), { x: margin, y, size, font, color: rgb(0, 0, 0) })
            y -= size + 3
            line = w
          } else line = (line + ' ' + w).trim()
        }
        if (line) {
          if (y < margin) { page = pdf.addPage([612, 792]); y = 792 - margin }
          page.drawText(line, { x: margin, y, size, font, color: rgb(0, 0, 0) })
          y -= size + 3
        }
        y -= size / 2
        void charsPerLine
      }
      saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), 'converted.pdf')
    } catch (e: any) { setError(e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={convert} accept=".docx,.doc" multiple={false} label="Drop a Word document to convert to PDF" />
      {busy && <Progress label="Converting Word to PDF…" />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-[11px] font-medium text-zinc-500">Extracts the text (formatting like fonts and images is not preserved) and generates a clean A4 PDF.</p>
    </div>
  )
}
