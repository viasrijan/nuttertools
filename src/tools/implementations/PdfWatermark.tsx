import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import Progress from '../../components/Progress'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState(0.2)
  const [color, setColor] = useState('#EF4444')
  const [size, setSize] = useState(60)
  const [busy, setBusy] = useState(false)

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size }] : []

  function hexToRgb(hex: string) { const n = parseInt(hex.slice(1), 16); return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255) }

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer())
      const font = await pdf.embedFont(StandardFonts.HelveticaBold)
      const pages = pdf.getPages()
      for (const page of pages) {
        const { width, height } = page.getSize()
        const tw = font.widthOfTextAtSize(text, size)
        const th = font.heightAtSize(size)
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            page.drawText(text, {
              x: 20 + col * ((width - tw - 40) / 2),
              y: 20 + row * ((height - th - 40) / 2),
              size, font,               color: hexToRgb(color),
              rotate: degrees(35),
              opacity,
            })
          }
        }
      }
      saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), 'watermarked.pdf')
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="application/pdf" multiple={false} files={dropFiles} onClear={() => setFile(null)} label="Drop a PDF to watermark" />
      <input value={text} onChange={e => setText(e.target.value)} className="w-full px-3 h-10 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" placeholder="Watermark text" />
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Opacity ({Math.round(opacity * 100)}%)<input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full mt-2" /></label>
        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Size ({size})<input type="range" min={24} max={120} value={size} onChange={e => setSize(parseInt(e.target.value))} className="w-full mt-2" /></label>
      </div>
      <label className="text-sm font-bold flex items-center gap-3 text-zinc-700 dark:text-zinc-300">Color <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-14 h-10 bg-transparent" /></label>
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors">{busy ? 'Adding watermark…' : 'Add watermark & download'}</button>
      {busy && <Progress label="Adding watermark…" />}
    </div>
  )
}
