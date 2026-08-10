import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function TxtToPdf() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const convert = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true); setError('')
    try {
      const text = await file.text()
      if (!text.trim()) { setError('The file is empty.'); setBusy(false); return }
      const pdf = await PDFDocument.create()
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const size = 11
      const margin = 50
      let page = pdf.addPage([612, 792])
      let y = 792 - margin
      for (const rawLine of text.split(/\r?\n/)) {
        const words = rawLine.split(/\s+/).filter(Boolean)
        let line = ''
        for (const w of words) {
          if (font.widthOfTextAtSize((line + ' ' + w).trim(), size) > (612 - margin * 2) * 0.98) {
            if (y < margin) { page = pdf.addPage([612, 792]); y = 792 - margin }
            page.drawText(line.trim(), { x: margin, y, size, font, color: rgb(0, 0, 0) })
            y -= size + 2
            line = w
          } else line = (line + ' ' + w).trim()
        }
        if (line) {
          if (y < margin) { page = pdf.addPage([612, 792]); y = 792 - margin }
          page.drawText(line, { x: margin, y, size, font, color: rgb(0, 0, 0) })
          y -= size + 2
        }
        y -= size / 2
      }
      saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), 'document.pdf')
    } catch (e: any) { setError(e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={convert} accept=".txt,text/plain" multiple={false} label="Drop a .txt file to convert to PDF" />
      {busy && <Progress label="Converting text to PDF…" />}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
