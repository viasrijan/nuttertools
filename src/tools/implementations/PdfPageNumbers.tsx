import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

const POSITIONS = [
  { id: 'br', label: 'Bottom right', x: (w: number, tw: number) => w - tw - 30, y: (h: number) => 30 },
  { id: 'bl', label: 'Bottom left', x: () => 30, y: (h: number) => 30 },
  { id: 'tr', label: 'Top right', x: (w: number, tw: number) => w - tw - 30, y: (h: number) => h - 45 },
  { id: 'tl', label: 'Top left', x: () => 30, y: (h: number) => h - 45 },
  { id: 'bc', label: 'Bottom center', x: (w: number, tw: number) => w / 2 - tw / 2, y: (h: number) => 30 },
]

export default function PdfPageNumbers() {
  const [file, setFile] = useState<File | null>(null)
  const [start, setStart] = useState(1)
  const [pos, setPos] = useState('br')
  const [size, setSize] = useState(12)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer())
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const p = POSITIONS.find(x => x.id === pos)!
      const pages = pdf.getPages()
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const label = String(start + i)
        const tw = font.widthOfTextAtSize(label, size)
        const { width, height } = page.getSize()
        page.drawText(label, { x: p.x(width, tw), y: p.y(height), size, font, color: rgb(0.3, 0.3, 0.3) })
      }
      saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), 'numbered.pdf')
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="application/pdf" multiple={false} label="Drop a PDF to add page numbers" />
      {file && <p className="text-xs font-medium text-zinc-500">Loaded: {file.name}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Start at <input type="number" value={start} onChange={e => setStart(parseInt(e.target.value) || 1)} className="border px-2 h-9 w-20 text-sm" /></label>
        <label className="text-sm">Size <input type="number" value={size} onChange={e => setSize(parseInt(e.target.value) || 10)} className="border px-2 h-9 w-20 text-sm" /></label>
        <select value={pos} onChange={e => setPos(e.target.value)} className="border px-2 h-9 text-sm bg-transparent">
          {POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <button onClick={run} disabled={busy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{busy ? 'Working…' : 'Add numbers & download'}</button>
      </div>
    </div>
  )
}
