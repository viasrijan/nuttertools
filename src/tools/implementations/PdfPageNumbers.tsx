import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import Progress from '../../components/Progress'
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

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size }] : []

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
    <div className="space-y-5 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="application/pdf" multiple={false} files={dropFiles} onClear={() => setFile(null)} label="Drop a PDF to add page numbers" />
      {file && <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Loaded: {file.name}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-bold">Start at <input type="number" value={start} onChange={e => setStart(parseInt(e.target.value) || 1)} className="px-2 h-10 w-20 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" /></label>
        <label className="text-sm font-bold">Size <input type="number" value={size} onChange={e => setSize(parseInt(e.target.value) || 10)} className="px-2 h-10 w-20 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" /></label>
        <select value={pos} onChange={e => setPos(e.target.value)} className="px-2 h-10 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
          {POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <button onClick={run} disabled={busy} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors">{busy ? 'Working…' : 'Add numbers & download'}</button>
        {busy && <Progress label="Adding page numbers…" />}
      </div>
    </div>
  )
}
