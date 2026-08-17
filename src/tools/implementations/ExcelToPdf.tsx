import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import * as XLSX from 'xlsx'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

const CELL_W = 140
const ROW_H = 16

export default function ExcelToPdf() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const convert = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true); setError('')
    try {
      const wb = XLSX.read(await file.arrayBuffer())
      const pdf = await PDFDocument.create()
      const font = await pdf.embedFont(StandardFonts.HelveticaBold)
      const reg = await pdf.embedFont(StandardFonts.Helvetica)
      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName]
        const rows: (string | number)[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' })
        if (!rows.length) continue
        const cols = Math.max(...rows.map(r => r.length))
        const pageW = Math.min(792, 60 + cols * CELL_W)
        const page = pdf.addPage([pageW, 792])
        const header = rows[0]
        const body = rows.slice(1)
        const MAX_ROWS = Math.floor(700 / ROW_H)
        let y = 772
        page.drawText(sheetName, { x: 30, y: 780, size: 12, font })
        y -= ROW_H + 4
        header.forEach((h, i) => {
          if (h) page.drawText(String(h), { x: 30 + i * CELL_W + 4, y, size: 9, font, color: rgb(0, 0, 0) })
        })
        y -= ROW_H
        page.drawLine({ start: { x: 30, y }, end: { x: pageW - 30, y }, thickness: 1, color: rgb(0.6, 0.6, 0.6) })
        let r = 0
        for (const row of body) {
          if (r > 0 && r % MAX_ROWS === 0) {
            const p2 = pdf.addPage([pageW, 792])
            const h2 = rows[0]
            let y2 = 772
            h2.forEach((h, i) => { if (h) p2.drawText(String(h), { x: 30 + i * CELL_W + 4, y: y2, size: 9, font }) })
            y2 -= ROW_H
            p2.drawLine({ start: { x: 30, y: y2 }, end: { x: pageW - 30, y: y2 }, thickness: 1, color: rgb(0.6, 0.6, 0.6) })
            y = y2 - ROW_H
          }
          row.forEach((cell, i) => {
            if (cell !== '' && cell != null) page.drawText(String(cell).slice(0, 40), { x: 30 + i * CELL_W + 4, y, size: 8, font: reg, color: rgb(0.1, 0.1, 0.1) })
          })
          y -= ROW_H
          r++
        }
      }
      saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), 'spreadsheet.pdf')
    } catch (e: any) { setError(e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <DropZone onFiles={convert} accept=".xlsx,.xls,.csv" multiple={false} label="Drop an Excel file to convert to PDF" />
      {busy && <Progress label="Rendering spreadsheet…" />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-[11px] font-medium text-zinc-500">Each sheet becomes a section; wide sheets get wider pages. Cell values are truncated to 40 chars.</p>
    </div>
  )
}
